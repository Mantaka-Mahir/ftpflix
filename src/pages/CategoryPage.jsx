import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiArrowLeft, FiGrid, FiList } from 'react-icons/fi'
import ContentCard, { ContentDetailsModal } from '../components/ContentCard'
import { useMovie } from '../context/MovieContext'

function CategoryPage() {
    const { categoryId } = useParams()
    const { state, actions } = useMovie()
    const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
    const [sortBy, setSortBy] = useState('title') // 'title', 'type'
    const [filterType, setFilterType] = useState('all') // 'all', 'movie', 'series'

    const category = state.categories[categoryId]
    const content = categoryId === 'all'
        ? state.allContent
        : state.allContent.filter(item => item.categoryKey === categoryId)

    // Filter and sort content
    const filteredContent = content
        .filter(item => filterType === 'all' || item.type === filterType)
        .sort((a, b) => {
            switch (sortBy) {
                case 'title':
                    return a.title.localeCompare(b.title)
                case 'type':
                    return a.type.localeCompare(b.type)
                default:
                    return 0
            }
        })

    if (!category) {
        return (
            <div className="min-h-screen bg-netflix-black text-white pt-20 px-4 md:px-8">
                <div className="max-w-7xl mx-auto text-center py-20">
                    <h1 className="text-2xl font-semibold mb-4">Category not found</h1>
                    <Link
                        to="/"
                        className="bg-netflix-red text-white px-6 py-3 rounded hover:bg-red-700 transition-colors"
                    >
                        Go back to Home
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-netflix-black text-white pt-20">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link
                            to="/"
                            className="text-white hover:text-gray-300 transition-colors"
                        >
                            <FiArrowLeft size={24} />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">{category.name}</h1>
                            <p className="text-gray-400">
                                {filteredContent.length} {filteredContent.length === 1 ? 'item' : 'items'}
                            </p>
                        </div>
                    </div>

                    {/* View Controls */}
                    <div className="flex items-center gap-4">
                        {/* Filter by Type */}
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="bg-netflix-gray text-white px-3 py-2 rounded border border-gray-600 focus:border-white focus:outline-none"
                        >
                            <option value="all">All Types</option>
                            <option value="movie">Movies</option>
                            <option value="series">Series</option>
                        </select>

                        {/* Sort Options */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-netflix-gray text-white px-3 py-2 rounded border border-gray-600 focus:border-white focus:outline-none"
                        >
                            <option value="title">Sort by Title</option>
                            <option value="type">Sort by Type</option>
                        </select>

                        {/* View Mode Toggle */}
                        <div className="flex bg-netflix-gray rounded overflow-hidden">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-netflix-red text-white' : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                <FiGrid size={20} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-netflix-red text-white' : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                <FiList size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Grid/List */}
                {filteredContent.length === 0 ? (
                    <div className="text-center py-20">
                        <h2 className="text-xl font-semibold mb-4">No content found</h2>
                        <p className="text-gray-400">
                            Try adjusting your filters or check back later.
                        </p>
                    </div>
                ) : (
                    <div className={
                        viewMode === 'grid'
                            ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'
                            : 'space-y-4'
                    }>
                        {filteredContent.map((item, index) => (
                            viewMode === 'grid' ? (
                                <ContentCard
                                    key={`${item.title}-${index}`}
                                    content={item}
                                    size="medium"
                                />
                            ) : (
                                <ListItem
                                    key={`${item.title}-${index}`}
                                    content={item}
                                    actions={actions}
                                />
                            )
                        ))}
                    </div>
                )}

                {/* Load More Button (for large datasets) */}
                {filteredContent.length > 100 && (
                    <div className="text-center mt-8">
                        <button className="bg-netflix-gray text-white px-6 py-3 rounded hover:bg-gray-600 transition-colors">
                            Load More
                        </button>
                    </div>
                )}
            </div>

            {/* Content Details Modal */}
            <ContentDetailsModal />
        </div>
    )
}

// List view item component
function ListItem({ content, actions }) {
    const handlePlay = () => {
        actions.playContent(content)
    }

    const handleInfo = () => {
        actions.setCurrentContent(content)
        actions.openDetails()
    }

    return (
        <div className="bg-netflix-gray p-4 rounded-lg hover:bg-gray-600 transition-colors">
            <div className="flex items-center gap-4">
                {/* Thumbnail */}
                <div className="w-20 h-28 flex-shrink-0 bg-netflix-black rounded overflow-hidden">
                    <img
                        src={content.banner || `https://via.placeholder.com/80x112/141414/ffffff?text=${encodeURIComponent(content.title.slice(0, 2))}`}
                        alt={content.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Content Info */}
                <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg mb-1">{content.title}</h3>
                    <p className="text-gray-400 text-sm mb-2">{content.category}</p>

                    <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs ${content.type === 'movie' ? 'bg-blue-600' : 'bg-green-600'
                            } text-white`}>
                            {content.type === 'movie' ? 'Movie' : 'Series'}
                        </span>

                        {content.sources && (
                            <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                                {content.sources[0]?.quality}p
                            </span>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={handlePlay}
                        className="bg-white text-black px-4 py-2 rounded font-semibold hover:bg-gray-200 transition-colors"
                    >
                        Play
                    </button>
                    <button
                        onClick={handleInfo}
                        className="bg-netflix-red text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                    >
                        Info
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CategoryPage
