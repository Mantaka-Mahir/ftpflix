import React from 'react'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            retryCount: 0
        }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true }
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo)
        this.setState({
            error: error,
            errorInfo: errorInfo
        })

        // Log to external service in production
        if (process.env.NODE_ENV === 'production') {
            // Here you could send error to logging service
            console.error('Production error:', {
                message: error.message,
                stack: error.stack,
                componentStack: errorInfo.componentStack
            })
        }
    }

    handleRetry = () => {
        this.setState(prevState => ({
            hasError: false,
            error: null,
            errorInfo: null,
            retryCount: prevState.retryCount + 1
        }))
    }

    handleReload = () => {
        window.location.reload()
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-ftpflix-black text-white flex items-center justify-center">
                    <div className="max-w-md mx-auto text-center p-6">
                        <div className="mb-6">
                            <svg
                                className="mx-auto h-16 w-16 text-red-500 mb-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                                />
                            </svg>
                            <h1 className="text-2xl font-bold text-red-500 mb-2">Oops! Something went wrong</h1>
                            <p className="text-gray-400 mb-4">
                                We encountered an unexpected error. This might be due to a temporary issue.
                            </p>
                        </div>

                        <div className="space-y-3 mb-6">
                            <button
                                onClick={this.handleRetry}
                                className="w-full bg-ftpflix-red text-white px-6 py-3 rounded hover:bg-red-700 transition-colors"
                                disabled={this.state.retryCount >= 3}
                            >
                                {this.state.retryCount >= 3 ? 'Max retries reached' : `Try Again (${this.state.retryCount}/3)`}
                            </button>

                            <button
                                onClick={this.handleReload}
                                className="w-full bg-gray-600 text-white px-6 py-3 rounded hover:bg-gray-700 transition-colors"
                            >
                                Reload Page
                            </button>
                        </div>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="text-left bg-gray-800 p-4 rounded text-sm">
                                <summary className="cursor-pointer text-yellow-400 mb-2">
                                    Debug Information (Development Only)
                                </summary>
                                <div className="space-y-2">
                                    <div>
                                        <strong className="text-red-400">Error:</strong>
                                        <pre className="text-gray-300 text-xs mt-1 overflow-auto">
                                            {this.state.error.toString()}
                                        </pre>
                                    </div>
                                    <div>
                                        <strong className="text-red-400">Stack Trace:</strong>
                                        <pre className="text-gray-300 text-xs mt-1 overflow-auto max-h-32">
                                            {this.state.error.stack}
                                        </pre>
                                    </div>
                                    {this.state.errorInfo && (
                                        <div>
                                            <strong className="text-red-400">Component Stack:</strong>
                                            <pre className="text-gray-300 text-xs mt-1 overflow-auto max-h-32">
                                                {this.state.errorInfo.componentStack}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            </details>
                        )}

                        <div className="text-gray-500 text-sm mt-6">
                            <p>If the problem persists, try:</p>
                            <ul className="list-disc list-inside text-left space-y-1 mt-2">
                                <li>Clearing your browser cache</li>
                                <li>Checking your internet connection</li>
                                <li>Updating your browser</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
