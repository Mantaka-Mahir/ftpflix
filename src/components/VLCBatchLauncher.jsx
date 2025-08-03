import React from 'react'
import { FiDownload, FiInfo } from 'react-icons/fi'

function VLCBatchLauncher({ videoUrl, title }) {
    const generateBatchFile = () => {
        const batchContent = `@echo off
echo Opening ${title} in VLC...
start "" "C:\\Program Files\\VideoLAN\\VLC\\vlc.exe" "${videoUrl}"
if %errorlevel% neq 0 (
    echo VLC not found in default location. Trying alternative paths...
    start "" "C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc.exe" "${videoUrl}"
)
if %errorlevel% neq 0 (
    echo VLC not found. Please install VLC Media Player or check the installation path.
    echo URL: ${videoUrl}
    pause
)
exit`

        const blob = new Blob([batchContent], { type: 'text/plain' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `play-${title.replace(/[^a-zA-Z0-9]/g, '_')}.bat`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
    }

    const generatePowerShellFile = () => {
        const psContent = `# PowerShell script to open video in VLC
$title = "${title}"
$videoUrl = "${videoUrl}"

Write-Host "Opening $title in VLC..."

# Try common VLC installation paths
$vlcPaths = @(
    "C:\\Program Files\\VideoLAN\\VLC\\vlc.exe",
    "C:\\Program Files (x86)\\VideoLAN\\VLC\\vlc.exe",
    "$env:LOCALAPPDATA\\Programs\\VLC\\vlc.exe"
)

$vlcFound = $false
foreach ($path in $vlcPaths) {
    if (Test-Path $path) {
        Write-Host "Found VLC at: $path"
        Start-Process -FilePath $path -ArgumentList $videoUrl
        $vlcFound = $true
        break
    }
}

if (-not $vlcFound) {
    Write-Host "VLC not found in common locations. Please install VLC Media Player."
    Write-Host "Video URL: $videoUrl"
    Write-Host "You can copy this URL and paste it into VLC manually."
    Read-Host "Press Enter to exit"
}`

        const blob = new Blob([psContent], { type: 'text/plain' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `play-${title.replace(/[^a-zA-Z0-9]/g, '_')}.ps1`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
    }

    if (!videoUrl) return null

    return (
        <div className="mt-3 p-3 bg-gray-800 rounded">
            <div className="flex items-center gap-2 mb-2">
                <FiInfo size={16} className="text-blue-400" />
                <span className="text-sm font-medium text-white">Windows VLC Launchers</span>
            </div>
            <p className="text-xs text-gray-400 mb-3">
                Download and run these files to open the video in VLC directly:
            </p>
            <div className="flex gap-2">
                <button
                    onClick={generateBatchFile}
                    className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-2 rounded transition-colors"
                    title="Download .bat file to launch VLC"
                >
                    <FiDownload size={12} />
                    Download .bat
                </button>
                <button
                    onClick={generatePowerShellFile}
                    className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-2 rounded transition-colors"
                    title="Download .ps1 file to launch VLC"
                >
                    <FiDownload size={12} />
                    Download .ps1
                </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
                After downloading, double-click the file to open the video in VLC.
            </p>
        </div>
    )
}

export default VLCBatchLauncher
