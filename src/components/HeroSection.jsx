import React, { useState, useEffect } from 'react'
import { FiPlay, FiInfo } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { useMovie } from '../context/MovieContext'

function HeroSection() {
    const { state, actions } = useMovie()
    const [currentHero, setCurrentHero] = useState(null)
    const [imageLoaded, setImageLoaded] = useState(false)

    useEffect(() => {
        // Get a random featured content from popular categories
        if (state.allContent.length > 0) {
            const featuredCategories = ['imdb_top_250', 'english_movies_1080p', 'hindi_movies']
            const featuredContent = state.allContent.filter(item =>
                featuredCategories.includes(item.categoryKey) && item.banner
            )

            if (featuredContent.length > 0) {
                const randomIndex = Math.floor(Math.random() * Math.min(featuredContent.length, 10))
                setCurrentHero(featuredContent[randomIndex])
            }
        }
    }, [state.allContent])

    const handlePlay = () => {
        if (currentHero) {
            actions.playContent(currentHero)
        }
    }

    const handleMoreInfo = () => {
        if (currentHero) {
            actions.setCurrentContent(currentHero)
            actions.openDetails()
        }
    }

    if (!currentHero) {
        return (
            <div className="relative h-[80vh] bg-netflix-gray">
                <div className="skeleton w-full h-full" />
            </div>
        )
    }

    return (
        <div className="relative h-[80vh] overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                {!imageLoaded && (
                    <div className="skeleton w-full h-full" />
                )}
                <img
                    src={currentHero.banner}
                    alt={currentHero.title}
                    className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                    onLoad={() => setImageLoaded(true)}
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            {/* Category Badge */}
                            {currentHero.category && (
                                <div className="mb-4">
                                    <span className="bg-netflix-red text-white px-3 py-1 rounded text-sm font-semibold">
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

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleMoreInfo}
                                    className="bg-gray-600 bg-opacity-70 text-white px-8 py-3 rounded font-semibold hover:bg-opacity-90 transition-all flex items-center gap-2 text-lg"
                                >
                                    <FiInfo size={20} />
                                    More Info
                                </motion.button>
                            </div>

                            {/* Additional Info */}
                            <div className="mt-8 text-gray-300">
                                <p className="text-lg leading-relaxed max-w-lg">
                                    Discover this amazing {currentHero.type} from our collection of premium content.
                                    {currentHero.sources && currentHero.sources.length > 1 && (
                                        <span className="block mt-2 text-sm">
                                            Available in multiple qualities: {currentHero.sources.map(s => s.quality + 'p').join(', ')}
                                        </span>
                                    )}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-white text-center"
                >
                    <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-white rounded-full mt-2" />
                    </div>
                    <p className="text-sm mt-2">Scroll for more</p>
                </motion.div>
            </div>
        </div>
    )
}

export default HeroSection
