import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'

const footerLinks = {
  Product: [
    { label: 'Features', path: '/create' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'FAQ', path: '/faq' },
  ],
  Resources: [
    { label: 'Science Blog', path: '/science' },
    { label: 'Guides', path: '/science' },
    { label: 'Community', path: '/dashboard' },
  ],
  Company: [
    { label: 'About', path: '/about' },
    { label: 'Careers', path: '/careers' },
    { label: 'Contact', path: '/contact' },
  ],
  Legal: [
    { label: 'Terms', path: '/terms' },
    { label: 'Privacy', path: '/privacy' },
    { label: 'Cookies', path: '/cookies' },
  ],
}

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
)
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
)
const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
)
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.83a8.18 8.18 0 004.76 1.52V6.83a4.85 4.85 0 01-1-.14z"/></svg>
)

const socialLinks = [
  { name: 'X', href: 'https://x.com/DatingCoach', icon: <XIcon /> },
  { name: 'Instagram', href: 'https://instagram.com/DatingCoach', icon: <InstagramIcon /> },
  { name: 'YouTube', href: 'https://youtube.com/@DatingCoach', icon: <YouTubeIcon /> },
  { name: 'TikTok', href: 'https://tiktok.com/@DatingCoach', icon: <TikTokIcon /> },
]

export default function Footer() {
  return (
    <footer className="w-full" style={{ background: '#0A0A0F', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
      <div className="max-w-[1200px] mx-auto px-6 pt-20 pb-10">
        {/* Top */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-14">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8"><defs><linearGradient id="fg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#E11D48" /><stop offset="100%" stopColor="#8B5CF6" /></linearGradient></defs><path d="M8 8C8 8 12 4 16 8C20 12 24 8 24 8V16C24 20 20 24 16 24C12 24 8 20 8 16V8Z" stroke="url(#fg)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <div>
              <div className="text-heading-sm text-[#F5F5F7]">DatingCoach</div>
              <div className="text-body-sm" style={{ color: '#52525B' }}>Master the art of connection</div>
            </div>
          </div>
          <a href="mailto:support@datingcoach.site" className="flex items-center gap-2 glass-card px-4 py-2.5 rounded-xl text-body-sm hover:text-[#F5F5F7] transition-colors" style={{ color: '#A1A1AA' }}>
            <Mail className="w-4 h-4" />support@datingcoach.site
          </a>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-14">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-caption uppercase tracking-wider mb-4" style={{ color: '#52525B' }}>{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.path} className="text-body-sm transition-colors duration-200 hover:text-rose-400" style={{ color: '#52525B' }}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <p className="text-caption" style={{ color: '#52525B' }}>&copy; {new Date().getFullYear()} DatingCoach. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {socialLinks.map((s) => (
              <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className="transition-colors duration-200 hover:text-rose-400" style={{ color: '#52525B' }} aria-label={s.name}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
