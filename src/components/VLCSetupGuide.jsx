import React, { useState } from 'react'
import { FiX, FiExternalLink, FiDownload, FiInfo, FiTerminal, FiCopy } from 'react-icons/fi'

function VLCSetupGuide() {
    const [isVisible, setIsVisible] = useState(false)
    const [showCopyConfirm, setShowCopyConfirm] = useState(false)

    const powershellCommand = "irm https://tanmoythebot.github.io/vlc-protocol/vlc-protocol-setup.ps1 | iex"

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text)
            setShowCopyConfirm(true)
            setTimeout(() => setShowCopyConfirm(false), 2000)
        } catch (error) {
            console.error('Failed to copy to clipboard:', error)
        }
    }

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
                    <div className="bg-ftpflix-black border border-gray-600 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
                                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                    <FiTerminal size={20} />
                                    2. Windows Setup (Recommended)
                                </h3>
                                <div className="bg-blue-900 bg-opacity-50 border border-blue-700 p-4 rounded text-sm text-blue-100 space-y-3">
                                    <p className="font-medium">⚡ Quick Setup - Enable VLC Protocol Automatically:</p>
                                    <p>Run this command in PowerShell as Administrator to properly configure VLC protocol:</p>

                                    <div className="bg-gray-900 p-3 rounded border border-gray-600 font-mono text-xs">
                                        <div className="flex items-center justify-between">
                                            <code className="text-green-400 break-all">
                                                {powershellCommand}
                                            </code>
                                            <button
                                                onClick={() => copyToClipboard(powershellCommand)}
                                                className="ml-2 bg-gray-700 hover:bg-gray-600 text-white p-1 rounded transition-colors flex-shrink-0"
                                                title="Copy command"
                                            >
                                                <FiCopy size={12} />
                                            </button>
                                        </div>
                                        {showCopyConfirm && (
                                            <p className="text-green-400 text-xs mt-1">✓ Copied to clipboard!</p>
                                        )}
                                    </div>

                                    <div className="text-xs space-y-1">
                                        <p><strong>How to run:</strong></p>
                                        <ol className="list-decimal list-inside space-y-1 ml-2">
                                            <li>Right-click Start button → Windows Terminal (Admin)</li>
                                            <li>Paste the command above and press Enter</li>
                                            <li>Allow the script to run when prompted</li>
                                            <li>Restart your browser for changes to take effect</li>
                                        </ol>
                                    </div>
                                </div>

                                <div className="mt-4 bg-gray-800 p-4 rounded text-sm text-gray-300 space-y-2">
                                    <p className="font-medium">Alternative Manual Setup:</p>
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
                                className="bg-ftpflix-red hover:bg-red-700 text-white px-6 py-2 rounded transition-colors"
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
