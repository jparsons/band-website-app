import { Routes, Route } from 'react-router-dom'
import PublicLayout from './components/layouts/PublicLayout'
import AdminLayout from './components/layouts/AdminLayout'
import ProtectedRoute from './components/common/ProtectedRoute'

// Public pages
import Home from './pages/public/Home'
import About from './pages/public/About'
import Events from './pages/public/Events'
import Galleries from './pages/public/Galleries'
import GalleryDetail from './pages/public/GalleryDetail'
import Videos from './pages/public/Videos'
import Merch from './pages/public/Merch'
import Contact from './pages/public/Contact'
import EPK from './pages/public/EPK'

// Admin pages
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import Settings from './pages/admin/Settings'
import EventsManager from './pages/admin/EventsManager'
import GalleriesManager from './pages/admin/GalleriesManager'
import VideosManager from './pages/admin/VideosManager'
import MerchManager from './pages/admin/MerchManager'
import Messages from './pages/admin/Messages'
import BandMembersManager from './pages/admin/BandMembersManager'
import UsersManager from './pages/admin/UsersManager'
import PressQuotesManager from './pages/admin/PressQuotesManager'
import ReleasesManager from './pages/admin/ReleasesManager'
import EpkContactsManager from './pages/admin/EpkContactsManager'
import TechnicalRiderManager from './pages/admin/TechnicalRiderManager'

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/galleries" element={<Galleries />} />
        <Route path="/galleries/:id" element={<GalleryDetail />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/merch" element={<Merch />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/epk" element={<EPK />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="settings" element={<Settings />} />
        <Route path="events" element={<EventsManager />} />
        <Route path="galleries" element={<GalleriesManager />} />
        <Route path="videos" element={<VideosManager />} />
        <Route path="merch" element={<MerchManager />} />
        <Route path="messages" element={<Messages />} />
        <Route path="band-members" element={<BandMembersManager />} />
        <Route path="users" element={<UsersManager />} />
        <Route path="press-quotes" element={<PressQuotesManager />} />
        <Route path="releases" element={<ReleasesManager />} />
        <Route path="epk-contacts" element={<EpkContactsManager />} />
        <Route path="technical-rider" element={<TechnicalRiderManager />} />
      </Route>
    </Routes>
  )
}

export default App
