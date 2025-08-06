interface NotFoundProps {
  onGoHome?: () => void
}

export default function NotFound({ onGoHome }: NotFoundProps) {
  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome()
    } else {
      window.location.href = "/"
    }
  }

  return (
    <>
      <div className="error-page">
        <div className="error-content">
          <h1 className="error-title">404</h1>
          <h2 className="error-subtitle">Page not found</h2>
          <button
            onClick={handleGoHome}
            className="go-home-button"
          >
            Go Home
          </button>
        </div>
      </div>
      <style>
        {`
          .error-page {
            height: 100vh;
            width: 100vw;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background-color: white;
          }

          .error-content {
            text-align: center;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          .error-title {
            font-size: 9rem;
            font-weight: bold;
            color: #1f2937;
          }

          .error-subtitle {
            font-size: 1.5rem;
            font-weight: 500;
            color: #4b5563;
          }

          .go-home-button {
            margin-top: 2rem;
            padding: 0.75rem 1.5rem;
            background-color: #2563eb;
            color: white;
            font-weight: 500;
            border-radius: 0.375rem;
            border: none;
            cursor: pointer;
            transition: background-color 0.2s;
          }

          .go-home-button:hover {
            background-color: #1d4ed8;
          }

          .go-home-button:focus {
            outline: 2px solid #2563eb;
            outline-offset: 2px;
          }
        `}
      </style>
    </>
  )
}
