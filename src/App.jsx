import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { MovieProvider } from './context/MovieContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import VideoPlayer from './components/VideoPlayer'
import VLCNotification from './components/VLCNotification'
import VLCSetupGuide from './components/VLCSetupGuide'
import VLCMobileGuide from './components/VLCMobileGuide'
import ErrorBoundary from './components/ErrorBoundary'
import PerformanceMonitor from './components/PerformanceMonitor'

// Lazy load pages for better performance
const CategoryPage = lazy(() => import('./pages/CategoryPage'))
const SearchPage = lazy(() => import('./pages/SearchPage'))
const DebugPage = lazy(() => import('./pages/DebugPage'))
const TestPage = lazy(() => import('./pages/TestPage'))

// Loading component
const LoadingSpinner = () => (
    <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
    </div>
)

function App() {
    return (
        <ErrorBoundary>
            <MovieProvider>
                <Router>
                    <div className="min-h-screen bg-ftpflix-black text-white">
                        <Navbar />
                        <Suspense fallback={<LoadingSpinner />}>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/category/:categoryId" element={<CategoryPage />} />
                                <Route path="/search" element={<SearchPage />} />
                                <Route path="/debug" element={<DebugPage />} />
                                <Route path="/test" element={<TestPage />} />
                            </Routes>
                        </Suspense>
                        <VideoPlayer />
                        <VLCNotification />
                        <VLCSetupGuide />
                        <VLCMobileGuide />
                        <PerformanceMonitor />
                    </div>
                </Router>
            </MovieProvider>
        </ErrorBoundary>
    )
}

export default App
