import { useQuery } from '@tanstack/react-query'
import { useTheme } from '../../context/ThemeContext'
import { bandMembersApi } from '../../services/api'

const About = () => {
  const { band } = useTheme()

  const { data: bandMembers } = useQuery({
    queryKey: ['band-members'],
    queryFn: async () => {
      const response = await bandMembersApi.getBandMembers()
      return response.data
    },
  })

  // Use about_content if available, otherwise fall back to bio
  const aboutText = band.about_content || band.bio || 'Welcome to our band! We are passionate about creating unforgettable rock music experiences.'

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold mb-8 text-center">{band.nav_about || 'About'} {band.name}</h1>

        <div className="max-w-4xl mx-auto">
          <div className="prose lg:prose-xl mx-auto">
            {aboutText.split('\n').map((paragraph, index) => (
              <p key={index} className="text-xl leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {band.logo_url && (
            <div className="mt-12 text-center">
              <img src={band.logo_url} alt={band.name} className="h-48 mx-auto" />
            </div>
          )}
        </div>

        {/* Band Members Section */}
        {bandMembers && bandMembers.length > 0 && (
          <div className="mt-16">
            <h2 className="text-4xl font-bold mb-12 text-center">
              {band.band_members_header || 'Band Members'}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {bandMembers.map((member) => (
                <div key={member.id} className="text-center">
                  {member.photo_url ? (
                    <img
                      src={member.photo_url}
                      alt={member.name}
                      className="w-48 h-48 object-cover rounded-lg mx-auto mb-4 shadow-lg"
                    />
                  ) : (
                    <div className="w-48 h-48 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center shadow-lg">
                      <span className="text-gray-400 text-4xl">{member.name.charAt(0)}</span>
                    </div>
                  )}
                  <h3 className="text-2xl font-bold">{member.name}</h3>
                  {member.role && (
                    <p className="text-gray-600 text-lg mt-1">{member.role}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default About
