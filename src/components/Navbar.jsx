import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiSearch, FiMenu, FiX } from 'react-icons/fi'
import { useMovie } from '../context/MovieContext'

function Navbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
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
        })
        .slice(0, 8) // Show first 8 categories

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-netflix-black bg-opacity-95 backdrop-blur-sm' : 'bg-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0">
                        <span className="text-netflix-red text-2xl font-bold">NETFLIX</span>
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
                            <div className="absolute top-full left-0 mt-2 w-64 bg-netflix-black bg-opacity-95 backdrop-blur-sm rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                <div className="p-4 space-y-2">
                                    {categories.map(([key, category]) => (
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
                                <form onSubmit={handleSearch} className="flex items-center">
                                    <input
                                        type="text"
                                        placeholder="Search movies, series..."
                                        value={state.searchQuery}
                                        onChange={(e) => actions.search(e.target.value)}
                                        className="w-64 px-4 py-2 bg-netflix-black bg-opacity-50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white"
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setIsSearchOpen(false)}
                                        className="ml-2 text-white hover:text-gray-300"
                                    >
                                        <FiX size={20} />
                                    </button>
                                </form>
                            ) : (
                                <button
                                    onClick={() => setIsSearchOpen(true)}
                                    className="text-white hover:text-gray-300 transition-colors"
                                >
                                    <FiSearch size={20} />
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

                            {/* Mobile Search */}
                            <form onSubmit={handleSearch} className="space-y-2">
                                <input
                                    type="text"
                                    placeholder="Search movies, series..."
                                    value={state.searchQuery}
                                    onChange={(e) => actions.search(e.target.value)}
                                    className="w-full px-4 py-2 bg-netflix-gray border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white"
                                />
                                <button
                                    type="submit"
                                    className="w-full bg-netflix-red text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Search
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar
