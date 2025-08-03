import React, { useState } from 'react'
import { FiPlay, FiInfo, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useMovie } from '../context/MovieContext'

function ContentCard({ content, size = 'medium' }) {
    const [isHovered, setIsHovered] = useState(false)
    const [imageLoaded, setImageLoaded] = useState(false)
    const [imageError, setImageError] = useState(false)
    const { actions } = useMovie()

    const handlePlay = (e) => {
        e.stopPropagation()
        actions.playContent(content)
    }

    const handleInfo = (e) => {
        e.stopPropagation()
        actions.setCurrentContent(content)
        actions.openDetails()
    }

    const sizeClasses = {
        small: 'w-32 h-48',
        medium: 'w-48 h-72',
        large: 'w-64 h-96',
        hero: 'w-full h-full'
    }

    const fallbackImage = `https://via.placeholder.com/300x450/141414/ffffff?text=${encodeURIComponent(content.title)}`

    return (
        <motion.div
            className={`relative ${sizeClasses[size]} flex-shrink-0 cursor-pointer content-card group`}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={handleInfo}
            whileHover={{ scale: size === 'hero' ? 1 : 1.05 }}
            transition={{ duration: 0.2 }}
        >
            {/* Main Image */}
            <div className="relative w-full h-full overflow-hidden rounded-lg bg-netflix-gray">
                {!imageLoaded && !imageError && (
                    <div className="absolute inset-0 skeleton rounded-lg" />
                )}

                <img
                    src={imageError ? fallbackImage : content.banner || fallbackImage}
                    alt={content.title}
                    className={`w-full h-full object-cover transition-all duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => {
                        setImageError(true)
                        setImageLoaded(true)
                    }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

                {/* Content Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-sm font-semibold line-clamp-2 mb-1">
                        {content.title}
                    </h3>

                    {content.category && (
                        <p className="text-xs text-gray-300 line-clamp-1">
                            {content.category}
                        </p>
                    )}

                    {/* Quality indicators */}
                    {content.sources && (
                        <div className="flex gap-1 mt-1">
                            {content.sources.slice(0, 2).map((source, index) => (
                                <span
                                    key={index}
                                    className="text-xs bg-black bg-opacity-50 px-1 py-0.5 rounded"
                                >
                                    {source.quality}p
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Hover Controls */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center space-x-4"
                        >
                            <motion.button
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                transition={{ delay: 0.1 }}
                                onClick={handlePlay}
                                className="bg-white text-black p-3 rounded-full hover:bg-gray-200 transition-colors group relative"
                                title="Play in VLC Media Player"
                            >
                                <FiPlay size={20} fill="currentColor" />
                                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    Play in VLC
                                </span>
                            </motion.button>

                            <motion.button
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                transition={{ delay: 0.15 }}
                                onClick={handleInfo}
                                className="bg-netflix-gray text-white p-3 rounded-full hover:bg-gray-600 transition-colors"
                            >
                                <FiInfo size={20} />
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Type indicator */}
                <div className="absolute top-2 right-2">
                    <span className={`text-xs px-2 py-1 rounded ${content.type === 'movie' ? 'bg-blue-600' : 'bg-green-600'
                        } text-white`}>
                        {content.type === 'movie' ? 'Movie' : 'Series'}
                    </span>
                </div>
            </div>
        </motion.div>
    )
}

// Content Details Modal
export function ContentDetailsModal() {
    const { state, actions } = useMovie()
    const [selectedSeason, setSelectedSeason] = useState(1)
    const [showAllSeasons, setShowAllSeasons] = useState(false)

    if (!state.isDetailsOpen || !state.currentContent) return null

    const content = state.currentContent
    const isSeries = content.type === 'series'

    const handlePlay = (episode = null) => {
        if (episode) {
            actions.playEpisode(episode, content.title)
        } else {
            actions.playContent(content)
        }
        actions.closeDetails()
    }

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            actions.closeDetails()
        }
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4"
                onClick={handleBackdropClick}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-netflix-black rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
                >
                    {/* Header */}
                    <div className="relative">
                        {content.banner && (
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={content.banner}
                                    alt={content.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-transparent" />
                            </div>
                        )}

                        <button
                            onClick={actions.closeDetails}
                            className="absolute top-4 right-4 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2"
                        >
                            <FiX size={20} />
                        </button>

                        <div className="absolute bottom-4 left-4 right-4 text-white">
                            <h2 className="text-3xl font-bold mb-2">{content.title}</h2>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => handlePlay()}
                                    className="bg-white text-black px-6 py-2 rounded font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2"
                                    title="Play in VLC Media Player"
                                >
                                    <FiPlay size={16} fill="currentColor" />
                                    Play in VLC
                                </button>

                                {content.category && (
                                    <span className="text-gray-300">{content.category}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 max-h-96 overflow-y-auto">
                        {/* Series Episodes */}
                        {isSeries && content.seasons && content.seasons.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-white">Episodes</h3>

                                {/* Season Selection */}
                                {content.seasons.length > 1 && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-white">Season:</span>
                                        <select
                                            value={selectedSeason}
                                            onChange={(e) => setSelectedSeason(Number(e.target.value))}
                                            className="bg-netflix-gray text-white px-3 py-1 rounded border border-gray-600 focus:border-white focus:outline-none"
                                        >
                                            {content.seasons.map((season) => (
                                                <option key={season.season_number} value={season.season_number}>
                                                    Season {season.season_number}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* Episodes List */}
                                <div className="space-y-2">
                                    {content.seasons
                                        .find(s => s.season_number === selectedSeason)?.episodes
                                        ?.slice(0, showAllSeasons ? undefined : 10)
                                        .map((episode) => (
                                            <div
                                                key={episode.episode_number}
                                                className="bg-netflix-gray p-3 rounded hover:bg-gray-600 transition-colors cursor-pointer"
                                                onClick={() => handlePlay(episode)}
                                                title="Play in VLC Media Player"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="text-white font-medium">
                                                            {episode.episode_number}. {episode.title}
                                                        </h4>
                                                        {episode.sources && (
                                                            <span className="text-xs text-gray-400">
                                                                {episode.sources[0]?.quality}p
                                                            </span>
                                                        )}
                                                    </div>
                                                    <FiPlay className="text-white" size={16} />
                                                </div>
                                            </div>
                                        ))}

                                    {content.seasons.find(s => s.season_number === selectedSeason)?.episodes?.length > 10 && (
                                        <button
                                            onClick={() => setShowAllSeasons(!showAllSeasons)}
                                            className="w-full text-center text-netflix-red hover:text-red-400 transition-colors py-2 flex items-center justify-center gap-2"
                                        >
                                            {showAllSeasons ? 'Show Less' : 'Show More'}
                                            {showAllSeasons ? <FiChevronUp /> : <FiChevronDown />}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Movie Quality Options */}
                        {!isSeries && content.sources && content.sources.length > 1 && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-white">Quality Options</h3>
                                <div className="space-y-2">
                                    {content.sources.map((source, index) => (
                                        <div
                                            key={index}
                                            className="bg-netflix-gray p-3 rounded hover:bg-gray-600 transition-colors cursor-pointer"
                                            onClick={() => handlePlay()}
                                            title="Play in VLC Media Player"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-white">{source.quality}p Quality - Play in VLC</span>
                                                <FiPlay className="text-white" size={16} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

export default ContentCard
