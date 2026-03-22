import { useQuery } from '@tanstack/react-query'
import { epkApi } from '../../services/api'

const EPK = () => {
  const { data: epk, isLoading, error } = useQuery({
    queryKey: ['epk'],
    queryFn: async () => {
      const response = await epkApi.getEpk()
      return response.data
    },
  })

  const handleDownloadPdf = async () => {
    try {
      const response = await epkApi.downloadPdf()
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${epk?.band?.name || 'band'}-epk.pdf`)
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to download PDF:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading EPK...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">EPK is not available</div>
      </div>
    )
  }

  const { band, press_quotes, releases, contacts, technical_rider, band_members, upcoming_events, videos } = epk

  // Group contacts by type
  const contactsByType = contacts.reduce((acc, contact) => {
    if (!acc[contact.contact_type]) {
      acc[contact.contact_type] = []
    }
    acc[contact.contact_type].push(contact)
    return acc
  }, {})

  return (
    <div className="py-16 print:py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 print:mb-8">
          {band.logo_url && (
            <img src={band.logo_url} alt={band.name} className="h-24 mx-auto mb-6" />
          )}
          <h1 className="text-5xl font-bold mb-4">{band.name}</h1>
          {band.epk_headline && (
            <p className="text-2xl text-gray-600 mb-2">{band.epk_headline}</p>
          )}
          {band.epk_one_sheet && (
            <p className="text-lg italic text-gray-500">{band.epk_one_sheet}</p>
          )}
          <button
            onClick={handleDownloadPdf}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition print:hidden"
          >
            Download Press Kit (PDF)
          </button>
        </div>

        {/* Bio */}
        <section className="mb-16 print:mb-8">
          <h2 className="text-3xl font-bold mb-6 pb-2 border-b-2 border-gray-200">Biography</h2>
          <div className="prose lg:prose-xl max-w-none">
            {(band.epk_short_bio || band.bio || '').split('\n').map((paragraph, index) => (
              <p key={index} className="text-lg leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* Band Members */}
        {band_members && band_members.length > 0 && (
          <section className="mb-16 print:mb-8">
            <h2 className="text-3xl font-bold mb-6 pb-2 border-b-2 border-gray-200">Band Members</h2>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {band_members.map((member) => (
                <div key={member.id} className="text-center">
                  {member.photo_url ? (
                    <img
                      src={member.photo_url}
                      alt={member.name}
                      className="w-32 h-32 object-cover rounded-full mx-auto mb-3"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <span className="text-gray-400 text-3xl">{member.name.charAt(0)}</span>
                    </div>
                  )}
                  <h3 className="font-bold text-lg">{member.name}</h3>
                  {member.role && <p className="text-gray-600">{member.role}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Press Quotes */}
        {press_quotes && press_quotes.length > 0 && (
          <section className="mb-16 print:mb-8">
            <h2 className="text-3xl font-bold mb-6 pb-2 border-b-2 border-gray-200">Press</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {press_quotes.map((quote) => (
                <blockquote key={quote.id} className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500">
                  <p className="text-lg italic mb-4">"{quote.quote}"</p>
                  <footer className="text-gray-600">
                    &mdash; {quote.author && `${quote.author}, `}
                    {quote.url ? (
                      <a href={quote.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline print:text-gray-600">
                        {quote.source}
                      </a>
                    ) : (
                      <span>{quote.source}</span>
                    )}
                  </footer>
                </blockquote>
              ))}
            </div>
          </section>
        )}

        {/* Discography */}
        {releases && releases.length > 0 && (
          <section className="mb-16 print:mb-8">
            <h2 className="text-3xl font-bold mb-6 pb-2 border-b-2 border-gray-200">Discography</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {releases.map((release) => (
                <div key={release.id} className="text-center">
                  {release.cover_art_url ? (
                    <img
                      src={release.cover_art_url}
                      alt={release.title}
                      className="w-full aspect-square object-cover rounded-lg mb-4 shadow-lg"
                    />
                  ) : (
                    <div className="w-full aspect-square bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-gray-400 text-4xl">🎵</span>
                    </div>
                  )}
                  <h3 className="font-bold text-xl mb-1">{release.title}</h3>
                  <p className="text-gray-600 mb-2">
                    {release.release_type.charAt(0).toUpperCase() + release.release_type.slice(1)}
                    {release.release_date && ` • ${new Date(release.release_date).getFullYear()}`}
                  </p>
                  {release.label && <p className="text-gray-500 text-sm mb-3">{release.label}</p>}

                  <div className="flex flex-wrap justify-center gap-2 print:hidden">
                    {release.spotify_url && (
                      <a href={release.spotify_url} target="_blank" rel="noopener noreferrer"
                         className="px-3 py-1 bg-green-500 text-white text-sm rounded-full hover:bg-green-600">
                        Spotify
                      </a>
                    )}
                    {release.apple_music_url && (
                      <a href={release.apple_music_url} target="_blank" rel="noopener noreferrer"
                         className="px-3 py-1 bg-pink-500 text-white text-sm rounded-full hover:bg-pink-600">
                        Apple Music
                      </a>
                    )}
                    {release.bandcamp_url && (
                      <a href={release.bandcamp_url} target="_blank" rel="noopener noreferrer"
                         className="px-3 py-1 bg-blue-400 text-white text-sm rounded-full hover:bg-blue-500">
                        Bandcamp
                      </a>
                    )}
                    {release.other_streaming_url && (
                      <a href={release.other_streaming_url} target="_blank" rel="noopener noreferrer"
                         className="px-3 py-1 bg-gray-600 text-white text-sm rounded-full hover:bg-gray-700">
                        Listen
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact Information */}
        {contacts && contacts.length > 0 && (
          <section className="mb-16 print:mb-8">
            <h2 className="text-3xl font-bold mb-6 pb-2 border-b-2 border-gray-200">Contact</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(contactsByType).map(([type, typeContacts]) => (
                <div key={type}>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-blue-600 mb-3">
                    {type}
                  </h3>
                  {typeContacts.map((contact) => (
                    <div key={contact.id} className="bg-gray-50 p-4 rounded-lg mb-3">
                      <p className="font-bold">{contact.name}</p>
                      {contact.company && <p className="text-gray-600 text-sm">{contact.company}</p>}
                      {contact.email && (
                        <p className="text-sm">
                          <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                            {contact.email}
                          </a>
                        </p>
                      )}
                      {contact.phone && <p className="text-sm">{contact.phone}</p>}
                      {contact.territory && (
                        <p className="text-sm text-gray-500">Territory: {contact.territory}</p>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Technical Rider */}
        {technical_rider && technical_rider.length > 0 && (
          <section className="mb-16 print:mb-8">
            <h2 className="text-3xl font-bold mb-6 pb-2 border-b-2 border-gray-200">Technical Rider</h2>
            <div className="space-y-6">
              {technical_rider.map((section) => (
                <div key={section.id} className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-bold text-xl mb-3">{section.title}</h3>
                  {section.content && (
                    <div className="whitespace-pre-wrap text-gray-700">{section.content}</div>
                  )}
                  {section.attachment_url && (
                    <a
                      href={section.attachment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 print:hidden"
                    >
                      Download: {section.attachment_filename}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Shows */}
        {upcoming_events && upcoming_events.length > 0 && (
          <section className="mb-16 print:mb-8">
            <h2 className="text-3xl font-bold mb-6 pb-2 border-b-2 border-gray-200">Upcoming Shows</h2>
            <div className="space-y-4">
              {upcoming_events.map((event) => (
                <div key={event.id} className="flex items-center border-b border-gray-200 pb-4">
                  <div className="w-24 text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex-1 ml-6">
                    <h3 className="font-bold text-lg">{event.title}</h3>
                    <p className="text-gray-600">
                      {event.venue}
                      {event.city && `, ${event.city}`}
                      {event.state && `, ${event.state}`}
                    </p>
                  </div>
                  {event.ticket_url && (
                    <a
                      href={event.ticket_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 print:hidden"
                    >
                      Tickets
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Videos */}
        {videos && videos.length > 0 && (
          <section className="mb-16 print:hidden">
            <h2 className="text-3xl font-bold mb-6 pb-2 border-b-2 border-gray-200">Videos</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {videos.map((video) => (
                <div key={video.id} className="aspect-video">
                  {video.embed_url && (
                    <iframe
                      src={video.embed_url.includes('watch?v=') ? video.embed_url.replace('watch?v=', 'embed/') : video.embed_url}
                      title={video.title}
                      className="w-full h-full rounded-lg"
                      allowFullScreen
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Social Links */}
        {band.social_links && Object.values(band.social_links).some(v => v) && (
          <section className="text-center border-t-2 border-gray-200 pt-8">
            <h2 className="text-xl font-bold mb-4">Follow Us</h2>
            <div className="flex justify-center gap-6">
              {band.social_links.spotify && (
                <a href={band.social_links.spotify} target="_blank" rel="noopener noreferrer"
                   className="text-green-500 hover:text-green-600 text-lg print:text-gray-600">
                  Spotify
                </a>
              )}
              {band.social_links.instagram && (
                <a href={band.social_links.instagram} target="_blank" rel="noopener noreferrer"
                   className="text-pink-500 hover:text-pink-600 text-lg print:text-gray-600">
                  Instagram
                </a>
              )}
              {band.social_links.facebook && (
                <a href={band.social_links.facebook} target="_blank" rel="noopener noreferrer"
                   className="text-blue-600 hover:text-blue-700 text-lg print:text-gray-600">
                  Facebook
                </a>
              )}
              {band.social_links.twitter && (
                <a href={band.social_links.twitter} target="_blank" rel="noopener noreferrer"
                   className="text-blue-400 hover:text-blue-500 text-lg print:text-gray-600">
                  Twitter
                </a>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default EPK
