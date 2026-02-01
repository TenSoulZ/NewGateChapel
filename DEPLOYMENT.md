# Deployment Guide - New Gate Chapel

## Production Deployment

### Prerequisites

- **Frontend**: Node.js 18+ and npm
- **Backend**: Python 3.11+, PostgreSQL 15+, Redis (recommended)
- **Server**: Ubuntu 20.04+ or similar Linux distribution
- **Domain**: Configured DNS pointing to your server

---

## Backend Deployment

### 1. Environment Setup

Create a production `.env` file in the `backend` directory:

```env
SECRET_KEY=your-very-long-secret-key-here
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# PostgreSQL Database
DB_ENGINE=django.db.backends.postgresql
DB_NAME=newgate_production
DB_USER=newgate_user
DB_PASSWORD=your-secure-password
DB_HOST=localhost
DB_PORT=5432

# Redis Cache (recommended for production)
REDIS_URL=redis://127.0.0.1:6379/1

# Media/Static files (if using cloud storage)
# AWS_ACCESS_KEY_ID=your-key
# AWS_SECRET_ACCESS_KEY=your-secret
# AWS_STORAGE_BUCKET_NAME=your-bucket
```

### 2. PostgreSQL Setup

```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
CREATE DATABASE newgate_production;
CREATE USER newgate_user WITH PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE newgate_production TO newgate_user;
ALTER USER newgate_user CREATEDB;
\q
```

### 3. Redis Installation (Optional but Recommended)

```bash
sudo apt install redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server
```

### 4. Backend Application Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn psycopg2-binary redis

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic --noinput

# Test the setup
python manage.py check --deploy
```

### 5. Gunicorn Configuration

Create`/etc/systemd/system/newgate-backend.service`:

```ini
[Unit]
Description=New Gate Chapel Backend
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/newgate-chapel/backend
Environment="PATH=/var/www/newgate-chapel/backend/venv/bin"
ExecStart=/var/www/newgate-chapel/backend/venv/bin/gunicorn \
          --workers 3 \
          --bind unix:/var/www/newgate-chapel/backend/backend.sock \
          --timeout 30 \
          --access-logfile /var/log/newgate/gunicorn-access.log \
          --error-logfile /var/log/newgate/gunicorn-error.log \
          config.wsgi:application

[Install]
WantedBy=multi-user.target
```

Start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl start newgate-backend
sudo systemctl enable newgate-backend
sudo systemctl status newgate-backend
```

---

## Frontend Deployment

### 1. Build the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create production .env
echo "VITE_API_BASE_URL=https://api.yourdomain.com/api" > .env.production

# Build for production
npm run build

# This creates an optimized bundle in the `dist` directory
```

### 2. Deploy to Netlify (Recommended for Frontend)

#### Option A: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
cd dist
netlify deploy --prod
```

#### Option B: GitHub Integration

1. Push your code to GitHub
2. Go to [Netlify](https://app.netlify.com)
3. Click "New site from Git"
4. Connect your repository
5. Configure build settings:
   - **Build command**: `cd frontend && npm run build`
   - **Publish directory**: `frontend/dist`
   - **Environment variables**: Add `VITE_API_BASE_URL`

### 3. Deploy to Traditional Server (Alternative)

Use Nginx to serve the built frontend:

```nginx
# /etc/nginx/sites-available/newgate-frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    root /var/www/newgate-chapel/frontend/dist;
    index index.html;
    
    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## Nginx Configuration for Backend API

```nginx
# /etc/nginx/sites-available/newgate-backend
server {
    listen 80;
    server_name api.yourdomain.com;
    
    client_max_body_size 20M;
    
    # Static files
    location /static/ {
        alias /var/www/newgate-chapel/backend/staticfiles/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Media files
    location /media/ {
        alias /var/www/newgate-chapel/backend/media/;
        expires 1y;
        add_header Cache-Control "public";
    }
    
    # API requests
    location / {
        proxy_pass http://unix:/var/www/newgate-chapel/backend/backend.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }
}
```

Enable sites and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/newgate-backend /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/newgate-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## SSL/TLS with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificates
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal is enabled by default, test it:
sudo certbot renew --dry-run
```

---

## Docker Deployment (Alternative)

### Using Docker Compose

```bash
# Create production environment file
cp backend/.env.example backend/.env
# Edit backend/.env with production values

# Build and run
docker-compose -f docker-compose.prod.yml up -d --build

# Run migrations
docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate

# Create superuser
docker-compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser

# Collect static files
docker-compose -f docker-compose.prod.yml exec backend python manage.py collectstatic --noinput
```

---

## Post-Deployment Checklist

- [ ] SSL certificates installed and working
- [ ] Database backups configured
- [ ] Django `DEBUG=False` in production
- [ ] Secret key is strong and unique
- [ ] ALLOWED_HOSTS configured correctly
- [ ] CORS_ALLOWED_ORIGINS includes your frontend domain
- [ ] Static files serving correctly
- [ ] Media uploads working
- [ ] Admin panel accessible
- [ ] Error logging configured
- [ ] Monitoring setup (optional: Sentry, New Relic)
- [ ] Regular backup script scheduled

---

## Monitoring & Logging

### Application Logs

```bash
# Backend logs
tail -f /var/log/newgate/gunicorn-error.log
tail -f /var/www/newgate-chapel/backend/django.log

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# System logs
journalctl -u newgate-backend -f
```

### Health Checks

Create a simple health check endpoint and monitor it:

```bash
# Add to crontab for monitoring
*/5 * * * * curl -f https://api.yourdomain.com/api/health/ || echo "API Down!" | mail -s "Alert" admin@yourdomain.com
```

---

## Backup Strategy

### Database Backup

```bash
# Create backup script: /usr/local/bin/backup-newgate.sh
#!/bin/bash
BACKUP_DIR="/var/backups/newgate"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U newgate_user newgate_production | gzip > $BACKUP_DIR/db_$DATE.sql.gz
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +7 -delete

# Make executable and add to crontab
chmod +x /usr/local/bin/backup-newgate.sh
# Add to crontab: 0 2 * * * /usr/local/bin/backup-newgate.sh
```

### Media Files Backup

```bash
# Sync to cloud storage (example with rclone)
rclone sync /var/www/newgate-chapel/backend/media remote:newgate-media
```

---

## Troubleshooting

### Backend not starting

```bash
# Check service status
sudo systemctl status newgate-backend

# Check logs
journalctl -u newgate-backend -n 50

# Test gunicorn manually
cd /var/www/newgate-chapel/backend
source venv/bin/activate
gunicorn config.wsgi:application --bind 0.0.0.0:8000
```

### Static files not loading

```bash
# Recollect static files
python manage.py collectstatic --noinput --clear

# Check permissions
ls -la /var/www/newgate-chapel/backend/staticfiles/
```

### Database connection issues

```bash
# Test PostgreSQL connection
psql -U newgate_user -d newgate_production -h localhost

# Check PostgreSQL is running
sudo systemctl status postgresql
```

---

## Scaling Considerations

### Horizontal Scaling

- Use a load balancer (AWS ALB, Nginx)
- Run multiple Gunicorn instances
- Use shared session storage (Redis)
- Centralize media storage (S3, Azure Blob)

### Performance Optimization

- Enable Redis caching
- Configure CDN (Cloudflare, AWS CloudFront)
- Database connection pooling (PgBouncer)
- Implement database read replicas
- Use database query optimization

---

## Support

For issues or questions:
- Check logs first
- Review Django deployment checklist
- Consult Django documentation
- Contact your hosting provider's support
