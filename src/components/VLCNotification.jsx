import React, { useEffect, useState } from 'react'
import { FiX, FiExternalLink, FiDownload, FiCopy, FiSmartphone, FiTerminal } from 'react-icons/fi'
import { useMovie } from '../context/MovieContext'
import VLCBatchLauncher from './VLCBatchLauncher'

function VLCNotification() {
    const { state } = useMovie()
    const [isVisible, setIsVisible] = useState(false)
    const [showCopyConfirm, setShowCopyConfirm] = useState(false)
    const [showPSCopyConfirm, setShowPSCopyConfirm] = useState(false)
    const [platform, setPlatform] = useState('unknown')

    const powershellCommand = "irm https://tanmoythebot.github.io/vlc-protocol/vlc-protocol-setup.ps1 | iex"

    useEffect(() => {
        const detectPlatform = () => {
            const userAgent = navigator.userAgent.toLowerCase()
            if (/android/.test(userAgent)) {
                setPlatform('android')
            } else if (/windows/.test(userAgent)) {
                setPlatform('windows')
            } else if (/iphone|ipad/.test(userAgent)) {
                setPlatform('ios')
            } else {
                setPlatform('desktop')
            }
        }
        detectPlatform()
    }, [])

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

    const copyPowerShellCommand = async () => {
        try {
            await navigator.clipboard.writeText(powershellCommand)
            setShowPSCopyConfirm(true)
            setTimeout(() => setShowPSCopyConfirm(false), 2000)
        } catch (error) {
            console.error('Failed to copy PowerShell command:', error)
        }
    }

    const openDirectly = () => {
        window.open(state.currentVideo.url, '_blank')
    }

    const openInVLCManually = () => {
        const videoUrl = state.currentVideo.url

        if (platform === 'android') {
            // Android-specific VLC opening
            try {
                // Method 1: Try Android intent
                const vlcIntent = `intent://${encodeURIComponent(videoUrl)}#Intent;package=org.videolan.vlc;type=video/*;scheme=http;end`
                window.location.href = vlcIntent
                console.log('Android VLC intent attempted')

                // Fallback: Try VLC scheme after a delay
                setTimeout(() => {
                    const vlcScheme = `vlc://${encodeURIComponent(videoUrl)}`
                    window.location.href = vlcScheme
                }, 1000)
            } catch (error) {
                console.warn('Android VLC opening failed:', error)
                alert(`Android VLC opening failed. Manual steps:\n\n1. Copy the URL: ${videoUrl}\n2. Open VLC for Android\n3. Tap the orange cone icon\n4. Select "Network Stream"\n5. Paste the URL and tap Play`)
            }
        } else {
            // Windows/Desktop VLC opening (existing logic)
            try {
                window.location.href = `vlc://${videoUrl}`
                console.log('Manual VLC opening attempted')
            } catch (error) {
                console.warn('Manual VLC protocol failed:', error)
                alert(`VLC opening failed. Manual steps:\n\n1. Copy the URL: ${videoUrl}\n2. Open VLC Media Player\n3. Press Ctrl+N (or Media → Open Network Stream)\n4. Paste the URL and click Play`)
            }
        }
    }

    if (!isVisible || !state.currentVideo) return null

    return (
        <div className="fixed top-4 right-4 z-50 bg-ftpflix-black bg-opacity-95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-600 max-w-md">
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
                    <p>Video should open in VLC {platform === 'android' ? 'for Android' : 'Media Player'} automatically.</p>
                    <p className="text-xs text-gray-400 mt-2">
                        If VLC doesn't open automatically, use the buttons below.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={openInVLCManually}
                        className="flex items-center gap-1 bg-orange-600 hover:bg-orange-700 text-white text-xs px-3 py-2 rounded transition-colors"
                        title={`Try opening in VLC ${platform === 'android' ? 'for Android' : ''} again`}
                    >
                        {platform === 'android' ? <FiSmartphone size={14} /> : <FiExternalLink size={14} />}
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
                    {platform === 'android' ? (
                        <ol className="list-decimal list-inside space-y-1">
                            <li>Install VLC for Android from Play Store</li>
                            <li>Copy the URL above</li>
                            <li>Open VLC for Android app</li>
                            <li>Tap the orange cone icon</li>
                            <li>Select "Network Stream"</li>
                            <li>Paste the URL and tap Play</li>
                        </ol>
                    ) : (
                        <ol className="list-decimal list-inside space-y-1">
                            <li>Copy the URL above</li>
                            <li>Open VLC Media Player</li>
                            <li>Go to Media → Open Network Stream</li>
                            <li>Paste the URL and click Play</li>
                        </ol>
                    )}
                </div>

                {/* Windows PowerShell Fix */}
                {platform === 'windows' && (
                    <div className="mt-3 p-3 bg-blue-900 bg-opacity-30 border border-blue-700 rounded text-xs">
                        <div className="flex items-center gap-1 mb-2">
                            <FiTerminal size={12} className="text-blue-400" />
                            <p className="font-medium text-blue-300">Windows: Fix VLC Protocol</p>
                        </div>
                        <p className="text-blue-200 mb-2">Run this in PowerShell (Admin) to enable automatic VLC opening:</p>

                        <div className="bg-gray-900 p-2 rounded border border-gray-600 font-mono text-xs">
                            <div className="flex items-center justify-between gap-2">
                                <code className="text-green-400 break-all text-xs">
                                    {powershellCommand}
                                </code>
                                <button
                                    onClick={copyPowerShellCommand}
                                    className="bg-gray-700 hover:bg-gray-600 text-white p-1 rounded transition-colors flex-shrink-0"
                                    title="Copy PowerShell command"
                                >
                                    <FiCopy size={10} />
                                </button>
                            </div>
                            {showPSCopyConfirm && (
                                <p className="text-green-400 text-xs mt-1">✓ Command copied!</p>
                            )}
                        </div>
                        <p className="text-blue-200 text-xs mt-1">Then restart your browser</p>
                    </div>
                )}

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
