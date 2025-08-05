import React, { useState, useEffect, useCallback } from 'react'
import { FiPlay } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useMovie } from '../context/MovieContext'

function HeroSection() {
    const { state, actions } = useMovie()
    const [currentHero, setCurrentHero] = useState(null)
    const [imageLoaded, setImageLoaded] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [imdbMovies, setImdbMovies] = useState([])

    // Get IMDB Top 250 movies
    useEffect(() => {
        if (state.allContent.length > 0) {
            const imdbTop250 = state.allContent.filter(item =>
                item.categoryKey === 'imdb_top_250' && item.banner
            )
            
            if (imdbTop250.length > 0) {
                setImdbMovies(imdbTop250)
                setCurrentHero(imdbTop250[0])
                setCurrentIndex(0)
            }
        }
    }, [state.allContent])

    // Auto-rotate hero content every 4-5 seconds with smooth transitions
    const rotateHero = useCallback(() => {
        if (imdbMovies.length > 1) {
            setCurrentIndex(prevIndex => {
                const nextIndex = (prevIndex + 1) % imdbMovies.length
                setCurrentHero(imdbMovies[nextIndex])
                setImageLoaded(false) // Trigger fade-in animation for new image
                return nextIndex
            })
        }
    }, [imdbMovies])

    useEffect(() => {
        if (imdbMovies.length > 1) {
            // Random interval between 5000ms (5s) and 6000ms (6s) for better viewing
            const getRandomInterval = () => Math.floor(Math.random() * 1000) + 5000
            
            const interval = setInterval(() => {
                rotateHero()
            }, getRandomInterval())

            return () => clearInterval(interval)
        }
    }, [rotateHero, imdbMovies.length])

    const handlePlay = () => {
        if (currentHero) {
            actions.playContent(currentHero)
        }
    }

    if (!currentHero) {
        return (
            <div className="relative h-[80vh] bg-ftpflix-gray">
                <div className="skeleton w-full h-full" />
            </div>
        )
    }

    return (
        <div className="relative h-[80vh] overflow-hidden">
            {/* Background Image with Netflix-style transitions */}
            <div className="absolute inset-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentHero?.id || currentIndex}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ 
                            opacity: 1, 
                            scale: 1,
                            transition: {
                                opacity: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
                                scale: { duration: 12, ease: "linear" }
                            }
                        }}
                        exit={{ 
                            opacity: 0, 
                            scale: 0.95,
                            transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
                        }}
                        className="absolute inset-0"
                    >
                        {!imageLoaded && (
                            <div className="skeleton w-full h-full" />
                        )}
                        <img
                            src={currentHero.banner}
                            alt={currentHero.title}
                            className="w-full h-full object-cover"
                            onLoad={() => setImageLoaded(true)}
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            </div>

            {/* Content with smooth transitions */}
            <div className="relative z-10 h-full flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-2xl">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentHero?.id || currentIndex}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ 
                                    opacity: 1, 
                                    y: 0,
                                    transition: { 
                                        duration: 0.8, 
                                        delay: 0.3,
                                        ease: [0.25, 0.1, 0.25, 1]
                                    }
                                }}
                                exit={{ 
                                    opacity: 0, 
                                    y: -20,
                                    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
                                }}
                            >
                            {/* Category Badge */}
                            {currentHero.category && (
                                <div className="mb-4">
                                    <span className="bg-ftpflix-red text-white px-3 py-1 rounded text-sm font-semibold">
                                        {currentHero.category}
                                    </span>
                                </div>
                            )}

                            {/* Title */}
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                                {currentHero.title}
                            </h1>

                            {/* Quality and Type Indicators */}
                            <div className="flex items-center gap-4 mb-6">
                                <span className={`px-2 py-1 rounded text-sm font-semibold ${currentHero.type === 'movie' ? 'bg-blue-600' : 'bg-green-600'
                                    } text-white`}>
                                    {currentHero.type === 'movie' ? 'Movie' : 'Series'}
                                </span>

                                {currentHero.sources && currentHero.sources.length > 0 && (
                                    <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                                        {currentHero.sources[0].quality}p
                                    </span>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handlePlay}
                                    className="bg-white text-black px-8 py-3 rounded font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2 text-lg"
                                >
                                    <FiPlay size={20} fill="currentColor" />
                                    Play
                                </motion.button>
                            </div>
                        </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default HeroSection
