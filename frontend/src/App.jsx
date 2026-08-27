import React, { useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import { AuthProvider } from './context/AuthContext'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import ServiceDetail from './pages/ServiceDetail'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

import About from './pages/About'
import Services from './pages/Services'
import Partner from './pages/Partner'
import Contact from './pages/Contact'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Cta from './components/Cta'


const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

const App = () => {
  // const lenisRef = useRef(null)

  // useEffect(() => {
  //   const lenis = new Lenis({
  //     duration: 1.2,
  //     easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
  //   })
  //   lenisRef.current = lenis

  //   function raf(time) {
  //     lenis.raf(time)
  //     requestAnimationFrame(raf)
  //   }

  //   requestAnimationFrame(raf)
    
  //   return () => {
  //     lenis.destroy()
  //   }
  // }, [])

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <Routes>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='*' element={
            <>
              <Navbar />
              <Routes>
                <Route path='/' element={<Landing />} />
                <Route path='/about' element={<About />} />
                <Route path='/services' element={<Services />} />
                <Route path='/services/:id' element={<ServiceDetail />} />
                <Route path='/partner' element={<Partner />} />
                <Route path='/contact' element={<Contact />} />
                <Route path='/terms' element={<Terms />} />
                <Route path='/privacy' element={<Privacy />} />
              </Routes>
              {/* <Cta /> */}
              <Footer />
            </>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App