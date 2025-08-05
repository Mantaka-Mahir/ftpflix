import React, { useEffect, useState } from 'react'

// Performance monitoring component for development
const PerformanceMonitor = () => {
    const [metrics, setMetrics] = useState({
        memory: 0,
        renderCount: 0,
        fps: 0
    })
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        let frameCount = 0
        let lastTime = performance.now()
        let renderCount = 0

        const updateMetrics = () => {
            frameCount++
            renderCount++

            if (performance.memory) {
                const memory = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024)
                setMetrics(prev => ({
                    ...prev,
                    memory,
                    renderCount
                }))
            }
        }

        const measureFPS = () => {
            const now = performance.now()
            const delta = now - lastTime

            if (delta >= 1000) {
                const fps = Math.round((frameCount * 1000) / delta)
                setMetrics(prev => ({
                    ...prev,
                    fps
                }))
                frameCount = 0
                lastTime = now
            }

            requestAnimationFrame(measureFPS)
        }

        // Only show in development
        if (process.env.NODE_ENV === 'development') {
            const interval = setInterval(updateMetrics, 1000)
            measureFPS()

            // Show/hide with keyboard shortcut
            const handleKeyPress = (e) => {
                if (e.ctrlKey && e.shiftKey && e.key === 'P') {
                    setIsVisible(prev => !prev)
                }
            }

            window.addEventListener('keydown', handleKeyPress)

            return () => {
                clearInterval(interval)
                window.removeEventListener('keydown', handleKeyPress)
            }
        }
    }, [])

    if (process.env.NODE_ENV !== 'development' || !isVisible) {
        return null
    }

    return (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-3 rounded text-xs font-mono z-50">
            <div className="mb-1">Memory: {metrics.memory}MB</div>
            <div className="mb-1">FPS: {metrics.fps}</div>
            <div className="mb-1">Renders: {metrics.renderCount}</div>
            <div className="text-gray-400 text-xs">Ctrl+Shift+P to toggle</div>
        </div>
    )
}

export default PerformanceMonitor
