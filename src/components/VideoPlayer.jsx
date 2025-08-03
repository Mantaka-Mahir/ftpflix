import React, { useEffect, useRef } from 'react'
import { FiX, FiPlay, FiPause, FiVolume2, FiVolumeX, FiMaximize } from 'react-icons/fi'
import { useMovie } from '../context/MovieContext'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

function VideoPlayer() {
    const { state, actions } = useMovie()
    const videoRef = useRef(null)
    const playerRef = useRef(null)

    useEffect(() => {
        if (state.isPlayerOpen && state.currentVideo && videoRef.current) {
      // Initialize Video.js player
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        responsive: true,
        fluid: true,
        playbackRates: [0.5, 1, 1.25, 1.5, 2],
        preload: 'metadata',
        techOrder: ['html5'],
        html5: {
          vhs: {
            overrideNative: true
          },
          nativeVideoTracks: false,
          nativeAudioTracks: false,
          nativeTextTracks: false
        }
      })

      // Set video source with better error handling
      const videoSource = {
        src: state.currentVideo.url,
        type: getVideoType(state.currentVideo.url)
      }
      
      playerRef.current.src(videoSource)

      // Handle loading and errors
      playerRef.current.ready(() => {
        // Add crossorigin attribute for CORS
        const videoElement = playerRef.current.el().querySelector('video')
        if (videoElement) {
          videoElement.crossOrigin = 'anonymous'
          videoElement.setAttribute('preload', 'metadata')
        }
        
        playerRef.current.play().catch(e => {
          console.warn('Auto-play prevented:', e)
        })
      })

            // Handle player events
            playerRef.current.on('ended', () => {
                // Could implement auto-play next episode logic here
                console.log('Video ended')
            })

            playerRef.current.on('error', (e) => {
                console.error('Video player error:', e)
                // Handle video loading errors gracefully
            })
        }

        // Cleanup
        return () => {
            if (playerRef.current) {
                playerRef.current.dispose()
                playerRef.current = null
            }
        }
    }, [state.isPlayerOpen, state.currentVideo])

    // Handle ESC key to close player
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && state.isPlayerOpen) {
                actions.closePlayer()
            }
        }

        if (state.isPlayerOpen) {
            document.addEventListener('keydown', handleKeyDown)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = 'unset'
        }
    }, [state.isPlayerOpen, actions])

  const getVideoType = (url) => {
    const extension = url.split('.').pop().toLowerCase()
    switch (extension) {
      case 'mp4':
        return 'video/mp4'
      case 'mkv':
        return 'video/mp4' // Treat MKV as MP4 for HTML5 compatibility
      case 'avi':
        return 'video/mp4' // Fallback to MP4
      case 'mov':
        return 'video/quicktime'
      case 'wmv':
        return 'video/mp4' // Fallback to MP4
      case 'flv':
        return 'video/mp4' // Fallback to MP4
      case 'webm':
        return 'video/webm'
      case 'm3u8':
        return 'application/x-mpegURL'
      default:
        return 'video/mp4'
    }
  }

  if (!state.isPlayerOpen) return null

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-100 flex items-center justify-center">
            {/* Close Button */}
            <button
                onClick={actions.closePlayer}
                className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2 transition-colors"
            >
                <FiX size={24} />
            </button>

            {/* Video Title */}
            {state.currentVideo && (
                <div className="absolute top-4 left-4 z-10 text-white">
                    <h2 className="text-xl font-semibold bg-black bg-opacity-50 px-4 py-2 rounded">
                        {state.currentVideo.title}
                    </h2>
                    {state.currentVideo.quality && (
                        <span className="text-sm text-gray-300 bg-black bg-opacity-50 px-2 py-1 rounded ml-2">
                            {state.currentVideo.quality}p
                        </span>
                    )}
                </div>
            )}

            {/* Video Player Container */}
            <div className="w-full h-full relative">
                {state.currentVideo ? (
                    <div data-vjs-player className="w-full h-full">
                        <video
                            ref={videoRef}
                            className="video-js vjs-default-skin w-full h-full"
                            preload="auto"
                            controls
                            data-setup="{}"
                        >
                            <p className="vjs-no-js">
                                To view this video please enable JavaScript, and consider upgrading to a web browser that
                                <a href="https://videojs.com/html5-video-support/" target="_blank" rel="noopener noreferrer">
                                    supports HTML5 video
                                </a>.
                            </p>
                        </video>
                    </div>
                ) : (
                    <div className="flex items-center justify-center w-full h-full">
                        <div className="text-white text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                            <p>Loading video...</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Error Fallback */}
            {state.error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
                    <div className="text-white text-center">
                        <h3 className="text-xl font-semibold mb-2">Playback Error</h3>
                        <p className="text-gray-300 mb-4">Unable to load the video. Please try again.</p>
                        <button
                            onClick={actions.closePlayer}
                            className="bg-netflix-red text-white px-6 py-2 rounded hover:bg-red-700 transition-colors"
                        >
                            Close Player
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default VideoPlayer
