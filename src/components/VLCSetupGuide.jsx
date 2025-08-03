import React, { useState } from 'react'
import { FiX, FiExternalLink, FiDownload, FiInfo } from 'react-icons/fi'

function VLCSetupGuide() {
    const [isVisible, setIsVisible] = useState(false)

    return (
        <>
            {/* Help Button */}
            <button
                onClick={() => setIsVisible(true)}
                className="fixed bottom-4 left-4 z-40 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
                title="VLC Setup Help"
            >
                <FiInfo size={20} />
            </button>

            {/* Setup Guide Modal */}
            {isVisible && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
                    <div className="bg-netflix-black border border-gray-600 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-600">
                            <h2 className="text-xl font-semibold text-white">VLC Media Player Setup</h2>
                            <button
                                onClick={() => setIsVisible(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <FiX size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Download VLC */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                    <FiDownload size={20} />
                                    1. Download VLC Media Player
                                </h3>
                                <p className="text-gray-300 mb-3">
                                    If you don't have VLC installed, download it from the official website:
                                </p>
                                <a
                                    href="https://www.videolan.org/vlc/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded transition-colors"
                                >
                                    <FiExternalLink size={16} />
                                    Download VLC
                                </a>
                            </div>

                            {/* Windows Setup */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">
                                    2. Windows Setup (Optional)
                                </h3>
                                <div className="bg-gray-800 p-4 rounded text-sm text-gray-300 space-y-2">
                                    <p>To enable automatic VLC opening:</p>
                                    <ol className="list-decimal list-inside space-y-1 ml-4">
                                        <li>Open VLC Media Player</li>
                                        <li>Go to Tools → Preferences</li>
                                        <li>Click "All" in Show settings (bottom left)</li>
                                        <li>Navigate to Interface → Main interfaces</li>
                                        <li>Check "Allow only one instance"</li>
                                        <li>Check "Use only one instance when started from file"</li>
                                        <li>Click Save</li>
                                    </ol>
                                </div>
                            </div>

                            {/* Manual Method */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">
                                    3. Manual Method (Always Works)
                                </h3>
                                <div className="bg-gray-800 p-4 rounded text-sm text-gray-300 space-y-2">
                                    <p>If automatic opening doesn't work:</p>
                                    <ol className="list-decimal list-inside space-y-1 ml-4">
                                        <li>Click any play button on this website</li>
                                        <li>A notification will appear with options</li>
                                        <li>Copy the video URL from the notification</li>
                                        <li>Open VLC Media Player</li>
                                        <li>Go to Media → Open Network Stream (Ctrl+N)</li>
                                        <li>Paste the URL and click Play</li>
                                    </ol>
                                </div>
                            </div>

                            {/* Troubleshooting */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">
                                    4. Troubleshooting
                                </h3>
                                <div className="bg-gray-800 p-4 rounded text-sm text-gray-300 space-y-2">
                                    <div>
                                        <strong>If videos won't play in VLC:</strong>
                                        <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                                            <li>Check your internet connection</li>
                                            <li>Try updating VLC to the latest version</li>
                                            <li>Some videos may require network access permissions</li>
                                        </ul>
                                    </div>
                                    <div className="mt-3">
                                        <strong>If popup blocker prevents opening:</strong>
                                        <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                                            <li>Allow popups for this website</li>
                                            <li>Use the "Copy URL" button instead</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-gray-600 text-center">
                            <button
                                onClick={() => setIsVisible(false)}
                                className="bg-netflix-red hover:bg-red-700 text-white px-6 py-2 rounded transition-colors"
                            >
                                Got it!
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default VLCSetupGuide
