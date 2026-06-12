import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Coins } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { cn } from '../lib/utils'

export default function CreditBadge() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  if (!isAuthenticated || !user) return null

  const credits = user.credits
  const isUnlimited = credits === -1

  const colorClass =
    isUnlimited || credits > 10
      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      : credits >= 3
        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
        : 'bg-red-500/20 text-red-400 border-red-500/30'

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => navigate('/pricing')}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-body-sm font-medium transition-all duration-200 hover:scale-105 cursor-pointer',
        colorClass
      )}
    >
      <Coins className="w-3.5 h-3.5" />
      <span>
        {isUnlimited ? 'Unlimited' : `${credits} credit${credits !== 1 ? 's' : ''}`}
      </span>
    </motion.button>
  )
}
