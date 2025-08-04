import React from 'react'
import { useMovie } from '../context/MovieContext'

function DebugPage() {
    const { state, actions } = useMovie()

    return (
        <div className="min-h-screen bg-ftpflix-black text-white pt-20 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Debug Information</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Categories */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Categories</h2>
                        <div className="bg-gray-800 p-4 rounded">
                            {Object.entries(state.categories).map(([key, category]) => (
                                <div key={key} className="mb-2">
                                    <strong>{key}:</strong> {category.name} ({category.count})
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Content Statistics */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Content Statistics</h2>
                        <div className="bg-gray-800 p-4 rounded">
                            <div className="mb-2">
                                <strong>Total Items Loaded:</strong> {state.allContent.length}
                            </div>
                            <div className="mb-2">
                                <strong>Loading:</strong> {state.loading ? 'Yes' : 'No'}
                            </div>
                            <div className="mb-2">
                                <strong>Error:</strong> {state.error || 'None'}
                            </div>
                        </div>
                    </div>

                    {/* Content by Category */}
                    <div className="md:col-span-2">
                        <h2 className="text-xl font-semibold mb-4">Content by Category</h2>
                        <div className="bg-gray-800 p-4 rounded">
                            {Object.keys(state.categories)
                                .filter(key => key !== 'all')
                                .map(categoryKey => {
                                    const content = actions.getContentByCategory(categoryKey)
                                    return (
                                        <div key={categoryKey} className="mb-2">
                                            <strong>{categoryKey}:</strong> {content.length} items
                                        </div>
                                    )
                                })}
                        </div>
                    </div>

                    {/* Sample Content */}
                    <div className="md:col-span-2">
                        <h2 className="text-xl font-semibold mb-4">Sample Content (First 5)</h2>
                        <div className="bg-gray-800 p-4 rounded">
                            {state.allContent.slice(0, 5).map((item, index) => (
                                <div key={index} className="mb-4 border-b border-gray-600 pb-2">
                                    <div><strong>Title:</strong> {item.title}</div>
                                    <div><strong>Category:</strong> {item.categoryKey}</div>
                                    <div><strong>Type:</strong> {item.type}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <button
                        onClick={actions.reloadData}
                        className="bg-ftpflix-red text-white px-6 py-3 rounded hover:bg-red-700 transition-colors"
                    >
                        Reload Data
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DebugPage
