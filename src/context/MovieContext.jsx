import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react'

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

        let vlcOpened = false

        // Method 1: Try VLC protocol registration (Windows) - Primary method
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
                            data.items.forEach(item => {
                                allContent.push({
                                    ...item,
                                    category: data.category,
                                    categoryKey,
                                    type: data.type
                                })
                            })
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
