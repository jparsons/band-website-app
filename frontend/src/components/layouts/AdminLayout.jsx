import { useState, useEffect, useRef } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const AdminLayout = () => {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const [contentMenuOpen, setContentMenuOpen] = useState(false)
  const [epkMenuOpen, setEpkMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileContentOpen, setMobileContentOpen] = useState(false)
  const [mobileEpkOpen, setMobileEpkOpen] = useState(false)
  const contentMenuRef = useRef(null)
  const epkMenuRef = useRef(null)

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  const closeMenus = () => {
    setContentMenuOpen(false)
    setEpkMenuOpen(false)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
    setMobileContentOpen(false)
    setMobileEpkOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        contentMenuRef.current &&
        !contentMenuRef.current.contains(event.target) &&
        epkMenuRef.current &&
        !epkMenuRef.current.contains(event.target)
      ) {
        closeMenus()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-800 text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/admin" className="text-xl font-bold">Admin Panel</Link>

            {/* Mobile hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded hover:bg-gray-700"
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
            <div className="hidden lg:flex items-center space-x-6">
              <Link to="/admin/settings" className="hover:text-gray-300">Settings</Link>

              {/* Content Dropdown */}
              <div className="relative" ref={contentMenuRef}>
                <button
                  onClick={() => { setContentMenuOpen(!contentMenuOpen); setEpkMenuOpen(false) }}
                  className="hover:text-gray-300 flex items-center"
                >
                  Content
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {contentMenuOpen && (
                  <div className="absolute left-0 mt-2 w-40 bg-gray-700 rounded-lg shadow-lg z-50">
                    <Link to="/admin/events" onClick={closeMenus} className="block px-4 py-2 hover:bg-gray-600 rounded-t-lg">Events</Link>
                    <Link to="/admin/galleries" onClick={closeMenus} className="block px-4 py-2 hover:bg-gray-600">Galleries</Link>
                    <Link to="/admin/videos" onClick={closeMenus} className="block px-4 py-2 hover:bg-gray-600">Videos</Link>
                    <Link to="/admin/merch" onClick={closeMenus} className="block px-4 py-2 hover:bg-gray-600">Merch</Link>
                    <Link to="/admin/band-members" onClick={closeMenus} className="block px-4 py-2 hover:bg-gray-600 rounded-b-lg">Band Members</Link>
                  </div>
                )}
              </div>

              <Link to="/admin/messages" className="hover:text-gray-300">Messages</Link>

              {/* EPK Dropdown */}
              <div className="relative" ref={epkMenuRef}>
                <button
                  onClick={() => { setEpkMenuOpen(!epkMenuOpen); setContentMenuOpen(false) }}
                  className="hover:text-gray-300 flex items-center"
                >
                  EPK
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {epkMenuOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-lg z-50">
                    <Link to="/admin/press-quotes" onClick={closeMenus} className="block px-4 py-2 hover:bg-gray-600 rounded-t-lg">Press Quotes</Link>
                    <Link to="/admin/releases" onClick={closeMenus} className="block px-4 py-2 hover:bg-gray-600">Releases</Link>
                    <Link to="/admin/epk-contacts" onClick={closeMenus} className="block px-4 py-2 hover:bg-gray-600">Contacts</Link>
                    <Link to="/admin/technical-rider" onClick={closeMenus} className="block px-4 py-2 hover:bg-gray-600 rounded-b-lg">Technical Rider</Link>
                  </div>
                )}
              </div>

              <Link to="/admin/users" className="hover:text-gray-300">Users</Link>

              <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-600">
                <span className="text-sm">{user?.email}</span>
                <button onClick={handleLogout} className="hover:text-gray-300">Logout</button>
                <Link to="/" className="hover:text-gray-300">View Site</Link>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pt-4 border-t border-gray-700">
              <div className="flex flex-col space-y-2">
                <Link to="/admin/settings" onClick={closeMobileMenu} className="px-3 py-2 hover:bg-gray-700 rounded">Settings</Link>

                {/* Mobile Content Submenu */}
                <div>
                  <button
                    onClick={() => setMobileContentOpen(!mobileContentOpen)}
                    className="w-full px-3 py-2 hover:bg-gray-700 rounded flex items-center justify-between"
                  >
                    Content
                    <svg className={`w-4 h-4 transition-transform ${mobileContentOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {mobileContentOpen && (
                    <div className="ml-4 mt-1 flex flex-col space-y-1">
                      <Link to="/admin/events" onClick={closeMobileMenu} className="px-3 py-2 hover:bg-gray-700 rounded text-gray-300">Events</Link>
                      <Link to="/admin/galleries" onClick={closeMobileMenu} className="px-3 py-2 hover:bg-gray-700 rounded text-gray-300">Galleries</Link>
                      <Link to="/admin/videos" onClick={closeMobileMenu} className="px-3 py-2 hover:bg-gray-700 rounded text-gray-300">Videos</Link>
                      <Link to="/admin/merch" onClick={closeMobileMenu} className="px-3 py-2 hover:bg-gray-700 rounded text-gray-300">Merch</Link>
                      <Link to="/admin/band-members" onClick={closeMobileMenu} className="px-3 py-2 hover:bg-gray-700 rounded text-gray-300">Band Members</Link>
                    </div>
                  )}
                </div>

                <Link to="/admin/messages" onClick={closeMobileMenu} className="px-3 py-2 hover:bg-gray-700 rounded">Messages</Link>

                {/* Mobile EPK Submenu */}
                <div>
                  <button
                    onClick={() => setMobileEpkOpen(!mobileEpkOpen)}
                    className="w-full px-3 py-2 hover:bg-gray-700 rounded flex items-center justify-between"
                  >
                    EPK
                    <svg className={`w-4 h-4 transition-transform ${mobileEpkOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {mobileEpkOpen && (
                    <div className="ml-4 mt-1 flex flex-col space-y-1">
                      <Link to="/admin/press-quotes" onClick={closeMobileMenu} className="px-3 py-2 hover:bg-gray-700 rounded text-gray-300">Press Quotes</Link>
                      <Link to="/admin/releases" onClick={closeMobileMenu} className="px-3 py-2 hover:bg-gray-700 rounded text-gray-300">Releases</Link>
                      <Link to="/admin/epk-contacts" onClick={closeMobileMenu} className="px-3 py-2 hover:bg-gray-700 rounded text-gray-300">Contacts</Link>
                      <Link to="/admin/technical-rider" onClick={closeMobileMenu} className="px-3 py-2 hover:bg-gray-700 rounded text-gray-300">Technical Rider</Link>
                    </div>
                  )}
                </div>

                <Link to="/admin/users" onClick={closeMobileMenu} className="px-3 py-2 hover:bg-gray-700 rounded">Users</Link>

                <div className="pt-4 mt-2 border-t border-gray-700 flex flex-col space-y-2">
                  <span className="px-3 py-1 text-sm text-gray-400">{user?.email}</span>
                  <button onClick={() => { closeMobileMenu(); handleLogout() }} className="px-3 py-2 hover:bg-gray-700 rounded text-left">Logout</button>
                  <Link to="/" onClick={closeMobileMenu} className="px-3 py-2 hover:bg-gray-700 rounded">View Site</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
