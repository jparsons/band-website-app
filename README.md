# Rock Band Website - Full Stack Application

A complete Ruby on Rails API backend with React frontend for rock bands to manage their online presence.

## Features

### Public Site
- **Home Page**: Hero section with band branding, next show, and latest video
- **About Page**: Band biography and information
- **Events Page**: List of upcoming shows with ticket links
- **Photo Galleries**: Multiple galleries with lightbox viewer
- **Videos Page**: Embedded videos from YouTube/Vimeo
- **Merchandise**: Product catalog with pricing and availability
- **Contact Form**: Message submission for fans

### Admin Panel
- **Dashboard**: Overview of events, messages, and quick actions
- **Settings**: Update band info, logo, colors, and social links
- **Events Manager**: Create, edit, delete events
- **Galleries Manager**: Manage photo galleries and upload images
- **Videos Manager**: Add and organize embedded videos
- **Merch Manager**: Manage merchandise inventory
- **Messages**: View and manage contact form submissions

## Tech Stack

### Backend
- Ruby on Rails 7.1 (API mode)
- PostgreSQL database
- JWT authentication
- Active Model Serializers
- CORS enabled

### Frontend
- React 18
- Vite build tool
- React Router for navigation
- TanStack Query (React Query) for data fetching
- Tailwind CSS for styling
- React Hook Form for form handling
- React Image Lightbox for galleries
- React Toastify for notifications

## Project Structure

```
band-website-app/
├── backend/          # Rails API
│   ├── app/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── serializers/
│   ├── config/
│   ├── db/
│   └── Gemfile
└── frontend/         # React App
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── services/
    │   └── main.jsx
    └── package.json
```

## Setup Instructions

### Backend Setup

1. **Install Dependencies**:
```bash
cd backend
bundle install
```

2. **Database Setup**:
```bash
# Create database
rails db:create

# Run migrations
rails db:migrate

# Seed initial data (creates admin user and sample content)
rails db:seed
```

3. **Start Rails Server**:
```bash
rails server
# Server runs on http://localhost:3000
```

### Frontend Setup

1. **Install Dependencies**:
```bash
cd frontend
npm install
```

2. **Environment Configuration**:
Create a `.env` file in the frontend directory:
```
VITE_API_URL=http://localhost:3000/api/v1
```

3. **Start Development Server**:
```bash
npm run dev
# Server runs on http://localhost:5173
```

## Default Admin Credentials

After running `rails db:seed`:
- **Email**: admin@band.com
- **Password**: password123

**IMPORTANT**: Change these credentials immediately in production!

## API Endpoints

### Public Endpoints
```
GET    /api/v1/band              # Get band information
GET    /api/v1/events            # List events
GET    /api/v1/galleries         # List galleries
GET    /api/v1/galleries/:id     # Get gallery with photos
GET    /api/v1/videos            # List videos
GET    /api/v1/merchandise       # List merchandise
POST   /api/v1/contact           # Send contact message
```

### Admin Endpoints (Require Authentication)
```
POST   /api/v1/auth/login        # Login
POST   /api/v1/auth/logout       # Logout
GET    /api/v1/auth/verify       # Verify token

PATCH  /api/v1/admin/band        # Update band settings

# Events CRUD
GET    /api/v1/admin/events
POST   /api/v1/admin/events
PATCH  /api/v1/admin/events/:id
DELETE /api/v1/admin/events/:id

# Galleries CRUD
GET    /api/v1/admin/galleries
POST   /api/v1/admin/galleries
PATCH  /api/v1/admin/galleries/:id
DELETE /api/v1/admin/galleries/:id

# Photos
POST   /api/v1/admin/galleries/:gallery_id/photos
PATCH  /api/v1/admin/photos/:id
DELETE /api/v1/admin/photos/:id

# Videos CRUD
GET    /api/v1/admin/videos
POST   /api/v1/admin/videos
PATCH  /api/v1/admin/videos/:id
DELETE /api/v1/admin/videos/:id

# Merchandise CRUD
GET    /api/v1/admin/merchandise
POST   /api/v1/admin/merchandise
PATCH  /api/v1/admin/merchandise/:id
DELETE /api/v1/admin/merchandise/:id

# Messages
GET    /api/v1/admin/messages
PATCH  /api/v1/admin/messages/:id
DELETE /api/v1/admin/messages/:id
```

## Customization

### Branding
Update band information, colors, and images through the admin settings page:
- Band name and bio
- Logo and background images
- Primary and secondary colors
- Social media links

### Styling
- The app uses Tailwind CSS for styling
- Brand colors are set via CSS custom properties
- Modify `frontend/src/index.css` for global styles
- Edit `frontend/tailwind.config.js` for Tailwind configuration

## Production Deployment

### Backend Deployment (Heroku/Railway/Render)

1. **Environment Variables**:
```
DATABASE_URL=<your-postgresql-url>
RAILS_MASTER_KEY=<your-master-key>
SECRET_KEY_BASE=<generate-with-rails-secret>
```

2. **Database Migration**:
```bash
rails db:migrate
rails db:seed
```

### Frontend Deployment (Vercel/Netlify)

1. **Environment Variables**:
```
VITE_API_URL=<your-backend-api-url>
```

2. **Build Command**:
```bash
npm run build
```

3. **Output Directory**: `dist`

### CORS Configuration
Update `backend/config/application.rb` to only allow your frontend domain in production.

## File Upload Configuration

The current implementation uses URL strings for images. For production:

1. **Add Active Storage**:
```bash
rails active_storage:install
rails db:migrate
```

2. **Configure S3 or CloudFlare**:
Update `config/storage.yml` and `config/environments/production.rb`

3. **Update Models**:
Add `has_one_attached :image` to relevant models

## Features to Add

Optional enhancements:
- Email notifications for contact form
- Newsletter signup
- Online store integration (Stripe/PayPal)
- Blog/news section
- Social media feed integration
- Advanced analytics dashboard
- Multi-band support (SaaS)
- Mobile app version

## Testing

### Backend Tests
```bash
cd backend
bundle exec rspec  # If you add RSpec
```

### Frontend Tests
```bash
cd frontend
npm test  # If you add testing libraries
```

## Troubleshooting

### CORS Issues
- Check `backend/config/application.rb` CORS settings
- Ensure frontend URL is in allowed origins

### Authentication Issues
- Verify JWT secret is consistent
- Check token is being sent in Authorization header
- Verify token hasn't expired (24h default)

### Database Connection
- Ensure PostgreSQL is running
- Check `backend/config/database.yml` settings
- Verify DATABASE_URL in production

## License

This project is provided as-is for educational and commercial use.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review API endpoint documentation
3. Check browser console for frontend errors
4. Check Rails logs for backend errors

---

**Happy Rocking! 🎸**
