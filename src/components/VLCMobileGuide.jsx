import React, { useState, useEffect } from 'react'
import { FiSmartphone, FiDownload, FiExternalLink, FiInfo, FiX } from 'react-icons/fi'

function VLCMobileGuide() {
    const [isVisible, setIsVisible] = useState(false)
    const [platform, setPlatform] = useState('unknown')

    useEffect(() => {
        const detectPlatform = () => {
            const userAgent = navigator.userAgent.toLowerCase()
            if (/android/.test(userAgent)) {
                setPlatform('android')
            } else if (/iphone|ipad/.test(userAgent)) {
                setPlatform('ios')
            } else {
                return // Don't show for desktop
            }

            // Show guide for mobile users after a delay
            const timer = setTimeout(() => {
                setIsVisible(true)
            }, 3000)

            return () => clearTimeout(timer)
        }

        detectPlatform()
    }, [])

    const openPlayStore = () => {
        if (platform === 'android') {
            window.open('https://play.google.com/store/apps/details?id=org.videolan.vlc', '_blank')
        } else if (platform === 'ios') {
            window.open('https://apps.apple.com/app/vlc-for-mobile/id650377962', '_blank')
        }
    }

    const openVLCWebsite = () => {
        window.open('https://www.videolan.org/vlc/download-android.html', '_blank')
    }

    if (!isVisible || platform === 'unknown') return null

    return (
        <div className="fixed bottom-4 right-4 z-50 bg-ftpflix-black bg-opacity-95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-600 max-w-sm">
            <div className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <FiSmartphone className="text-orange-500" size={18} />
                        <h3 className="text-white font-semibold">
                            VLC for {platform === 'android' ? 'Android' : 'iOS'}
                        </h3>
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
                    <p className="mb-2">
                        For the best video streaming experience on {platform === 'android' ? 'Android' : 'iOS'},
                        we recommend using VLC Media Player.
                    </p>
                    <div className="bg-gray-800 rounded p-2 mb-3">
                        <p className="text-xs text-gray-400 mb-1">
                            <FiInfo className="inline mr-1" />
                            Why VLC?
                        </p>
                        <ul className="text-xs text-gray-300 space-y-1">
                            <li>• Plays any video format</li>
                            <li>• Better streaming performance</li>
                            <li>• Advanced playback controls</li>
                            <li>• Subtitle support</li>
                        </ul>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                    <button
                        onClick={openPlayStore}
                        className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded transition-colors"
                    >
                        <FiDownload size={16} />
                        Download VLC from {platform === 'android' ? 'Play Store' : 'App Store'}
                    </button>

                    {platform === 'android' && (
                        <button
                            onClick={openVLCWebsite}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded transition-colors"
                        >
                            <FiExternalLink size={16} />
                            Visit VLC Website
                        </button>
                    )}
                </div>

                {/* Instructions */}
                <div className="mt-3 p-2 bg-gray-800 rounded text-xs text-gray-400">
                    <p className="font-medium mb-2">After installing VLC:</p>
                    <ol className="list-decimal list-inside space-y-1">
                        <li>Click "Watch in VLC" on any video</li>
                        <li>Allow browser to open VLC when prompted</li>
                        <li>Enjoy seamless video streaming!</li>
                    </ol>
                </div>

                {/* Dismiss option */}
                <div className="mt-3 text-center">
                    <button
                        onClick={() => setIsVisible(false)}
                        className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                    >
                        Don't show this again
                    </button>
                </div>
            </div>
        </div>
    )
}

export default VLCMobileGuide
