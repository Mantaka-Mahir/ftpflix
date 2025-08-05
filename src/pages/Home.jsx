import React from 'react'
import HeroSection from '../components/HeroSection'
import ContentRow from '../components/ContentRow'
import { ContentDetailsModal } from '../components/ContentCard'
import { useMovie } from '../context/MovieContext'

function Home() {
    const { state } = useMovie()

    // Group content by categories for display
    const getContentByCategory = (categoryKey) => {
        if (categoryKey === 'all') {
            return state.allContent
        }
        return state.allContent.filter(item => item.categoryKey === categoryKey)
    }

    // Featured categories to display on home page
    const featuredCategories = [
        'imdb_top_250',
        'english_movies_1080p',
        'hindi_movies',
        'animation_movies_1080p',
        'south_indian_hindi_dubbed',
        'tv_web_series',
        'korean_tv_series',
        'documentary',
        '3d_movies'
    ]

    return (
        <div className="min-h-screen bg-ftpflix-black">
            {/* Hero Section */}
            <HeroSection />

            {/* Content Sections */}
            <div className="relative -mt-32 z-20">
                {state.loading ? (
                    // Loading State
                    <div className="space-y-8">
                        {Array(5).fill(0).map((_, index) => (
                            <ContentRow key={index} loading={true} />
                        ))}
                    </div>
                ) : (
                    // Content Rows
                    <div className="space-y-8">
                        {featuredCategories
                            .filter(categoryKey => state.categories[categoryKey])
                            .map(categoryKey => {
                                const content = getContentByCategory(categoryKey)
                                const category = state.categories[categoryKey]

                                if (content.length === 0) return null

                                return (
                                    <ContentRow
                                        key={categoryKey}
                                        title={category.name}
                                        content={content.slice(0, 20)} // Limit to 20 items per row
                                    />
                                )
                            })}

                        {/* Show message if no content */}
                        {state.allContent.length === 0 && !state.loading && (
                            <div className="text-center py-20">
                                <h2 className="text-2xl font-semibold text-white mb-4">
                                    No content available
                                </h2>
                                <p className="text-gray-400">
                                    Please make sure the data files are properly loaded.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Error State */}
                {state.error && (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-semibold text-white mb-4">
                            Error loading content
                        </h2>
                        <p className="text-gray-400 mb-6">
                            {state.error}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-ftpflix-red text-white px-6 py-3 rounded hover:bg-red-700 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                )}
            </div>

            {/* Content Details Modal */}
            <ContentDetailsModal />
        </div>
    )
}

export default Home
