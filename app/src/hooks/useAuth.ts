import { useStore } from '../store'

export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  plan: 'free' | 'pro' | 'advanced'
  credits: number
  createdAt: string
}

export function useAuth() {
  const user = useStore((state) => state.user)
  const isAuthenticated = useStore((state) => state.isAuthenticated)
  const isCloudMode = useStore((state) => state.isCloudMode)
  const login = useStore((state) => state.login)
  const signup = useStore((state) => state.signup)
  const loginWithGoogle = useStore((state) => state.loginWithGoogle)
  const logout = useStore((state) => state.logout)
  const useCredit = useStore((state) => state.useCredit)
  const addCredits = useStore((state) => state.addCredits)
  const updatePlan = useStore((state) => state.updatePlan)
  const getCreditCost = useStore((state) => state.getCreditCost)
  const canUseFeature = useStore((state) => state.canUseFeature)

  return {
    user,
    isAuthenticated,
    isCloudMode,
    login,
    signup,
    loginWithGoogle,
    logout,
    useCredit,
    addCredits,
    updatePlan,
    getCreditCost,
    canUseFeature,
  }
}
