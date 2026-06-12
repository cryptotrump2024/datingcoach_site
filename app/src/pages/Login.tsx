import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.166.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
)

const AppleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.302 1.559c.566-.696 1.01-1.65.956-2.635-.925.039-2.044.616-2.707 1.313-.523.543-1.01 1.451-.884 2.38.992.076 2.007-.52 2.635-1.058zm2.466 8.066c-.021 2.197 1.924 2.927 1.946 2.937-.016.055-.304 1.04-1.003 2.06-.604.884-1.232 1.766-2.222 1.784-.97.019-1.28-.575-2.388-.575-1.108 0-1.453.558-2.37.593-1.005.036-1.77-1.008-2.385-1.896-1.298-1.876-2.29-5.304-.955-7.632C5.63 3.56 7.05 2.7 8.57 2.682c.96-.016 1.866.647 2.453.647.587 0 1.688-.8 2.846-.682.485.02 1.848.196 2.722 1.478-.07.044-1.622.96-1.603 2.86z" fill="currentColor"/>
  </svg>
)

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loginWithGoogle, isCloudMode: cloudMode } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const from = (location.state as { from?: string })?.from || '/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await login(email, password)
      if (result.ok) {
        navigate(from, { replace: true })
      } else {
        setError(result.error ?? 'Invalid email or password')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError('')
    const result = await loginWithGoogle()
    if (!result.ok) setError(result.error ?? 'Google sign-in failed')
  }

  return (
    <div className="min-h-[calc(100dvh-72px)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient background glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(225,29,72,0.3) 0%, transparent 70%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="w-full max-w-[420px] relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5"
            style={{
              background: 'linear-gradient(135deg, #E11D48 0%, #D97706 50%, #8B5CF6 100%)',
              boxShadow: '0 0 40px rgba(225, 29, 72, 0.3)',
            }}
          >
            <LogIn className="w-7 h-7 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-display-subsection text-text-primary mb-2"
          >
            Welcome back
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-body text-text-secondary"
          >
            Sign in to continue your conversation practice
          </motion.p>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="glass-card p-8"
        >
          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[rgba(28, 25, 23, 0.1)]" />
            <span className="text-caption text-text-muted uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-[rgba(28, 25, 23, 0.1)]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-body-sm font-medium text-text-secondary mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-bg-tertiary border border-[rgba(28, 25, 23, 0.08)] text-text-primary text-body placeholder-text-muted focus:outline-none focus:border-[rgba(225,29,72,0.4)] focus:ring-1 focus:ring-[rgba(225,29,72,0.2)] transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-body-sm font-medium text-text-secondary mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-11 pr-11 py-3 rounded-xl bg-bg-tertiary border border-[rgba(28, 25, 23, 0.08)] text-text-primary text-body placeholder-text-muted focus:outline-none focus:border-[rgba(225,29,72,0.4)] focus:ring-1 focus:ring-[rgba(225,29,72,0.2)] transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div
                    className="w-5 h-5 rounded-md border border-[rgba(255,255,255,0.12)] bg-bg-tertiary peer-checked:bg-[#E11D48] peer-checked:border-[#E11D48] transition-all duration-200 flex items-center justify-center"
                  >
                    {rememberMe && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </div>
                </div>
                <span className="text-body-sm text-text-secondary">Remember me</span>
              </label>
              <Link
                to="#"
                className="text-body-sm text-[#BE123C] hover:text-[#E11D48] transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-body-sm text-center"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl btn-gradient text-text-primary font-semibold text-body disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Log In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Social Login Buttons */}
          <div className="flex flex-col gap-3 w-full mt-6">
            <button
              type="button"
              onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-3 bg-white text-[#1f1f1f] font-medium text-sm rounded px-4 py-2.5 border border-[#dadce0] hover:bg-[#f8f9fa] transition-colors cursor-pointer"
            >
              <GoogleIcon />
              Continue with Google
            </button>
            <button
              type="button"
              onClick={() => setError('Apple sign-in is coming soon.')}
              className="w-full flex items-center justify-center gap-3 bg-black text-white font-medium text-sm rounded px-4 py-2.5 hover:bg-[#1a1a1a] transition-colors cursor-pointer"
            >
              <AppleIcon />
              Continue with Apple
            </button>
          </div>
          {!cloudMode && (
            <p className="text-caption text-text-muted text-center mt-4">
              Local mode — profiles live only in this browser, no password required.
            </p>
          )}
        </motion.div>

        {/* Sign Up Link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-6 text-body text-text-secondary"
        >
          Don&apos;t have an account?{' '}
          <Link
            to="/signup"
            className="text-[#BE123C] hover:text-[#E11D48] font-medium transition-colors"
          >
            Sign up
          </Link>
        </motion.p>
      </motion.div>
    </div>
  )
}
