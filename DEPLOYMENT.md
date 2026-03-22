# Production Deployment Guide

## Option 1: Heroku Deployment

### Backend (Rails API)

1. **Create Heroku App**:
```bash
cd backend
heroku create your-band-api
heroku addons:create heroku-postgresql:mini
```

2. **Set Environment Variables**:
```bash
heroku config:set RAILS_MASTER_KEY=$(cat config/master.key)
heroku config:set SECRET_KEY_BASE=$(rails secret)
```

3. **Deploy**:
```bash
git init
git add .
git commit -m "Initial commit"
git push heroku main
heroku run rails db:migrate
heroku run rails db:seed
```

4. **Note Your API URL**: `https://your-band-api.herokuapp.com`

### Frontend (Vercel)

1. **Create Vercel Project**:
```bash
cd frontend
npm install -g vercel
vercel
```

2. **Set Environment Variable**:
In Vercel dashboard, add:
- `VITE_API_URL`: `https://your-band-api.herokuapp.com/api/v1`

3. **Deploy**:
```bash
vercel --prod
```

## Option 2: Railway Deployment

### Backend

1. **Install Railway CLI**:
```bash
npm install -g @railway/cli
```

2. **Create Project**:
```bash
cd backend
railway login
railway init
railway add postgresql
```

3. **Set Variables**:
```bash
railway variables set RAILS_MASTER_KEY=$(cat config/master.key)
railway variables set SECRET_KEY_BASE=$(rails secret)
```

4. **Deploy**:
```bash
railway up
railway run rails db:migrate
railway run rails db:seed
```

### Frontend (Netlify)

1. **Create `netlify.toml`**:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. **Deploy**:
```bash
cd frontend
npm install -g netlify-cli
netlify deploy --prod
```

3. **Set Environment Variables** in Netlify dashboard

## Option 3: VPS (DigitalOcean, AWS, etc.)

### Backend Setup

1. **Install Dependencies**:
```bash
# Ruby
sudo apt-get update
sudo apt-get install ruby-full build-essential

# PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Node (for Rails asset compilation)
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install nodejs
```

2. **Setup Application**:
```bash
cd /var/www
git clone your-repo backend
cd backend
bundle install --deployment --without development test
RAILS_ENV=production rails db:create db:migrate db:seed
RAILS_ENV=production rails assets:precompile
```

3. **Configure Nginx**:
```nginx
upstream backend {
  server unix:/var/www/backend/tmp/sockets/puma.sock;
}

server {
  listen 80;
  server_name api.yourband.com;

  root /var/www/backend/public;

  location / {
    proxy_pass http://backend;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

4. **Setup Systemd Service**:
```ini
# /etc/systemd/system/backend.service
[Unit]
Description=Band Website Backend
After=network.target

[Service]
Type=simple
User=deploy
WorkingDirectory=/var/www/backend
Environment=RAILS_ENV=production
ExecStart=/usr/local/bin/bundle exec puma -C config/puma.rb
Restart=always

[Install]
WantedBy=multi-user.target
```

### Frontend Setup

1. **Build Frontend**:
```bash
cd /var/www/frontend
npm install
npm run build
```

2. **Configure Nginx**:
```nginx
server {
  listen 80;
  server_name yourband.com;

  root /var/www/frontend/dist;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

## Environment Variables

### Backend (.env or config)
```bash
DATABASE_URL=postgresql://user:password@localhost/band_production
RAILS_MASTER_KEY=your_master_key
SECRET_KEY_BASE=your_secret_key
RAILS_ENV=production
FRONTEND_URL=https://yourband.com
```

### Frontend (.env.production)
```bash
VITE_API_URL=https://api.yourband.com/api/v1
```

## CORS Configuration

Update `backend/config/application.rb`:

```ruby
config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'yourband.com', 'www.yourband.com'
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true
  end
end
```

## SSL/HTTPS

### Using Let's Encrypt (Certbot)
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourband.com -d www.yourband.com
sudo certbot --nginx -d api.yourband.com
```

### Heroku/Railway
SSL is included automatically with custom domains.

## Database Backups

### Heroku
```bash
heroku pg:backups:capture
heroku pg:backups:download
```

### Manual PostgreSQL
```bash
pg_dump -U postgres band_production > backup.sql
# Restore: psql -U postgres band_production < backup.sql
```

## Monitoring & Logs

### Heroku
```bash
heroku logs --tail
heroku logs --source app
```

### VPS
```bash
# Application logs
tail -f /var/www/backend/log/production.log

# System logs
sudo journalctl -u backend -f
```

## Performance Optimization

### Backend
1. Enable caching: `rails dev:cache`
2. Add Redis for session store
3. Use CDN for static assets
4. Enable Gzip compression in Nginx

### Frontend
1. Already optimized with Vite production build
2. Use CDN for image assets
3. Enable browser caching
4. Add service worker for offline support

## Security Checklist

- [ ] Change default admin password
- [ ] Set secure SECRET_KEY_BASE
- [ ] Configure CORS for production domains only
- [ ] Enable SSL/HTTPS
- [ ] Use environment variables for secrets
- [ ] Enable database backups
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Configure rate limiting
- [ ] Enable database query caching
- [ ] Use prepared statements
- [ ] Sanitize user inputs
- [ ] Add CSP headers

## Maintenance

### Update Dependencies
```bash
# Backend
bundle update
rails db:migrate

# Frontend
npm update
npm audit fix
```

### Zero-Downtime Deployment
Use Heroku's preboot feature or implement blue-green deployment on VPS.

## Cost Estimates

### Budget Option (~$15/month)
- Railway Starter: $5/month (backend + database)
- Vercel Hobby: Free (frontend)
- Cloudinary Free Tier: Free (images)

### Professional Option (~$50/month)
- Heroku Standard: $25/month (backend)
- Heroku Postgres: $9/month
- Vercel Pro: $20/month
- AWS S3: ~$5/month

### Enterprise Option (~$200/month)
- Dedicated VPS: $80/month
- Managed PostgreSQL: $50/month
- CDN: $20/month
- Monitoring: $50/month

## Support

For deployment issues:
1. Check application logs first
2. Verify environment variables
3. Test API connectivity
4. Check database migrations
5. Verify CORS configuration

## Useful Commands

```bash
# Check app health
curl https://your-api.com/up

# Test database connection
rails dbconsole

# Check environment
rails runner 'puts Rails.env'

# Run migrations
rails db:migrate RAILS_ENV=production

# Seed data
rails db:seed RAILS_ENV=production

# Clear cache
rails cache:clear

# Restart server (Heroku)
heroku restart

# Restart server (systemd)
sudo systemctl restart backend
```

Happy deploying! 🚀
