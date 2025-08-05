interface NotFoundProps {
  onGoHome?: () => void
}

export default function NotFound({ onGoHome }: NotFoundProps) {
  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome()
    } else {
      window.location.href = "/login"
    }
  }

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center bg-white">
      <div className="text-center space-y-6">
        <h1 className="text-9xl font-bold text-gray-900">404</h1>

        <h2 className="text-2xl font-medium text-gray-600">Page not found</h2>

        <button
          onClick={handleGoHome}
          className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          Go Home
        </button>
      </div>
    </div>
  )
}
