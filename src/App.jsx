import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { MovieProvider } from './context/MovieContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import SearchPage from './pages/SearchPage'
import DebugPage from './pages/DebugPage'
import VideoPlayer from './components/VideoPlayer'
import VLCNotification from './components/VLCNotification'
import VLCSetupGuide from './components/VLCSetupGuide'
import VLCMobileGuide from './components/VLCMobileGuide'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
    return (
        <ErrorBoundary>
            <MovieProvider>
                <Router>
                    <div className="min-h-screen bg-ftpflix-black text-white">
                        <Navbar />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/category/:categoryId" element={<CategoryPage />} />
                            <Route path="/search" element={<SearchPage />} />
                            <Route path="/debug" element={<DebugPage />} />
                        </Routes>
                        <VideoPlayer />
                        <VLCNotification />
                        <VLCSetupGuide />
                        <VLCMobileGuide />
                    </div>
                </Router>
            </MovieProvider>
        </ErrorBoundary>
    )
}

export default App
