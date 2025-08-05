import React, { createContext, useContext, useReducer, useEffect, useRef, useMemo, useCallback } from 'react'
import { getSearchSuggestions, optimizedSearch, debounce, clearSearchCache } from '../utils/fuzzySearch'

// Initial state
const initialState = {
    categories: {},
    currentContent: null,
    currentVideo: null,
    isPlayerOpen: false,
    isDetailsOpen: false,
    searchQuery: '',
    searchResults: [],
    loading: false,
    error: null,
    allContent: [],
    contentByCategory: {}, // Cache for category-based content
    searchCache: new Map() // Local search cache
}

const ACTIONS = {
    SET_CATEGORIES: 'SET_CATEGORIES',
    SET_ALL_CONTENT: 'SET_ALL_CONTENT',
    SET_CURRENT_CONTENT: 'SET_CURRENT_CONTENT',
    SET_CURRENT_VIDEO: 'SET_CURRENT_VIDEO',
    OPEN_PLAYER: 'OPEN_PLAYER',
    CLOSE_PLAYER: 'CLOSE_PLAYER',
    OPEN_DETAILS: 'OPEN_DETAILS',
    CLOSE_DETAILS: 'CLOSE_DETAILS',
    SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
    SET_SEARCH_RESULTS: 'SET_SEARCH_RESULTS',
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    SET_CONTENT_BY_CATEGORY: 'SET_CONTENT_BY_CATEGORY',
    CLEAR_SEARCH: 'CLEAR_SEARCH'
}

// Reducer
function movieReducer(state, action) {
    switch (action.type) {
        case ACTIONS.SET_CATEGORIES:
            return { ...state, categories: action.payload }
        case ACTIONS.SET_ALL_CONTENT:
            return { ...state, allContent: action.payload }
        case ACTIONS.SET_CURRENT_CONTENT:
            return { ...state, currentContent: action.payload }
        case ACTIONS.SET_CURRENT_VIDEO:
            return { ...state, currentVideo: action.payload }
        case ACTIONS.OPEN_PLAYER:
            return { ...state, isPlayerOpen: true }
        case ACTIONS.CLOSE_PLAYER:
            return { ...state, isPlayerOpen: false, currentVideo: null }
        case ACTIONS.OPEN_DETAILS:
            return { ...state, isDetailsOpen: true }
        case ACTIONS.CLOSE_DETAILS:
            return { ...state, isDetailsOpen: false, currentContent: null }
        case ACTIONS.SET_SEARCH_QUERY:
            return { ...state, searchQuery: action.payload }
        case ACTIONS.SET_SEARCH_RESULTS:
            return { ...state, searchResults: action.payload }
        case ACTIONS.SET_LOADING:
            return { ...state, loading: action.payload }
        case ACTIONS.SET_ERROR:
            return { ...state, error: action.payload }
        case ACTIONS.SET_CONTENT_BY_CATEGORY:
            return {
                ...state,
                contentByCategory: {
                    ...state.contentByCategory,
                    [action.payload.category]: action.payload.content
                }
            }
        case ACTIONS.CLEAR_SEARCH:
            return {
                ...state,
                searchQuery: '',
                searchResults: [],
                searchCache: new Map()
            }
        default:
            return state
    }
}

// Context
const MovieContext = createContext()

// Provider component
export function MovieProvider({ children }) {
    const [state, dispatch] = useReducer(movieReducer, initialState)

    // Load data on mount
    useEffect(() => {
        loadMovieData()
    }, [])

    // Effect to handle search when content gets loaded
    useEffect(() => {
        // If we have a search query but no results, and content just loaded, retry the search
        if (state.searchQuery && state.searchResults.length === 0 && state.allContent.length > 0 && !state.loading) {
            console.log('Content loaded, retrying search for:', state.searchQuery)
            const results = optimizedSearch(state.searchQuery, state.allContent, 100)
            dispatch({ type: ACTIONS.SET_SEARCH_RESULTS, payload: results })
        }
    }, [state.allContent.length, state.searchQuery, state.searchResults.length, state.loading])

    // Debounce mechanism to prevent multiple VLC openings
    const vlcOpeningRef = useRef(false)

    // Debounced search function
    const debouncedSearch = useRef(
        debounce((query, dispatch, allContent) => {
            console.log('Debounced search executing:', { query, contentCount: allContent.length })

            if (!query.trim()) {
                dispatch({ type: ACTIONS.SET_SEARCH_RESULTS, payload: [] })
                return
            }

            if (!allContent || allContent.length === 0) {
                console.log('No content available for search')
                dispatch({ type: ACTIONS.SET_SEARCH_RESULTS, payload: [] })
                return
            }

            try {
                const results = optimizedSearch(query, allContent, 100) // Limit to 100 results max
                console.log('Search results:', results.length)
                dispatch({ type: ACTIONS.SET_SEARCH_RESULTS, payload: results })
            } catch (error) {
                console.error('Search error:', error)
                dispatch({ type: ACTIONS.SET_SEARCH_RESULTS, payload: [] })
            }
        }, 300) // 300ms debounce
    ).current

    // Cleanup function for component unmount
    useEffect(() => {
        return () => {
            // Clear caches on unmount
            clearSearchCache()
        }
    }, [])

    // Utility function to open video in VLC
    const openInVLC = (videoUrl, title) => {
        // Prevent multiple rapid openings
        if (vlcOpeningRef.current) {
            console.log('VLC opening already in progress, ignoring duplicate request')
            return
        }

        vlcOpeningRef.current = true
        console.log('Attempting to open in VLC:', videoUrl)

        // Reset the flag after 3 seconds
        setTimeout(() => {
            vlcOpeningRef.current = false
        }, 3000)

        // Show immediate notification
        dispatch({
            type: ACTIONS.SET_CURRENT_VIDEO,
            payload: {
                url: videoUrl,
                title: title,
                quality: 'HD',
                openedInVLC: true
            }
        })

        // Detect platform
        const userAgent = navigator.userAgent.toLowerCase()
        const isAndroid = /android/.test(userAgent)
        const isIOS = /iphone|ipad/.test(userAgent)

        let vlcOpened = false

        if (isAndroid) {
            // Android VLC opening methods
            try {
                // Method 1: Android Intent for VLC
                const vlcIntent = `intent://${encodeURIComponent(videoUrl)}#Intent;package=org.videolan.vlc;type=video/*;scheme=http;end`
                window.location.href = vlcIntent
                console.log('Tried Android VLC Intent (method 1)')
                vlcOpened = true

                // Backup method: VLC scheme after delay
                setTimeout(() => {
                    try {
                        window.location.href = `vlc://${encodeURIComponent(videoUrl)}`
                        console.log('Tried Android VLC scheme (backup method)')
                    } catch (error) {
                        console.warn('Android VLC scheme backup failed:', error)
                    }
                }, 1500)

            } catch (error) {
                console.warn('Android VLC Intent failed:', error)
                vlcOpened = false
            }
        } else if (isIOS) {
            // iOS VLC opening
            try {
                window.location.href = `vlc-x-callback://x-callback-url/stream?url=${encodeURIComponent(videoUrl)}`
                console.log('Tried iOS VLC callback (method 1)')
                vlcOpened = true
            } catch (error) {
                console.warn('iOS VLC callback failed:', error)
                // Fallback to regular VLC scheme
                try {
                    window.location.href = `vlc://${encodeURIComponent(videoUrl)}`
                    console.log('Tried iOS VLC scheme (backup)')
                } catch (fallbackError) {
                    console.warn('iOS VLC scheme backup failed:', fallbackError)
                }
            }
        } else {
            // Desktop/Windows VLC opening (existing logic)
            try {
                window.location.href = `vlc://${videoUrl}`
                console.log('Tried VLC protocol (method 1)')
                vlcOpened = true
            } catch (error) {
                console.warn('VLC protocol method 1 failed:', error)
            }

            // Only try alternative methods if the first one might have failed
            // Wait a bit to see if VLC opens, then try backup method only if needed
            if (!vlcOpened) {
                setTimeout(() => {
                    try {
                        const link = document.createElement('a')
                        link.href = `vlc://${encodeURIComponent(videoUrl)}`
                        link.target = '_blank'
                        link.rel = 'noopener noreferrer'
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                        console.log('Tried VLC protocol (method 2 - backup)')
                    } catch (error) {
                        console.warn('VLC protocol method 2 failed:', error)
                    }
                }, 1000)
            }
        }
    }

    // Optimized function to group series by main title and combine seasons
    const groupSeriesByTitle = (items) => {
        if (!items || items.length === 0) return []

        const seriesMap = new Map()
        const bannerMap = new Map()

        // First pass: collect banners (optimized)
        items.forEach(item => {
            if (item.banner && item.title) {
                let coreTitle = item.title
                    .replace(/^.*?\s*-\s*/, '')
                    .replace(/\s*-\s*Season\s+\d+.*$/i, '')
                    .replace(/\s+\([^)]*\)\s*.*$/, '')
                    .trim()

                if (coreTitle && !bannerMap.has(coreTitle)) {
                    bannerMap.set(coreTitle, item.banner)
                }
                if (item.title && !bannerMap.has(item.title)) {
                    bannerMap.set(item.title, item.banner)
                }
            }
        })

        // Second pass: group series efficiently
        items.forEach(item => {
            if (!item.title) return

            // Skip items with no content
            const hasContent = (item.seasons && item.seasons.length > 0) ||
                (item.episodes && item.episodes.length > 0)
            if (!hasContent) return

            // Normalize to seasons format
            if (item.episodes && item.episodes.length > 0 && !item.seasons) {
                item.seasons = [{ season_number: 1, episodes: item.episodes }]
            }

            // Extract main title
            let mainTitle = item.title
            const seasonMatch = item.title.match(/^(.*?)\s*-\s*Season\s+\d+/i)
            if (seasonMatch) {
                mainTitle = seasonMatch[1].trim()
            } else {
                const categoryMatch = item.title.match(/^.*?\s*-\s*(.+?)\s*\([^)]*\)\s*.*$/i)
                if (categoryMatch) {
                    mainTitle = categoryMatch[1].trim()
                } else {
                    mainTitle = item.title.replace(/^.*?\s*-\s*/, '').trim()
                }
            }

            const coreTitle = mainTitle.replace(/\s+\([^)]*\)\s*.*$/, '').trim()

            // Create or get series entry
            if (!seriesMap.has(mainTitle)) {
                let banner = item.banner ||
                    bannerMap.get(coreTitle) ||
                    bannerMap.get(mainTitle) ||
                    bannerMap.get(item.title)

                // Fallback banner search
                if (!banner) {
                    const extractedCore = mainTitle.replace(/\s*\([^)]*\).*$/, '').trim()
                    for (const [bannerKey, bannerUrl] of bannerMap.entries()) {
                        const bannerCore = bannerKey.replace(/\s*\([^)]*\).*$/, '').trim()
                        if (extractedCore.toLowerCase().includes(bannerCore.toLowerCase()) ||
                            bannerCore.toLowerCase().includes(extractedCore.toLowerCase())) {
                            banner = bannerUrl
                            break
                        }
                    }
                }

                seriesMap.set(mainTitle, {
                    title: mainTitle,
                    banner: banner || `https://via.placeholder.com/300x450/1a1a1a/ffffff?text=${encodeURIComponent(mainTitle)}`,
                    seasons: [],
                    type: 'series',
                    category: item.category,
                    categoryKey: item.categoryKey
                })
            }

            const mainSeries = seriesMap.get(mainTitle)

            // Add unique seasons only
            if (item.seasons) {
                item.seasons.forEach(season => {
                    if (!season.episodes || season.episodes.length === 0) return

                    const existingSeason = mainSeries.seasons.find(s => s.season_number === season.season_number)
                    if (!existingSeason) {
                        mainSeries.seasons.push(season)
                    }
                })
            }
        })

        // Convert to array and sort seasons
        const groupedSeries = Array.from(seriesMap.values())
        groupedSeries.forEach(series => {
            series.seasons.sort((a, b) => a.season_number - b.season_number)
        })

        console.log(`Grouped ${items.length} series items into ${groupedSeries.length} main series`)
        return groupedSeries
    }

    // Load movie data from JSON files with progressive loading
    const loadMovieData = async () => {
        try {
            dispatch({ type: ACTIONS.SET_LOADING, payload: true })

            // Load index.json to get categories
            const indexResponse = await fetch('/data/index.json')
            const indexData = await indexResponse.json()
            dispatch({ type: ACTIONS.SET_CATEGORIES, payload: indexData.categories })

            // Progressive loading strategy: Load smaller categories first, then larger ones
            const categoryEntries = Object.entries(indexData.categories)
                .filter(([categoryKey]) => categoryKey !== 'all')
                .sort(([, a], [, b]) => a.count - b.count) // Sort by count, smaller first

            const allContent = []
            let loadedCount = 0
            const totalCategories = categoryEntries.length

            // Load categories in batches to prevent UI blocking
            const BATCH_SIZE = 3
            for (let i = 0; i < categoryEntries.length; i += BATCH_SIZE) {
                const batch = categoryEntries.slice(i, i + BATCH_SIZE)

                const batchPromises = batch.map(async ([categoryKey, categoryInfo]) => {
                    try {
                        console.log(`Loading ${categoryKey}.json... (${categoryInfo.count} items)`)
                        const response = await fetch(`/data/${categoryKey}.json`)

                        if (!response.ok) {
                            console.warn(`Failed to load ${categoryKey}.json: ${response.status}`)
                            return []
                        }

                        const data = await response.json()
                        if (!data.items || !Array.isArray(data.items)) {
                            console.warn(`Invalid data structure in ${categoryKey}.json`)
                            return []
                        }

                        console.log(`Loaded ${data.items.length} items from ${categoryKey}`)

                        // Special handling for series to group seasons (optimized)
                        if (data.type === 'series') {
                            const groupedSeries = groupSeriesByTitle(data.items)
                            return groupedSeries.map(item => ({
                                ...item,
                                category: data.category,
                                categoryKey,
                                type: data.type
                            }))
                        } else {
                            // Regular handling for movies
                            return data.items.map(item => ({
                                ...item,
                                category: data.category,
                                categoryKey,
                                type: data.type
                            }))
                        }
                    } catch (error) {
                        console.warn(`Failed to load ${categoryKey}.json:`, error)
                        return []
                    }
                })

                // Process batch and update UI
                const batchResults = await Promise.all(batchPromises)
                batchResults.forEach(categoryContent => {
                    allContent.push(...categoryContent)
                })

                loadedCount += batch.length
                console.log(`Loaded ${loadedCount}/${totalCategories} categories (${allContent.length} total items)`)

                // Update content progressively for better perceived performance
                if (allContent.length > 0) {
                    dispatch({ type: ACTIONS.SET_ALL_CONTENT, payload: [...allContent] })
                    console.log(`Updated content: ${allContent.length} total items loaded`)
                }

                // Small delay between batches to prevent UI blocking
                if (i + BATCH_SIZE < categoryEntries.length) {
                    await new Promise(resolve => setTimeout(resolve, 50))
                }
            }

            console.log(`Finished loading ${allContent.length} total items from all categories`)

        } catch (error) {
            console.error('Error loading movie data:', error)
            dispatch({ type: ACTIONS.SET_ERROR, payload: error.message })
        } finally {
            dispatch({ type: ACTIONS.SET_LOADING, payload: false })
        }
    }

    // Memoize the titles list outside of the callback
    const allTitles = useMemo(() =>
        state.allContent.map(item => item.title).filter(Boolean),
        [state.allContent]
    )

    // Action creators
    const actions = {
        setCurrentContent: (content) => dispatch({ type: ACTIONS.SET_CURRENT_CONTENT, payload: content }),
        setCurrentVideo: (video) => dispatch({ type: ACTIONS.SET_CURRENT_VIDEO, payload: video }),
        openPlayer: () => dispatch({ type: ACTIONS.OPEN_PLAYER }),
        closePlayer: () => dispatch({ type: ACTIONS.CLOSE_PLAYER }),
        openDetails: () => dispatch({ type: ACTIONS.OPEN_DETAILS }),
        closeDetails: () => dispatch({ type: ACTIONS.CLOSE_DETAILS }),

        playContent: (content, videoSource = null) => {
            console.log('Playing content:', content) // Debug log
            dispatch({ type: ACTIONS.SET_CURRENT_CONTENT, payload: content })

            // For movies, open video URL in VLC
            if (content.type === 'movie' && content.sources && content.sources.length > 0) {
                const source = videoSource || content.sources[0]
                console.log('Video source:', source) // Debug log
                if (source.urls && source.urls.length > 0) {
                    const videoUrl = source.urls[0]
                    console.log('Opening URL in VLC:', videoUrl) // Debug log

                    // Use the utility function to open in VLC
                    openInVLC(videoUrl, content.title)
                }
            }
            // For series, open details to select episode
            else if (content.type === 'series') {
                console.log('Opening series details') // Debug log
                dispatch({ type: ACTIONS.OPEN_DETAILS })
            }
        },

        playEpisode: (episode, seriesTitle) => {
            if (episode.sources && episode.sources.length > 0) {
                const source = episode.sources[0]
                if (source.urls && source.urls.length > 0) {
                    const videoUrl = source.urls[0]
                    console.log('Opening episode in VLC:', videoUrl) // Debug log

                    // Use the utility function to open in VLC
                    openInVLC(videoUrl, `${seriesTitle} - ${episode.title}`)
                }
            }
        },

        search: useCallback((query) => {
            console.log('Search called with query:', query)
            dispatch({ type: ACTIONS.SET_SEARCH_QUERY, payload: query })

            if (!query.trim()) {
                dispatch({ type: ACTIONS.SET_SEARCH_RESULTS, payload: [] })
                return
            }

            // Check if content is loaded
            if (state.allContent.length === 0) {
                console.log('No content loaded yet, search will retry when content is available')
                // Set loading state while waiting for content
                dispatch({ type: ACTIONS.SET_LOADING, payload: true })

                // Set a timeout to retry search after content loads
                setTimeout(() => {
                    if (state.allContent.length > 0) {
                        console.log('Retrying search with loaded content')
                        const results = optimizedSearch(query, state.allContent, 100)
                        dispatch({ type: ACTIONS.SET_SEARCH_RESULTS, payload: results })
                        dispatch({ type: ACTIONS.SET_LOADING, payload: false })
                    }
                }, 1000)
                return
            }

            // Use debounced search to prevent excessive calls
            debouncedSearch(query, dispatch, state.allContent)
        }, [state.allContent, debouncedSearch]),

        clearSearch: useCallback(() => {
            dispatch({ type: ACTIONS.CLEAR_SEARCH })
            clearSearchCache()
        }, []),

        getSearchSuggestions: useCallback((query) => {
            if (!query.trim() || query.length < 2) return []

            return getSearchSuggestions(query, allTitles, 5)
        }, [allTitles]), getContentByCategory: useCallback((categoryKey) => {
            if (categoryKey === 'all') {
                return state.allContent
            }

            // Check cache first
            if (state.contentByCategory[categoryKey]) {
                return state.contentByCategory[categoryKey]
            }

            // Filter and cache result
            const content = state.allContent.filter(item => item.categoryKey === categoryKey)
            dispatch({
                type: ACTIONS.SET_CONTENT_BY_CATEGORY,
                payload: { category: categoryKey, content }
            })

            return content
        }, [state.allContent, state.contentByCategory]),

        reloadData: () => {
            loadMovieData()
        },

        // Debug function to test search directly
        debugSearch: (query) => {
            console.log('Debug search called with:', query)
            console.log('Available content:', state.allContent.length)
            if (state.allContent.length > 0) {
                const results = optimizedSearch(query, state.allContent, 100)
                console.log('Debug search results:', results.length, results.slice(0, 3))
                return results
            }
            return []
        }
    }

    return (
        <MovieContext.Provider value={{ state, actions }}>
            {children}
        </MovieContext.Provider>
    )
}

// Custom hook
export function useMovie() {
    const context = useContext(MovieContext)
    if (!context) {
        throw new Error('useMovie must be used within a MovieProvider')
    }
    return context
}
