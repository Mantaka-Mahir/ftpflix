// Cache for search results to avoid repeated calculations
const searchCache = new Map()
const MAX_CACHE_SIZE = 100

/**
 * Debounce function to limit function calls
 */
export function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

/**
 * Optimized search function with caching and early termination
 * @param {string} query - Search query
 * @param {Array} content - Array of content items
 * @param {number} maxResults - Maximum number of results to return
 * @returns {Array} - Array of matching content
 */
export function optimizedSearch(query, content, maxResults = 50) {
    if (!query || query.length < 1) {
        return []
    }

    if (!content || content.length === 0) {
        console.log('No content available for search')
        return []
    }

    const normalizedQuery = query.toLowerCase().trim()

    // Check cache first
    const cacheKey = `${normalizedQuery}_${maxResults}`
    if (searchCache.has(cacheKey)) {
        return searchCache.get(cacheKey)
    }

    const results = []
    const searchTerms = normalizedQuery.split(' ').filter(term => term.length > 0)

    console.log(`Searching for: "${normalizedQuery}" in ${content.length} items`)

    // Search through all content
    for (let i = 0; i < content.length; i++) {
        const item = content[i]
        if (!item || !item.title) continue

        const normalizedTitle = item.title.toLowerCase()
        const normalizedCategory = item.category ? item.category.toLowerCase() : ''

        let score = 0
        let matches = 0
        let hasAnyMatch = false

        // Check each search term - more flexible matching
        for (const term of searchTerms) {
            let termMatched = false

            if (normalizedTitle.includes(term)) {
                termMatched = true
                hasAnyMatch = true
                matches++
                // Higher score for exact matches at the beginning
                if (normalizedTitle.startsWith(term)) {
                    score += 10
                } else if (normalizedTitle.indexOf(term) < 10) {
                    score += 5
                } else {
                    score += 2
                }
            }

            if (normalizedCategory.includes(term)) {
                if (!termMatched) {
                    matches++
                    hasAnyMatch = true
                }
                score += 1
            }
        }

        // More lenient matching - include if any term matches or if there's partial relevance
        if (hasAnyMatch && (matches > 0 || score > 0)) {
            results.push({
                ...item,
                searchScore: score
            })
        }
    }

    console.log(`Found ${results.length} results for "${normalizedQuery}"`)

    // Sort by relevance score
    const sortedResults = results
        .sort((a, b) => (b.searchScore || 0) - (a.searchScore || 0))
        .slice(0, maxResults)    // Cache the result
    if (searchCache.size >= MAX_CACHE_SIZE) {
        // Remove oldest entries
        const firstKey = searchCache.keys().next().value
        searchCache.delete(firstKey)
    }
    searchCache.set(cacheKey, sortedResults)

    return sortedResults
}

/**
 * Get search suggestions based on input with optimization
 * @param {string} query - Search query
 * @param {Array} allTitles - Array of all possible titles
 * @param {number} maxSuggestions - Maximum number of suggestions to return
 * @returns {Array} - Array of suggested titles
 */
export function getSearchSuggestions(query, allTitles, maxSuggestions = 5) {
    if (!query || query.length < 1) {
        return []
    }

    const normalizedQuery = query.toLowerCase().trim()
    const cacheKey = `suggestions_${normalizedQuery}_${maxSuggestions}`

    // Check cache first
    if (searchCache.has(cacheKey)) {
        return searchCache.get(cacheKey)
    }

    const suggestions = []
    const maxToCheck = Math.min(allTitles.length, 2000) // Increased limit for better suggestions

    for (let i = 0; i < maxToCheck && suggestions.length < maxSuggestions * 3; i++) {
        const title = allTitles[i]
        if (!title) continue

        const normalizedTitle = title.toLowerCase()
        if (normalizedTitle.includes(normalizedQuery)) {
            const score = normalizedTitle.indexOf(normalizedQuery) === 0 ? 3 :
                normalizedTitle.indexOf(normalizedQuery) < 10 ? 2 : 1
            suggestions.push({ title, score })
        }
    }

    // Sort by score and return top suggestions
    const result = suggestions
        .sort((a, b) => b.score - a.score)
        .slice(0, maxSuggestions)
        .map(item => item.title)

    // Cache the result
    if (searchCache.size >= MAX_CACHE_SIZE) {
        const firstKey = searchCache.keys().next().value
        searchCache.delete(firstKey)
    }
    searchCache.set(cacheKey, result)

    return result
}

/**
 * Clear search cache
 */
export function clearSearchCache() {
    searchCache.clear()
}