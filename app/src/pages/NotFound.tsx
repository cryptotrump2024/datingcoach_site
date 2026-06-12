import { Link } from 'react-router-dom'
import { Home, MessageCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[80dvh] flex flex-col items-center justify-center gap-5 px-6 text-center">
      <p className="font-display text-7xl font-bold gradient-text-rose">404</p>
      <h1 className="font-display text-2xl font-semibold text-text-primary">
        This page ghosted you
      </h1>
      <p className="max-w-md text-text-secondary">
        The page you're looking for doesn't exist or has moved. Don't take it personally — let's
        get you back in the conversation.
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="btn-gradient inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium"
        >
          <Home className="h-4 w-4" aria-hidden="true" />
          Back to home
        </Link>
        <Link
          to="/scenarios"
          className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 font-medium text-text-primary transition-colors hover:bg-bg-secondary"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Practice scenarios
        </Link>
      </div>
    </div>
  )
}
