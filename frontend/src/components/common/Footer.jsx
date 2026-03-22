import { useTheme } from '../../context/ThemeContext'

const Footer = () => {
  const { band } = useTheme()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">{band.name}</h3>
            <p className="text-gray-400">{band.footer_tagline || 'Rock the world, one show at a time.'}</p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              {band.social_links?.facebook && (
                <a href={band.social_links.facebook} target="_blank" rel="noopener noreferrer" 
                   className="hover:text-gray-300">Facebook</a>
              )}
              {band.social_links?.instagram && (
                <a href={band.social_links.instagram} target="_blank" rel="noopener noreferrer"
                   className="hover:text-gray-300">Instagram</a>
              )}
              {band.social_links?.twitter && (
                <a href={band.social_links.twitter} target="_blank" rel="noopener noreferrer"
                   className="hover:text-gray-300">Twitter</a>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <p className="text-gray-400">{band.footer_cta || 'Get in touch through our contact page'}</p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} {band.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
