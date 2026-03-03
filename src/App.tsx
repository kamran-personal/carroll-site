import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, LayoutGroup } from 'framer-motion'
import { useIsMobile } from './hooks/useIsMobile'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ScrollToTop from './components/layout/ScrollToTop'
import PageTransition from './components/layout/PageTransition'
import HomePage from './pages/HomePage'
import PortfolioPage from './pages/PortfolioPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import MobileHomePage from './pages/mobile/MobileHomePage'
import MobilePortfolioPage from './pages/mobile/MobilePortfolioPage'
import MobileAboutPage from './pages/mobile/MobileAboutPage'
import MobileContactPage from './pages/mobile/MobileContactPage'
import MobileProjectDetailPage from './pages/mobile/MobileProjectDetailPage'

function App() {
  const location = useLocation()
  const isMobile = useIsMobile()
  const isPortfolio = location.pathname.startsWith('/portfolio')

  return (
    <div className="min-h-screen bg-bg text-text font-sans">
      <ScrollToTop />
      <Navbar />
      <LayoutGroup>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={
              isMobile
                ? <MobileHomePage />
                : <PageTransition><HomePage /></PageTransition>
            } />
            <Route path="/portfolio" element={
              isMobile ? <MobilePortfolioPage /> : <PortfolioPage />
            } />
            <Route path="/portfolio/:id" element={
              isMobile ? <MobileProjectDetailPage /> : <ProjectDetailPage />
            } />
            <Route path="/about" element={
              isMobile
                ? <MobileAboutPage />
                : <PageTransition><AboutPage /></PageTransition>
            } />
            <Route path="/contact" element={
              isMobile
                ? <MobileContactPage />
                : <PageTransition><ContactPage /></PageTransition>
            } />
          </Routes>
        </AnimatePresence>
      </LayoutGroup>
      {!isPortfolio && <Footer />}
    </div>
  )
}

export default App
