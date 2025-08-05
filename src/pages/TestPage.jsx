import React, { useState } from 'react'
import { useMovie } from '../context/MovieContext'
import { optimizedSearch } from '../utils/fuzzySearch'

function TestPage() {
    const { state, actions } = useMovie()
    const [testQuery, setTestQuery] = useState('demon')
    const [testResults, setTestResults] = useState([])

    const runTest = () => {
        console.log('Running test search with query:', testQuery)
        console.log('Available content count:', state.allContent.length)

        if (state.allContent.length > 0) {
            const results = optimizedSearch(testQuery, state.allContent, 20)
            console.log('Test results:', results)
            setTestResults(results)
        } else {
            console.log('No content available for testing')
        }
    }

    const testDirectSearch = () => {
        console.log('Testing direct search action')
        actions.search(testQuery)
    }

    return (
        <div className="min-h-screen bg-ftpflix-black text-white pt-20 p-8">
            <h1 className="text-3xl font-bold mb-8">Search Test Page</h1>

            <div className="mb-8">
                <h2 className="text-xl mb-4">Content Status</h2>
                <p>Total content items: {state.allContent.length}</p>
                <p>Loading: {state.loading ? 'Yes' : 'No'}</p>
                <p>Current search query: {state.searchQuery}</p>
                <p>Search results count: {state.searchResults.length}</p>
            </div>

            <div className="mb-8">
                <h2 className="text-xl mb-4">Test Search</h2>
                <input
                    type="text"
                    value={testQuery}
                    onChange={(e) => setTestQuery(e.target.value)}
                    className="bg-gray-800 text-white p-2 rounded mr-4"
                    placeholder="Enter search query"
                />
                <button
                    onClick={runTest}
                    className="bg-ftpflix-red text-white px-4 py-2 rounded mr-2"
                >
                    Test Direct Search
                </button>
                <button
                    onClick={testDirectSearch}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Test Action Search
                </button>
            </div>

            <div className="mb-8">
                <h2 className="text-xl mb-4">Test Results ({testResults.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {testResults.slice(0, 10).map((item, index) => (
                        <div key={index} className="bg-gray-800 p-4 rounded">
                            <h3 className="font-bold">{item.title}</h3>
                            <p className="text-sm text-gray-400">Category: {item.category}</p>
                            <p className="text-sm text-gray-400">Score: {item.searchScore}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-xl mb-4">Action Search Results ({state.searchResults.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {state.searchResults.slice(0, 10).map((item, index) => (
                        <div key={index} className="bg-gray-800 p-4 rounded">
                            <h3 className="font-bold">{item.title}</h3>
                            <p className="text-sm text-gray-400">Category: {item.category}</p>
                            <p className="text-sm text-gray-400">Score: {item.searchScore}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-xl mb-4">Sample Content (First 5 items)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {state.allContent.slice(0, 5).map((item, index) => (
                        <div key={index} className="bg-gray-800 p-4 rounded">
                            <h3 className="font-bold">{item.title}</h3>
                            <p className="text-sm text-gray-400">Category: {item.category}</p>
                            <p className="text-sm text-gray-400">Type: {item.type}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TestPage
