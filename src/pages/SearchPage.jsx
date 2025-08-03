import React, { useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { FiSearch, FiArrowLeft } from 'react-icons/fi'
import ContentCard, { ContentDetailsModal } from '../components/ContentCard'
import { useMovie } from '../context/MovieContext'

function SearchPage() {
    const [searchParams] = useSearchParams()
    const { state, actions } = useMovie()

    const query = searchParams.get('q') || ''

    useEffect(() => {
        if (query) {
            actions.search(query)
        }
    }, [query, actions])

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const newQuery = formData.get('search')
        if (newQuery) {
            actions.search(newQuery)
            window.history.pushState({}, '', `/search?q=${encodeURIComponent(newQuery)}`)
        }
    }

    return (
        <div className="min-h-screen bg-netflix-black text-white pt-20">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        to="/"
                        className="text-white hover:text-gray-300 transition-colors"
                    >
                        <FiArrowLeft size={24} />
                    </Link>
                    <h1 className="text-3xl font-bold">Search</h1>
                </div>

                {/* Search Form */}
                <form onSubmit={handleSearchSubmit} className="mb-8">
                    <div className="relative max-w-2xl">
                        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            name="search"
                            placeholder="Search for movies, series, categories..."
                            defaultValue={query}
                            className="w-full pl-12 pr-4 py-4 bg-netflix-gray border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white text-lg"
                            autoFocus
                        />
                    </div>
                </form>

                {/* Search Results */}
                {state.searchQuery && (
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-4">
                            {state.searchResults.length > 0
                                ? `Found ${state.searchResults.length} results for "${state.searchQuery}"`
                                : `No results found for "${state.searchQuery}"`
                            }
                        </h2>
                    </div>
                )}

                {/* Results Grid */}
                {state.searchResults.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {state.searchResults.map((item, index) => (
                            <ContentCard
                                key={`${item.title}-${index}`}
                                content={item}
                                size="medium"
                            />
                        ))}
                    </div>
                ) : state.searchQuery ? (
                    <div className="text-center py-20">
                        <div className="max-w-md mx-auto">
                            <FiSearch className="mx-auto mb-4 text-gray-400" size={48} />
                            <h3 className="text-xl font-semibold mb-4">No results found</h3>
                            <p className="text-gray-400 mb-6">
                                We couldn't find anything matching "{state.searchQuery}". Try different keywords or browse our categories.
                            </p>
                            <Link
                                to="/"
                                className="bg-netflix-red text-white px-6 py-3 rounded hover:bg-red-700 transition-colors inline-block"
                            >
                                Browse All Content
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="max-w-md mx-auto">
                            <FiSearch className="mx-auto mb-4 text-gray-400" size={48} />
                            <h3 className="text-xl font-semibold mb-4">Search our library</h3>
                            <p className="text-gray-400 mb-6">
                                Discover movies, TV series, and more from our extensive collection.
                            </p>

                            {/* Popular Search Suggestions */}
                            <div className="text-left">
                                <h4 className="text-lg font-semibold mb-3">Popular searches:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {['Action', 'Comedy', 'Drama', 'Thriller', 'Animation', 'Documentary'].map(genre => (
                                        <button
                                            key={genre}
                                            onClick={() => actions.search(genre)}
                                            className="bg-netflix-gray text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
                                        >
                                            {genre}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {state.loading && (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                        <p className="text-gray-400">Searching...</p>
                    </div>
                )}

                {/* Categories Quick Access */}
                {!state.searchQuery && Object.keys(state.categories).length > 0 && (
                    <div className="mt-12">
                        <h3 className="text-xl font-semibold mb-6">Browse by Category</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {Object.entries(state.categories).slice(0, 8).map(([key, category]) => (
                                <Link
                                    key={key}
                                    to={`/category/${key}`}
                                    className="bg-netflix-gray p-4 rounded-lg hover:bg-gray-600 transition-colors text-center"
                                >
                                    <h4 className="font-semibold mb-1">{category.name}</h4>
                                    <p className="text-sm text-gray-400">{category.count} items</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Content Details Modal */}
            <ContentDetailsModal />
        </div>
    )
}

export default SearchPage
