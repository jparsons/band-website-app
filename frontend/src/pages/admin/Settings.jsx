import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { bandApi, adminBandApi } from '../../services/api'

const GOOGLE_FONTS = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Oswald',
  'Raleway',
  'Poppins',
  'Playfair Display',
  'Merriweather',
  'Source Sans Pro',
  'Ubuntu',
  'Nunito',
  'Rubik',
  'Work Sans',
  'Fira Sans',
  'Barlow',
  'Archivo',
  'Space Grotesk',
  'DM Sans',
  'Bebas Neue',
  'Anton',
  'Permanent Marker',
  'Rock Salt',
  'Bangers',
]

const Settings = () => {
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset } = useForm()
  const [logoFile, setLogoFile] = useState(null)
  const [backgroundFile, setBackgroundFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const [backgroundPreview, setBackgroundPreview] = useState(null)

  const { data: band } = useQuery({
    queryKey: ['band'],
    queryFn: async () => {
      const response = await bandApi.getBand()
      return response.data
    },
  })

  // Pre-populate form when band data is loaded
  useEffect(() => {
    if (band) {
      reset({
        name: band.name || '',
        bio: band.bio || '',
        hero_tagline: band.hero_tagline || '',
        about_content: band.about_content || '',
        cta_title: band.cta_title || '',
        cta_subtitle: band.cta_subtitle || '',
        footer_tagline: band.footer_tagline || '',
        footer_cta: band.footer_cta || '',
        band_members_header: band.band_members_header || 'Band Members',
        nav_events: band.nav_events || 'Events',
        nav_galleries: band.nav_galleries || 'Galleries',
        nav_videos: band.nav_videos || 'Videos',
        nav_merch: band.nav_merch || 'Merch',
        nav_contact: band.nav_contact || 'Contact',
        nav_about: band.nav_about || 'About',
        primary_color: band.primary_color || '#000000',
        secondary_color: band.secondary_color || '#ffffff',
        heading_font: band.heading_font || 'Inter',
        body_font: band.body_font || 'Inter',
        facebook: band.social_links?.facebook || '',
        instagram: band.social_links?.instagram || '',
        twitter: band.social_links?.twitter || '',
        spotify: band.social_links?.spotify || '',
        epk_enabled: band.epk_enabled ?? true,
        epk_headline: band.epk_headline || '',
        epk_short_bio: band.epk_short_bio || '',
        epk_one_sheet: band.epk_one_sheet || '',
      })
    }
  }, [band, reset])

  const mutation = useMutation({
    mutationFn: adminBandApi.updateBand,
    onSuccess: () => {
      queryClient.invalidateQueries(['band'])
      toast.success('Settings updated successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.errors?.join(', ') || 'Failed to update settings')
    },
  })

  const onSubmit = (data) => {
    const socialLinks = {
      facebook: data.facebook || '',
      instagram: data.instagram || '',
      twitter: data.twitter || '',
      spotify: data.spotify || '',
    }

    const submitData = {
      name: data.name || '',
      bio: data.bio || '',
      hero_tagline: data.hero_tagline || '',
      about_content: data.about_content || '',
      cta_title: data.cta_title || '',
      cta_subtitle: data.cta_subtitle || '',
      footer_tagline: data.footer_tagline || '',
      footer_cta: data.footer_cta || '',
      band_members_header: data.band_members_header || '',
      nav_events: data.nav_events || '',
      nav_galleries: data.nav_galleries || '',
      nav_videos: data.nav_videos || '',
      nav_merch: data.nav_merch || '',
      nav_contact: data.nav_contact || '',
      nav_about: data.nav_about || '',
      primary_color: data.primary_color || '#000000',
      secondary_color: data.secondary_color || '#ffffff',
      heading_font: data.heading_font || 'Inter',
      body_font: data.body_font || 'Inter',
      social_links: socialLinks,
      epk_enabled: data.epk_enabled,
      epk_headline: data.epk_headline || '',
      epk_short_bio: data.epk_short_bio || '',
      epk_one_sheet: data.epk_one_sheet || '',
    }

    if (logoFile) {
      submitData.logo = logoFile
    }
    if (backgroundFile) {
      submitData.background_image = backgroundFile
    }

    mutation.mutate(submitData)
  }

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setLogoFile(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  const handleBackgroundChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setBackgroundFile(file)
      setBackgroundPreview(URL.createObjectURL(file))
    }
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Band Settings</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-8 max-w-3xl">
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Band Name</label>
          <input
            type="text"
            {...register('name')}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Bio</label>
          <textarea
            rows="4"
            {...register('bio')}
            className="w-full px-4 py-2 border rounded-lg"
          ></textarea>
          <p className="text-sm text-gray-500 mt-1">Short description shown in the homepage hero</p>
        </div>

        <h3 className="text-xl font-bold mb-4">Site Content</h3>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Hero Tagline</label>
          <input
            type="text"
            {...register('hero_tagline')}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Rock your world"
          />
          <p className="text-sm text-gray-500 mt-1">Short tagline displayed below the bio on homepage</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">About Page Content</label>
          <textarea
            rows="6"
            {...register('about_content')}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Tell your story here..."
          ></textarea>
          <p className="text-sm text-gray-500 mt-1">Detailed content shown on the About page</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Band Members Section Header</label>
          <input
            type="text"
            {...register('band_members_header')}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Band Members"
          />
          <p className="text-sm text-gray-500 mt-1">Header text for the band members section on the About page</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Call-to-Action Title</label>
          <input
            type="text"
            {...register('cta_title')}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Stay Connected"
          />
          <p className="text-sm text-gray-500 mt-1">Title for the footer section on homepage</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Call-to-Action Subtitle</label>
          <input
            type="text"
            {...register('cta_subtitle')}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Follow us on social media for updates and exclusive content"
          />
          <p className="text-sm text-gray-500 mt-1">Subtitle text below the CTA title</p>
        </div>

        <h3 className="text-xl font-bold mb-4">Footer Content</h3>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Footer Tagline</label>
          <input
            type="text"
            {...register('footer_tagline')}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Rock the world, one show at a time."
          />
          <p className="text-sm text-gray-500 mt-1">Tagline shown in the footer under your band name</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Footer Contact Text</label>
          <input
            type="text"
            {...register('footer_cta')}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Get in touch through our contact page"
          />
          <p className="text-sm text-gray-500 mt-1">Text shown in the Contact section of the footer</p>
        </div>

        <h3 className="text-xl font-bold mb-4">Navigation Labels</h3>
        <p className="text-sm text-gray-500 mb-4">Customize the display names for navigation links and page titles</p>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Events</label>
            <input
              type="text"
              {...register('nav_events')}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Events"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Galleries</label>
            <input
              type="text"
              {...register('nav_galleries')}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Galleries"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Videos</label>
            <input
              type="text"
              {...register('nav_videos')}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Videos"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Merch</label>
            <input
              type="text"
              {...register('nav_merch')}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Merch"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Contact</label>
            <input
              type="text"
              {...register('nav_contact')}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Contact"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">About</label>
            <input
              type="text"
              {...register('nav_about')}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="About"
            />
          </div>
        </div>

        <h3 className="text-xl font-bold mb-4">Images</h3>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
          {(logoPreview || band?.logo_url) && (
            <div className="mt-2">
              <img
                src={logoPreview || band?.logo_url}
                alt="Logo preview"
                className="h-20 object-contain"
              />
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Background Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleBackgroundChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <p className="text-sm text-gray-500 mt-1">Used on homepage hero section</p>
          {(backgroundPreview || band?.background_image_url) && (
            <div className="mt-2">
              <img
                src={backgroundPreview || band?.background_image_url}
                alt="Background preview"
                className="h-32 object-cover rounded"
              />
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Primary Color</label>
            <input
              type="color"
              {...register('primary_color')}
              className="w-full h-12 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Secondary Color</label>
            <input
              type="color"
              {...register('secondary_color')}
              className="w-full h-12 border rounded-lg"
            />
          </div>
        </div>

        <h3 className="text-xl font-bold mb-4">Typography</h3>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Heading Font</label>
            <select
              {...register('heading_font')}
              className="w-full px-4 py-2 border rounded-lg"
            >
              {GOOGLE_FONTS.map((font) => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">Used for titles and headings</p>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Body Font</label>
            <select
              {...register('body_font')}
              className="w-full px-4 py-2 border rounded-lg"
            >
              {GOOGLE_FONTS.map((font) => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">Used for body text and paragraphs</p>
          </div>
        </div>

        <h3 className="text-xl font-bold mb-4">Social Media Links</h3>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Facebook</label>
          <input
            type="url"
            {...register('facebook')}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Instagram</label>
          <input
            type="url"
            {...register('instagram')}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Twitter</label>
          <input
            type="url"
            {...register('twitter')}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">Spotify</label>
          <input
            type="url"
            {...register('spotify')}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <h3 className="text-xl font-bold mb-4">Electronic Press Kit (EPK)</h3>

        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('epk_enabled')}
              className="mr-2"
            />
            <span className="font-semibold">Enable EPK Page</span>
          </label>
          <p className="text-sm text-gray-500 mt-1">Make your EPK available at /epk</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">EPK Headline</label>
          <input
            type="text"
            {...register('epk_headline')}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Explosive Rock Band from New York"
          />
          <p className="text-sm text-gray-500 mt-1">Short headline displayed on the EPK page</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">EPK Short Bio</label>
          <textarea
            rows="4"
            {...register('epk_short_bio')}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="A shorter version of your bio for the EPK..."
          ></textarea>
          <p className="text-sm text-gray-500 mt-1">If empty, the main bio will be used</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2">One-Sheet Tagline</label>
          <input
            type="text"
            {...register('epk_one_sheet')}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="FFO: Band A, Band B, Band C"
          />
          <p className="text-sm text-gray-500 mt-1">Short tagline (e.g., "For fans of..." or a memorable quote)</p>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {mutation.isPending ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}

export default Settings
