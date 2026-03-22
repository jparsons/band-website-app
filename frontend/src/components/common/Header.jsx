import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const Header = () => {
  const { band } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <header className="bg-black text-white shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-4">
            {band.logo_url && (
              <img src={band.logo_url} alt={band.name} className="h-12 w-auto" />
            )}
            <span className="text-2xl font-bold">{band.name || 'Band Name'}</span>
          </Link>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded hover:bg-gray-800"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-gray-300 transition">Home</Link>
            <Link to="/about" className="hover:text-gray-300 transition">{band.nav_about || 'About'}</Link>
            <Link to="/events" className="hover:text-gray-300 transition">{band.nav_events || 'Events'}</Link>
            <Link to="/galleries" className="hover:text-gray-300 transition">{band.nav_galleries || 'Galleries'}</Link>
            <Link to="/videos" className="hover:text-gray-300 transition">{band.nav_videos || 'Videos'}</Link>
            <Link to="/merch" className="hover:text-gray-300 transition">{band.nav_merch || 'Merch'}</Link>
            <Link to="/contact" className="hover:text-gray-300 transition">{band.nav_contact || 'Contact'}</Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-800">
            <div className="flex flex-col space-y-2">
              <Link to="/" onClick={closeMobileMenu} className="px-3 py-2 hover:bg-gray-800 rounded">Home</Link>
              <Link to="/about" onClick={closeMobileMenu} className="px-3 py-2 hover:bg-gray-800 rounded">{band.nav_about || 'About'}</Link>
              <Link to="/events" onClick={closeMobileMenu} className="px-3 py-2 hover:bg-gray-800 rounded">{band.nav_events || 'Events'}</Link>
              <Link to="/galleries" onClick={closeMobileMenu} className="px-3 py-2 hover:bg-gray-800 rounded">{band.nav_galleries || 'Galleries'}</Link>
              <Link to="/videos" onClick={closeMobileMenu} className="px-3 py-2 hover:bg-gray-800 rounded">{band.nav_videos || 'Videos'}</Link>
              <Link to="/merch" onClick={closeMobileMenu} className="px-3 py-2 hover:bg-gray-800 rounded">{band.nav_merch || 'Merch'}</Link>
              <Link to="/contact" onClick={closeMobileMenu} className="px-3 py-2 hover:bg-gray-800 rounded">{band.nav_contact || 'Contact'}</Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header
