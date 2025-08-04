import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react'
import { getSearchSuggestions } from '../utils/fuzzySearch'

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
    allContent: []
}

// Action types
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
    SET_ERROR: 'SET_ERROR'
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

    // Debounce mechanism to prevent multiple VLC openings
    const vlcOpeningRef = useRef(false)

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

    // Function to group series by main title and combine seasons
    const groupSeriesByTitle = (items) => {
        const seriesMap = new Map()
        const bannerMap = new Map() // Store banners separately first

        // First pass: collect all banners from items that have them
        items.forEach(item => {
            if (item.banner && item.title) {
                // Extract the core series name from titles that have banners
                let coreTitle = item.title

                // Remove various patterns to get core title
                coreTitle = coreTitle.replace(/^.*?\s*-\s*/, '') // Remove category prefix
                coreTitle = coreTitle.replace(/\s*-\s*Season\s+\d+.*$/i, '') // Remove season suffix
                coreTitle = coreTitle.replace(/\s+\([^)]*\)\s*.*$/, '') // Remove year/quality info and everything after
                coreTitle = coreTitle.trim()

                // Store banner with the core title and original title
                if (coreTitle && !bannerMap.has(coreTitle)) {
                    bannerMap.set(coreTitle, item.banner)
                    console.log(`Found banner for: "${coreTitle}" -> ${item.banner}`)
                }
                // Also store with original title as fallback
                if (item.title && !bannerMap.has(item.title)) {
                    bannerMap.set(item.title, item.banner)
                }
            }
        })

        // Second pass: group series and assign banners (more lenient filtering)
        items.forEach(item => {
            // Only skip truly empty items
            if (!item.title) {
                return
            }

            // More lenient check - include items with seasons even if some don't have episodes
            if (item.seasons && item.seasons.length > 0) {
                // This item has seasons, process it
            } else if (item.episodes && item.episodes.length > 0) {
                // This item has direct episodes, convert to season format
                item.seasons = [{
                    season_number: 1,
                    episodes: item.episodes
                }]
            } else {
                // Skip only if it has no content at all
                console.log(`Skipping item with no content: "${item.title}"`)
                return
            }

            // Extract main series title by removing season info
            let mainTitle = item.title

            // Handle specific pattern like "Demon Slayer-Kimetsu no Yaiba (TV Cartoon 2019– ) 1080p [Multi Audio] - Season X"
            let seasonMatch = item.title.match(/^(.*?)\s*-\s*Season\s+\d+/i)
            if (seasonMatch) {
                mainTitle = seasonMatch[1].trim()
            } else {
                // Handle pattern like "Anime-TV Series ♥ A — F - Series Name (details)"
                let categoryMatch = item.title.match(/^.*?\s*-\s*(.+?)\s*\([^)]*\)\s*.*$/i)
                if (categoryMatch) {
                    mainTitle = categoryMatch[1].trim()
                } else {
                    // Remove category prefix if it exists (fallback)
                    mainTitle = item.title.replace(/^.*?\s*-\s*/, '').trim()
                }
            }

            // Clean up the main title to match banner keys
            let coreTitle = mainTitle.replace(/\s+\([^)]*\)\s*.*$/, '').trim()

            // Get or create the main series entry
            if (!seriesMap.has(mainTitle)) {
                // Find the best matching banner using multiple strategies
                let banner = item.banner || // Use item's own banner first
                    bannerMap.get(coreTitle) ||
                    bannerMap.get(mainTitle) ||
                    bannerMap.get(item.title) || // Try original title
                    null

                // If no banner found, try partial matching with more flexible approach
                if (!banner) {
                    // Extract core name for matching (like "Demon Slayer-Kimetsu no Yaiba")
                    let extractedCore = mainTitle.replace(/\s*\([^)]*\).*$/, '').trim()

                    for (const [bannerKey, bannerUrl] of bannerMap.entries()) {
                        let bannerCore = bannerKey.replace(/\s*\([^)]*\).*$/, '').trim()

                        if (extractedCore.toLowerCase().includes(bannerCore.toLowerCase()) ||
                            bannerCore.toLowerCase().includes(extractedCore.toLowerCase()) ||
                            coreTitle.toLowerCase().includes(bannerCore.toLowerCase()) ||
                            bannerCore.toLowerCase().includes(coreTitle.toLowerCase()) ||
                            mainTitle.toLowerCase().includes(bannerCore.toLowerCase()) ||
                            bannerCore.toLowerCase().includes(mainTitle.toLowerCase())) {
                            banner = bannerUrl
                            console.log(`Found partial match banner for "${mainTitle}": ${bannerKey}`)
                            break
                        }
                    }
                }

                seriesMap.set(mainTitle, {
                    title: mainTitle,
                    banner: banner,
                    seasons: [],
                    type: 'series',
                    category: item.category,
                    categoryKey: item.categoryKey
                })

                console.log(`Created series: "${mainTitle}" with banner: ${banner ? 'YES' : 'NO'}`)
            }

            const mainSeries = seriesMap.get(mainTitle)

            // Add seasons from this item to the main series
            if (item.seasons) {
                item.seasons.forEach(season => {
                    // Check if this season already exists and has episodes
                    const existingSeason = mainSeries.seasons.find(s => s.season_number === season.season_number)
                    if (!existingSeason && season.episodes && season.episodes.length > 0) {
                        mainSeries.seasons.push(season)
                    }
                })
            }
        })

        // Convert map to array and sort seasons
        const groupedSeries = Array.from(seriesMap.values())
        groupedSeries.forEach(series => {
            series.seasons.sort((a, b) => a.season_number - b.season_number)
        })

        console.log(`Grouped ${items.length} series items into ${groupedSeries.length} main series`)
        console.log(`Found banners for ${bannerMap.size} series`)

        // Add fallback banners for series without banners
        groupedSeries.forEach(series => {
            if (!series.banner) {
                // Create a placeholder banner URL
                series.banner = `https://via.placeholder.com/300x450/1a1a1a/ffffff?text=${encodeURIComponent(series.title)}`
                console.log(`Added placeholder banner for: "${series.title}"`)
            }
        })

        return groupedSeries
    }

    // Load movie data from JSON files
    const loadMovieData = async () => {
        try {
            dispatch({ type: ACTIONS.SET_LOADING, payload: true })

            // Load index.json to get categories
            const indexResponse = await fetch('/data/index.json')
            const indexData = await indexResponse.json()
            dispatch({ type: ACTIONS.SET_CATEGORIES, payload: indexData.categories })

            // Load all content from different category files
            const allContent = []
            const categoryPromises = Object.keys(indexData.categories)
                .filter(categoryKey => categoryKey !== 'all') // Skip 'all' category
                .map(async (categoryKey) => {
                    try {
                        console.log(`Loading ${categoryKey}.json...`)
                        const response = await fetch(`/data/${categoryKey}.json`)
                        const data = await response.json()
                        if (data.items) {
                            console.log(`Loaded ${data.items.length} items from ${categoryKey}`)

                            // Special handling for series to group seasons
                            if (data.type === 'series') {
                                const groupedSeries = groupSeriesByTitle(data.items)
                                groupedSeries.forEach(item => {
                                    allContent.push({
                                        ...item,
                                        category: data.category,
                                        categoryKey,
                                        type: data.type
                                    })
                                })
                            } else {
                                // Regular handling for movies
                                data.items.forEach(item => {
                                    allContent.push({
                                        ...item,
                                        category: data.category,
                                        categoryKey,
                                        type: data.type
                                    })
                                })
                            }
                        }
                    } catch (error) {
                        console.warn(`Failed to load ${categoryKey}.json:`, error)
                    }
                })

            await Promise.all(categoryPromises)
            console.log(`Loaded ${allContent.length} total items from all categories`)
            dispatch({ type: ACTIONS.SET_ALL_CONTENT, payload: allContent })

        } catch (error) {
            dispatch({ type: ACTIONS.SET_ERROR, payload: error.message })
        } finally {
            dispatch({ type: ACTIONS.SET_LOADING, payload: false })
        }
    }

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

        search: (query) => {
            dispatch({ type: ACTIONS.SET_SEARCH_QUERY, payload: query })

            if (!query.trim()) {
                dispatch({ type: ACTIONS.SET_SEARCH_RESULTS, payload: [] })
                return
            }

            const results = state.allContent.filter(item =>
                item.title.toLowerCase().includes(query.toLowerCase()) ||
                (item.category && item.category.toLowerCase().includes(query.toLowerCase()))
            )

            dispatch({ type: ACTIONS.SET_SEARCH_RESULTS, payload: results })
        },

        getSearchSuggestions: (query) => {
            if (!query.trim()) return []

            const allTitles = state.allContent.map(item => item.title)
            return getSearchSuggestions(query, allTitles, 5)
        },

        getContentByCategory: (categoryKey) => {
            if (categoryKey === 'all') {
                return state.allContent
            }
            return state.allContent.filter(item => item.categoryKey === categoryKey)
        },

        reloadData: () => {
            loadMovieData()
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
