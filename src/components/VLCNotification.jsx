import React, { useEffect, useState } from 'react'
import { FiX, FiExternalLink, FiDownload, FiCopy } from 'react-icons/fi'
import { useMovie } from '../context/MovieContext'
import VLCBatchLauncher from './VLCBatchLauncher'

function VLCNotification() {
    const { state } = useMovie()
    const [isVisible, setIsVisible] = useState(false)
    const [showCopyConfirm, setShowCopyConfirm] = useState(false)

    useEffect(() => {
        if (state.currentVideo && state.currentVideo.openedInVLC) {
            setIsVisible(true)
            // Auto-hide after 10 seconds
            const timer = setTimeout(() => {
                setIsVisible(false)
            }, 10000)
            return () => clearTimeout(timer)
        }
    }, [state.currentVideo])

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(state.currentVideo.url)
            setShowCopyConfirm(true)
            setTimeout(() => setShowCopyConfirm(false), 2000)
        } catch (error) {
            console.error('Failed to copy to clipboard:', error)
        }
    }

    const openDirectly = () => {
        window.open(state.currentVideo.url, '_blank')
    }

    const openInVLCManually = () => {
        // Try VLC opening method (single attempt to avoid multiple windows)
        const videoUrl = state.currentVideo.url

        // Primary method: VLC protocol
        try {
            window.location.href = `vlc://${videoUrl}`
            console.log('Manual VLC opening attempted')
        } catch (error) {
            console.warn('Manual VLC protocol failed:', error)
            // Show manual instructions if automatic fails
            alert(`VLC opening failed. Manual steps:\n\n1. Copy the URL: ${videoUrl}\n2. Open VLC Media Player\n3. Press Ctrl+N (or Media → Open Network Stream)\n4. Paste the URL and click Play`)
        }
    }

    if (!isVisible || !state.currentVideo) return null

    return (
        <div className="fixed top-4 right-4 z-50 bg-netflix-black bg-opacity-95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-600 max-w-md">
            <div className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <h3 className="text-white font-semibold">Opening in VLC</h3>
                    </div>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <FiX size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="text-sm text-gray-300 mb-4">
                    <p className="font-medium text-white mb-1">{state.currentVideo.title}</p>
                    <p>Video should open in VLC Media Player automatically.</p>
                    <p className="text-xs text-gray-400 mt-2">
                        If VLC doesn't open automatically, use the buttons below.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={openInVLCManually}
                        className="flex items-center gap-1 bg-orange-600 hover:bg-orange-700 text-white text-xs px-3 py-2 rounded transition-colors"
                        title="Try opening in VLC again"
                    >
                        <FiExternalLink size={14} />
                        Try VLC Again
                    </button>

                    <button
                        onClick={openDirectly}
                        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-2 rounded transition-colors"
                        title="Open URL directly in browser"
                    >
                        <FiExternalLink size={14} />
                        Open URL
                    </button>

                    <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-1 bg-gray-600 hover:bg-gray-700 text-white text-xs px-3 py-2 rounded transition-colors"
                        title="Copy URL to clipboard"
                    >
                        <FiCopy size={14} />
                        {showCopyConfirm ? 'Copied!' : 'Copy URL'}
                    </button>
                </div>

                {/* VLC Instructions */}
                <div className="mt-3 p-2 bg-gray-800 rounded text-xs text-gray-400">
                    <p className="font-medium mb-1">If VLC doesn't open:</p>
                    <ol className="list-decimal list-inside space-y-1">
                        <li>Copy the URL above</li>
                        <li>Open VLC Media Player</li>
                        <li>Go to Media → Open Network Stream</li>
                        <li>Paste the URL and click Play</li>
                    </ol>
                </div>

                {/* Windows VLC Launchers */}
                <VLCBatchLauncher
                    videoUrl={state.currentVideo.url}
                    title={state.currentVideo.title}
                />
            </div>
        </div>
    )
}

export default VLCNotification
