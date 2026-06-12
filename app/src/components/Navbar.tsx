// @ts-nocheck
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  X,
  MessageCircle,
  User,
  LogOut,
  Crown,
  Home,
  BookOpen,
  CreditCard,
  Target,
  Flame,
} from 'lucide-react'
import CreditBadge from './CreditBadge'
import { useStore } from '@/store'

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Scenarios', path: '/scenarios' },
  { label: 'Science', path: '/science' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'Profile Analyzer', path: '/profile-analyzer' },
]

const bottomTabs = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Drills', path: '/scenarios', icon: Target },
  { label: 'Pricing', path: '/pricing', icon: CreditCard },
  { label: 'Profile', path: '/profile-analyzer', icon: User },
]

function StreakFlame() {
  const streak = useStore((s) => s.progress.streak)
  if (streak < 1) return null
  return (
    <span
      className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-caption font-semibold"
      style={{ background: 'rgba(217, 119, 6, 0.12)', color: '#B45309' }}
      title={`${streak}-day practice streak`}
    >
      <Flame className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
      {streak}
    </span>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const location = useLocation()
  const user = useStore((s) => s.user)
  const isAuthenticated = useStore((s) => s.isAuthenticated)
  const logout = useStore((s) => s.logout)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  // Close hamburger on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mobileOpen])

  return (
    <>
      {/* ====== TOP NAVBAR (desktop + mobile) ====== */}
      <motion.nav
        initial={{ y: -72 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className={`fixed top-0 left-0 right-0 h-[72px] z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[rgba(253,251,247,0.92)] shadow-card'
            : 'bg-[rgba(253,251,247,0.75)]'
        }`}
        style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(28, 25, 23, 0.06)' }}
      >
        <div className="max-w-[1200px] mx-auto h-full flex items-center justify-between px-6">
          {/* Logo – visible on all screens */}
          <Link to="/" className="flex items-center gap-3">
            <div className="relative w-8 h-8">
              <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E11D48" />
                    <stop offset="50%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
                <path
                  d="M8 8C8 8 12 4 16 8C20 12 24 8 24 8V16C24 20 20 24 16 24C12 24 8 20 8 16V8Z"
                  stroke="url(#logoGradient)"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="14" r="1.5" fill="url(#logoGradient)" />
                <circle cx="20" cy="14" r="1.5" fill="url(#logoGradient)" />
                <path d="M13.5 18C13.5 18 14.5 19.5 16 19.5C17.5 19.5 18.5 18 18.5 18" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-heading-sm text-text-primary">DatingCoach</span>
          </Link>

          {/* Desktop Nav Links – hidden on mobile */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-body font-medium transition-colors duration-200 ${
                  location.pathname === link.path
                    ? 'text-[#BE123C]'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {link.label}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="navUnderline"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-[#E11D48] to-[#F59E0B]"
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Right Section – hidden on mobile */}
          <div className="hidden md:flex items-center gap-4">
            <StreakFlame />
            {isAuthenticated && user && (
              <>
                <CreditBadge />
                <Link
                  to="/dashboard"
                  className={`text-body font-medium transition-colors ${
                    location.pathname === '/dashboard' ? 'text-[#BE123C]' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Dashboard
                </Link>
              </>
            )}
            <Link
              to="/create"
              className="flex items-center gap-2 btn-gradient text-text-primary text-body-sm font-semibold px-5 py-2.5 rounded-full"
            >
              Start Practice
              <MessageCircle className="w-4 h-4" />
            </Link>
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-[rgba(28, 25, 23, 0.08)] hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#E11D48] to-[#8B5CF6] flex items-center justify-center text-white text-xs font-bold">
                    {user.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-body-sm text-text-primary font-medium">{user.username}</span>
                  {user.plan === 'advanced' && <Crown className="w-3.5 h-3.5 text-[#FBBF24]" />}
                  {user.plan === 'pro' && <Crown className="w-3.5 h-3.5 text-text-secondary" />}
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 w-48 glass-card-elevated rounded-xl overflow-hidden"
                    >
                      <div className="p-3 border-b border-[rgba(28, 25, 23, 0.08)]">
                        <p className="text-body-sm text-text-primary font-medium truncate">{user.username}</p>
                        <p className="text-caption text-text-muted">{user.email}</p>
                        <span className={`inline-block mt-1 text-caption font-semibold px-2 py-0.5 rounded-full ${
                          user.plan === 'advanced' ? 'bg-[#8B5CF6]/20 text-[#A78BFA]' :
                          user.plan === 'pro' ? 'bg-[#F59E0B]/20 text-[#FBBF24]' :
                          'bg-stone-400/20 text-text-secondary'
                        }`}>
                          {user.plan === 'advanced' ? 'Advanced' : user.plan === 'pro' ? 'Pro' : 'Free'}
                        </span>
                      </div>
                      <Link
                        to="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-body-sm text-text-secondary hover:text-text-primary hover:bg-[rgba(28, 25, 23, 0.06)] transition-colors"
                      >
                        <User className="w-4 h-4" /> Dashboard
                      </Link>
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false) }}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-body-sm text-[#EF4444] hover:bg-[rgba(239,68,68,0.1)] transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-body font-medium text-text-primary px-5 py-2.5 rounded-full border border-[rgba(255,255,255,0.12)] hover:border-[rgba(225,29,72,0.5)] hover:bg-[rgba(225,29,72,0.08)] hover:text-[#BE123C] transition-all duration-200"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-2 btn-gradient text-text-primary text-body-sm font-semibold px-5 py-2.5 rounded-full"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger – visible on mobile only */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      {/* ====== MOBILE FULL-SCREEN HAMBURGER OVERLAY ====== */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] md:hidden bg-[rgba(253,251,247,0.98)] backdrop-blur-xl"
          >
            {/* Close button */}
            <div className="flex items-center justify-end h-[72px] px-6">
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-text-secondary hover:text-text-primary transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Menu content */}
            <div className="flex flex-col gap-2 px-6 pb-6">
              {/* Primary CTA */}
              <Link
                to="/create"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 btn-gradient text-text-primary text-body-sm font-semibold px-6 py-3.5 rounded-full w-full min-h-[56px]"
              >
                Start Practice
                <MessageCircle className="w-4 h-4" />
              </Link>

              {/* Auth links */}
              {!isAuthenticated && (
                <div className="flex items-center justify-center gap-4 mt-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="text-body font-medium text-text-primary py-2 transition-colors hover:text-[#BE123C]"
                  >
                    Log In
                  </Link>
                  <span className="text-text-muted">/</span>
                  <Link
                    to="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="text-body font-medium text-text-primary py-2 transition-colors hover:text-[#BE123C]"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Separator */}
              <div className="my-3 border-t border-stone-900/10" />

              {/* Nav links */}
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center min-h-[56px] px-4 rounded-xl text-body font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-[#BE123C] bg-[rgba(225,29,72,0.1)]'
                      : 'text-text-secondary hover:text-text-primary hover:bg-[rgba(28, 25, 23, 0.06)]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Dashboard link for authenticated users */}
              {isAuthenticated && user && (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center min-h-[56px] px-4 rounded-xl text-body font-medium transition-colors ${
                      location.pathname === '/dashboard'
                        ? 'text-[#BE123C] bg-[rgba(225,29,72,0.1)]'
                        : 'text-text-secondary hover:text-text-primary hover:bg-[rgba(28, 25, 23, 0.06)]'
                    }`}
                  >
                    Dashboard
                  </Link>
                  {/* Separator */}
                  <div className="my-3 border-t border-stone-900/10" />
                  {/* User info + Sign Out */}
                  <div className="flex items-center gap-3 px-4 py-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E11D48] to-[#8B5CF6] flex items-center justify-center text-white text-xs font-bold">
                      {user.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-body-sm text-text-primary font-medium truncate">{user.username}</p>
                      <p className="text-caption text-text-muted">{user.credits} credits</p>
                    </div>
                    {user.plan === 'advanced' && <Crown className="w-4 h-4 text-[#FBBF24]" />}
                    {user.plan === 'pro' && <Crown className="w-4 h-4 text-text-secondary" />}
                  </div>
                  <button
                    onClick={() => { logout(); setMobileOpen(false) }}
                    className="flex items-center min-h-[56px] px-4 text-body font-medium text-[#EF4444] hover:bg-[rgba(239,68,68,0.1)] rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Sign Out
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== MOBILE BOTTOM TAB BAR ====== */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 z-50 md:hidden bg-[rgba(253,251,247,0.95)] backdrop-blur-xl border-t border-stone-900/10 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-full px-2">
          {bottomTabs.map((tab) => {
            const isActive = location.pathname === tab.path
            const Icon = tab.icon
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className="flex flex-col items-center justify-center gap-0.5 w-16 h-full"
              >
                <Icon
                  className={`w-5 h-5 transition-colors duration-200 ${
                    isActive
                      ? 'text-[#BE123C]'
                      : 'text-stone-500'
                  }`}
                />
                <span
                  className={`text-[10px] font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-[#BE123C]'
                      : 'text-stone-500'
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            )
          })}
          {/* More tab – opens hamburger overlay */}
          <button
            onClick={() => setMobileOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 w-16 h-full"
          >
            <Menu
              className={`w-5 h-5 transition-colors duration-200 ${
                mobileOpen ? 'text-[#BE123C]' : 'text-stone-500'
              }`}
            />
            <span
              className={`text-[10px] font-medium transition-colors duration-200 ${
                mobileOpen ? 'text-[#BE123C]' : 'text-stone-500'
              }`}
            >
              More
            </span>
          </button>
        </div>
      </nav>
    </>
  )
}
