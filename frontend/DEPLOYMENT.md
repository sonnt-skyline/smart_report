# Smart Report Frontend - Production Deployment Guide

## Prerequisites

1. **VPS with Ubuntu/Debian** (or similar Linux distribution)
2. **Node.js 18+** installed
3. **Nginx** web server
4. **SSL certificate** (Let's Encrypt recommended)
5. **Domain name** pointing to your VPS

## Deployment Steps

### 1. Prepare Your VPS

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Nginx (if not already installed)
sudo apt install nginx -y

# Install PM2 for process management (for your backend)
sudo npm install -g pm2
```

### 2. Configure Environment Variables

Update the `.env.production` file with your actual domain:

```bash
# Edit .env.production
VITE_API_URL=https://your-domain.com/api
```

Replace `your-domain.com` with your actual domain.

### 3. Build the Application

Run the deployment script:

```bash
./deploy.sh
```

Or manually:

```bash
npm ci
npm run build
```

### 4. Deploy to VPS

Copy the built files to your VPS:

```bash
# From your local machine
scp -r dist/ user@your-vps-ip:/var/www/smart-report/

# Or use rsync for better performance
rsync -avz --delete dist/ user@your-vps-ip:/var/www/smart-report/
```

### 5. Configure Nginx

```bash
# On your VPS, copy the nginx configuration
sudo cp nginx.conf.template /etc/nginx/sites-available/smart-report

# Edit the configuration file
sudo nano /etc/nginx/sites-available/smart-report

# Update the following in the configuration:
# - Replace 'your-domain.com' with your actual domain
# - Update SSL certificate paths
# - Verify the document root path (/var/www/smart-report/dist)

# Enable the site
sudo ln -s /etc/nginx/sites-available/smart-report /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### 6. SSL Certificate Setup (Let's Encrypt)

If you haven't set up SSL yet:

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal is usually set up automatically, but verify:
sudo certbot renew --dry-run
```

### 7. Backend Configuration

Make sure your backend API is configured to:

1. **Accept CORS requests** from your domain
2. **Run on port 3001** (or update the nginx proxy configuration)
3. **Handle HTTPS requests** properly

Example backend CORS configuration:
```javascript
// In your backend
app.use(cors({
  origin: ['https://your-domain.com', 'https://www.your-domain.com'],
  credentials: true
}));
```

### 8. Firewall Configuration

```bash
# Allow HTTP and HTTPS traffic
sudo ufw allow 'Nginx Full'

# Allow SSH (if not already allowed)
sudo ufw allow ssh

# Enable firewall
sudo ufw enable
```

## Production Monitoring

### 1. Check Application Status

```bash
# Check if the frontend is accessible
curl -I https://your-domain.com

# Check API endpoint
curl -I https://your-domain.com/api/health
```

### 2. Monitor Logs

```bash
# Nginx access logs
sudo tail -f /var/log/nginx/smart-report.access.log

# Nginx error logs
sudo tail -f /var/log/nginx/smart-report.error.log

# System logs
sudo journalctl -f -u nginx
```

### 3. Performance Optimization

The configuration includes:
- **Gzip compression** for smaller file sizes
- **Browser caching** for static assets
- **HTTP/2** support for better performance
- **Security headers** for protection

## Troubleshooting

### Common Issues

1. **API calls failing**: Check CORS configuration in your backend
2. **404 on refresh**: Ensure SPA routing is configured in nginx
3. **SSL certificate issues**: Verify certificate paths and permissions
4. **Static files not loading**: Check file permissions and nginx configuration

### Debug Commands

```bash
# Check nginx configuration
sudo nginx -t

# Check nginx status
sudo systemctl status nginx

# Check file permissions
ls -la /var/www/smart-report/

# Test API connectivity
curl -X GET https://your-domain.com/api/actions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Updates and Maintenance

### Updating the Frontend

1. Build new version locally
2. Upload to VPS
3. Clear browser cache if needed

```bash
# Quick update script
./deploy.sh
scp -r dist/ user@your-vps-ip:/var/www/smart-report/
```

### Backup Strategy

```bash
# Backup current deployment
sudo cp -r /var/www/smart-report /var/backups/smart-report-$(date +%Y%m%d)
```

## Security Considerations

The configuration includes:
- ✅ HTTPS enforcement
- ✅ Security headers (XSS, CSRF protection)
- ✅ Content Security Policy
- ✅ Secure SSL configuration
- ✅ CORS protection

## Performance Metrics

Expected performance with this configuration:
- **First Contentful Paint**: < 2s
- **Time to Interactive**: < 3s
- **Lighthouse Score**: 90+

Monitor with tools like Google PageSpeed Insights or GTmetrix.