import type { ReactNode } from 'react'
import { Toaster } from 'sonner'
import Navbar from './Navbar'
import Footer from './Footer'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Navbar />
      <main className="flex-1 pt-[72px] pb-16 md:pb-0 overflow-x-hidden">
        {children}
      </main>
      <Footer />
      <Toaster position="top-center" richColors closeButton />
    </div>
  )
}
