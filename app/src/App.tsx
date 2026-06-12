import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import AuthGuard from './components/AuthGuard'
import ScrollToTop from './components/ScrollToTop'

const PersonaBuilder = lazy(() => import('./pages/PersonaBuilder'))
const Conversation = lazy(() => import('./pages/Conversation'))
const Review = lazy(() => import('./pages/Review'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Science = lazy(() => import('./pages/Science'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const Pricing = lazy(() => import('./pages/Pricing'))
const ProfileAnalyzer = lazy(() => import('./pages/ProfileAnalyzer'))
const Terms = lazy(() => import('./pages/Terms'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Cookies = lazy(() => import('./pages/Cookies'))
const About = lazy(() => import('./pages/About'))
const FAQ = lazy(() => import('./pages/FAQ'))
const Contact = lazy(() => import('./pages/Contact'))
const Careers = lazy(() => import('./pages/Careers'))

function PageLoader() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#E11D48] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <Layout>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<PersonaBuilder />} />
          <Route path="/chat" element={<Conversation />} />
          <Route path="/review/:id" element={<Review />} />
          <Route path="/science" element={<Science />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/profile-analyzer" element={<ProfileAnalyzer />} />
          <Route
            path="/dashboard"
            element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            }
          />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/careers" element={<Careers />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}
