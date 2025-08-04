/**
 * Get search suggestions based on input
 * @param {string} query - Search query
 * @param {Array} allTitles - Array of all possible titles
 * @param {number} maxSuggestions - Maximum number of suggestions to return
 * @returns {Array} - Array of suggested titles
 */
export function getSearchSuggestions(query, allTitles, maxSuggestions = 5) {
    if (!query || query.length < 2) {
        return []
    }

    const normalizedQuery = query.toLowerCase().trim()
    const suggestions = []

    allTitles.forEach(title => {
        const normalizedTitle = title.toLowerCase()
        if (normalizedTitle.includes(normalizedQuery)) {
            suggestions.push({
                title,
                score: normalizedTitle.indexOf(normalizedQuery) === 0 ? 1 : 0.8 // Prefer titles that start with query
            })
        }
    })

    // Sort by score and return top suggestions
    return suggestions
        .sort((a, b) => b.score - a.score)
        .slice(0, maxSuggestions)
        .map(item => item.title)
}