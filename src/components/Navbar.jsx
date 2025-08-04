import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiSearch, FiMenu, FiX } from 'react-icons/fi'
import { useMovie } from '../context/MovieContext'

function Navbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [suggestions, setSuggestions] = useState([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const { state, actions } = useMovie()
    const navigate = useNavigate()

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Handle search
    const handleSearch = (e) => {
        e.preventDefault()
        if (state.searchQuery.trim()) {
            navigate('/search')
            setIsSearchOpen(false)
            setIsMobileMenuOpen(false)
        }
    }

    const categories = Object.entries(state.categories)
        .sort(([keyA], [keyB]) => {
            // Put 'all' category first
            if (keyA === 'all') return -1
            if (keyB === 'all') return 1
            return 0
        }) // Show all categories

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-ftpflix-black bg-opacity-95 backdrop-blur-sm' : 'bg-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0">
                        <span className="text-ftpflix-red text-2xl font-bold">FTPFLIX</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-white hover:text-gray-300 transition-colors">
                            Home
                        </Link>

                        {/* Categories Dropdown */}
                        <div className="relative group">
                            <button className="text-white hover:text-gray-300 transition-colors">
                                Categories
                            </button>
                            <div className="absolute top-full left-0 mt-2 w-80 bg-netflix-black bg-opacity-95 backdrop-blur-sm rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                <div className="p-4 space-y-2 max-h-96 overflow-y-auto">{categories.map(([key, category]) => (
                                    <Link
                                        key={key}
                                        to={`/category/${key}`}
                                        className="block text-sm text-white hover:text-netflix-red transition-colors"
                                    >
                                        {category.name} ({category.count})
                                    </Link>
                                ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search and Mobile Menu */}
                    <div className="flex items-center space-x-4">
                        {/* Search */}
                        <div className="relative">
                            {isSearchOpen ? (
                                <div className="relative">
                                    <form onSubmit={handleSearch} className="flex items-center">
                                        <input
                                            type="text"
                                            placeholder="Search for movies, series, categories..."
                                            value={state.searchQuery}
                                            onChange={(e) => {
                                                actions.search(e.target.value)
                                                if (e.target.value.trim().length > 1) {
                                                    const searchSuggestions = actions.getSearchSuggestions(e.target.value)
                                                    setSuggestions(searchSuggestions)
                                                    setShowSuggestions(true)
                                                } else {
                                                    setSuggestions([])
                                                    setShowSuggestions(false)
                                                }
                                            }}
                                            onFocus={() => {
                                                if (state.searchQuery.trim().length > 1) {
                                                    const searchSuggestions = actions.getSearchSuggestions(state.searchQuery)
                                                    setSuggestions(searchSuggestions)
                                                    setShowSuggestions(true)
                                                }
                                            }}
                                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                            className="w-80 px-4 py-3 bg-black bg-opacity-70 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-white focus:bg-opacity-90 transition-all duration-200"
                                            autoFocus
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsSearchOpen(false)
                                                setShowSuggestions(false)
                                            }}
                                            className="ml-3 text-white hover:text-gray-300 transition-colors"
                                        >
                                            <FiX size={24} />
                                        </button>
                                    </form>

                                    {/* Search Suggestions */}
                                    {showSuggestions && suggestions.length > 0 && (
                                        <div className="absolute top-full left-0 w-80 bg-black bg-opacity-95 border border-gray-600 rounded-md mt-1 max-h-60 overflow-y-auto z-50">
                                            {suggestions.map((suggestion, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => {
                                                        actions.search(suggestion)
                                                        navigate('/search')
                                                        setIsSearchOpen(false)
                                                        setShowSuggestions(false)
                                                    }}
                                                    className="w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-b-0 text-white"
                                                >
                                                    <FiSearch className="inline mr-3 text-gray-400" size={16} />
                                                    {suggestion}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsSearchOpen(true)}
                                    className="text-white hover:text-gray-300 transition-colors p-2"
                                >
                                    <FiSearch size={24} />
                                </button>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden text-white hover:text-gray-300 transition-colors"
                        >
                            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-netflix-black bg-opacity-95 backdrop-blur-sm rounded-lg mt-2 p-4">
                        <div className="space-y-4">
                            <Link
                                to="/"
                                className="block text-white hover:text-netflix-red transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Home
                            </Link>

                            {/* Mobile Categories */}
                            <div className="space-y-2">
                                <span className="text-gray-400 text-sm font-semibold">Categories</span>
                                {categories.map(([key, category]) => (
                                    <Link
                                        key={key}
                                        to={`/category/${key}`}
                                        className="block text-sm text-white hover:text-netflix-red transition-colors pl-4"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {category.name} ({category.count})
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar
