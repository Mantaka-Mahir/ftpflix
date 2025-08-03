import React, { useRef } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import ContentCard from './ContentCard'

function ContentRow({ title, content, loading = false }) {
    const scrollRef = useRef(null)

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 300
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            })
        }
    }

    if (loading) {
        return (
            <div className="mb-8">
                <div className="skeleton h-6 w-48 mb-4 rounded" />
                <div className="flex gap-4 overflow-hidden">
                    {Array(6).fill(0).map((_, index) => (
                        <div key={index} className="skeleton w-48 h-72 rounded-lg flex-shrink-0" />
                    ))}
                </div>
            </div>
        )
    }

    if (!content || content.length === 0) return null

    return (
        <div className="mb-8 group">
            <h2 className="text-xl font-semibold text-white mb-4 px-4 md:px-8">
                {title}
            </h2>

            <div className="relative">
                {/* Left Arrow */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70"
                >
                    <FiChevronLeft size={24} />
                </button>

                {/* Content Scroll Container */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto hide-scrollbar px-4 md:px-8 pb-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {content.map((item, index) => (
                        <ContentCard
                            key={`${item.title}-${index}`}
                            content={item}
                            size="medium"
                        />
                    ))}
                </div>

                {/* Right Arrow */}
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70"
                >
                    <FiChevronRight size={24} />
                </button>
            </div>
        </div>
    )
}

export default ContentRow
