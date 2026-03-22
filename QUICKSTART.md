# Quick Start Guide

## Prerequisites
- Ruby 3.2+ installed
- Node.js 18+ installed
- PostgreSQL installed and running

## Getting Started in 5 Minutes

### 1. Backend Setup (Terminal 1)

```bash
cd backend

# Install Ruby gems
bundle install

# Setup database
rails db:create
rails db:migrate
rails db:seed

# Start Rails server
rails server
```

The API will be available at `http://localhost:3000`

### 2. Frontend Setup (Terminal 2)

```bash
cd frontend

# Install Node packages
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### 3. Login to Admin Panel

Open `http://localhost:5173/admin/login`

**Default Credentials:**
- Email: `admin@band.com`
- Password: `password123`

## What's Included

### Sample Data
The seed file creates:
- 1 Admin user
- 1 Band profile with social links
- 2 Upcoming events
- 2 Photo galleries with sample images
- 2 Videos
- 3 Merchandise items

### Public Pages
- **Home** (`/`) - Hero section, next show, latest video
- **About** (`/about`) - Band bio
- **Events** (`/events`) - Upcoming shows
- **Galleries** (`/galleries`) - Photo galleries
- **Videos** (`/videos`) - Video library
- **Merch** (`/merch`) - Merchandise catalog
- **Contact** (`/contact`) - Contact form

### Admin Pages
- **Dashboard** (`/admin`) - Overview and stats
- **Settings** (`/admin/settings`) - Band info, branding, colors
- **Events** (`/admin/events`) - Manage events
- **Galleries** (`/admin/galleries`) - Manage galleries and photos
- **Videos** (`/admin/videos`) - Manage videos
- **Merch** (`/admin/merch`) - Manage merchandise
- **Messages** (`/admin/messages`) - View contact submissions

## Customization

### Update Band Information
1. Login to admin panel
2. Go to Settings
3. Update band name, bio, logo, colors
4. Add social media links

### Add Events
1. Go to Events Manager
2. Fill in event details
3. Add ticket URL
4. Check "Published" to make it live

### Upload Photos
1. Go to Galleries Manager
2. Create a new gallery
3. Add image URLs (use external image hosting)
4. Photos will appear in the public gallery

### Add Videos
1. Go to Videos Manager
2. Get YouTube/Vimeo embed URL
3. Add title and description
4. Video will appear on Videos page

## Troubleshooting

### Rails won't start
```bash
# Check if PostgreSQL is running
# On Mac: brew services start postgresql
# On Linux: sudo service postgresql start

# Make sure database exists
rails db:create
```

### Frontend can't connect to API
```bash
# Check .env file has correct API URL
echo "VITE_API_URL=http://localhost:3000/api/v1" > .env

# Restart frontend dev server
npm run dev
```

### CORS errors
The Rails API is configured to allow all origins in development. If you still see CORS errors, check `backend/config/application.rb`

## Next Steps

1. **Change Admin Password**: Create a new admin user and delete the default one
2. **Add Real Content**: Replace sample data with your band's information
3. **Image Hosting**: Set up Cloudinary or AWS S3 for images
4. **Email Setup**: Configure ActionMailer for contact form notifications
5. **Deploy**: Follow README.md for production deployment

## Need Help?

Check the main README.md for:
- Complete API documentation
- Deployment instructions
- Feature additions
- Advanced configuration

## Development Tips

### Watch Backend Logs
```bash
tail -f backend/log/development.log
```

### Check Database
```bash
rails console
# Then: Band.first, Event.all, etc.
```

### Reset Database
```bash
rails db:reset  # Drops, creates, migrates, seeds
```

### Hot Reload
Both backend and frontend have hot reload enabled. Changes will appear automatically.

Happy Rocking! 🎸
