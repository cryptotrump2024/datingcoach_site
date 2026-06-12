import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled error:', error, info.componentStack)
  }

  handleReset = () => {
    this.setState({ hasError: false })
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[100dvh] flex flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-5xl">💔</p>
          <h1 className="font-display text-2xl font-semibold text-text-primary">
            Something went wrong
          </h1>
          <p className="max-w-md text-text-secondary">
            An unexpected error interrupted the page. Your practice history is safe — head back
            home and try again.
          </p>
          <button
            onClick={this.handleReset}
            className="btn-gradient mt-2 rounded-full px-6 py-3 font-medium"
          >
            Back to home
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
