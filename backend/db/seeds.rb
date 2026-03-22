# Create admin user
User.create!(
  email: 'admin@band.com',
  password: 'password123',
  password_confirmation: 'password123',
  role: 'admin'
)

# Create band
band = Band.create!(
  name: 'The Rock Legends',
  bio: 'We are a rock band from the underground scene, bringing raw energy and passion to every performance.',
  primary_color: '#E74C3C',
  secondary_color: '#2C3E50',
  social_links: {
    facebook: 'https://facebook.com/rocklegends',
    instagram: 'https://instagram.com/rocklegends',
    twitter: 'https://twitter.com/rocklegends',
    spotify: 'https://open.spotify.com/artist/rocklegends'
  }
)

# Create events
Event.create!([
  {
    title: 'Summer Rock Fest 2025',
    venue: 'The Underground',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    date: 1.month.from_now,
    doors_open: '19:00',
    show_starts: '20:00',
    ticket_url: 'https://tickets.com/summer-fest',
    description: 'Join us for an unforgettable night of rock music!',
    featured: true,
    published: true
  },
  {
    title: 'Album Release Party',
    venue: 'Rock Arena',
    address: '456 Rock Ave',
    city: 'Los Angeles',
    state: 'CA',
    date: 2.months.from_now,
    doors_open: '18:30',
    show_starts: '19:30',
    ticket_url: 'https://tickets.com/album-release',
    description: 'Celebrating the release of our new album "Electric Dreams"',
    featured: false,
    published: true
  }
])

# Note: PhotoGallery and Photo records require file uploads.
# Create galleries and photos manually through the admin interface,
# or attach files programmatically using Active Storage.

# Create videos
Video.create!([
  {
    title: 'New Single - "Thunder Road"',
    embed_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Official music video for our latest single',
    published: true,
    position: 1
  },
  {
    title: 'Live at Madison Square Garden',
    embed_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Full concert recording from our sold-out show',
    published: true,
    position: 2
  }
])

# Note: Merchandise records require file uploads.
# Create merchandise manually through the admin interface,
# or attach files programmatically using Active Storage.

puts "Seed data created successfully!"
puts "Admin login: admin@band.com / password123"
