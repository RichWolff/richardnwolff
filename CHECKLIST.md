# Deployment Checklist

## Local Development Setup
- [ ] Update `.env.local` with your actual admin email and password
- [ ] Test login functionality with your admin credentials
- [ ] Verify that draft posts are only visible when logged in
- [ ] Test creating and editing blog posts
- [ ] Test resume editing functionality
- [ ] Verify search functionality works correctly

## Pre-Deployment Tasks
- [ ] Run `npm run build` to ensure the application builds without errors
- [ ] Update any hardcoded URLs to use relative paths or environment variables
- [ ] Ensure all API routes are properly secured with authentication
- [ ] Check that the webpack configuration handles Node.js modules correctly
- [ ] Verify that the custom server file works correctly

## Dreamhost Setup
- [ ] Ensure Node.js (v16+) is installed on your Dreamhost server
- [ ] Set up SSH access to your Dreamhost server
- [ ] Create a subdomain or use your main domain for the application
- [ ] Configure Dreamhost to use a proxy server for your Node.js application
- [ ] Set up PM2 or another process manager to keep your application running

## Deployment
- [ ] Run the deployment script: `./scripts/deploy.sh yourusername your-domain.com`
- [ ] SSH into your Dreamhost server and follow the setup instructions
- [ ] Create and configure the `.env` file with your production credentials
- [ ] Install dependencies with `npm install --production`
- [ ] Start the server with PM2: `pm2 start server.js --name "your-app-name"`
- [ ] Set up PM2 to start on server reboot: `pm2 startup` and `pm2 save`

## Post-Deployment Verification
- [ ] Verify the application is accessible at your domain
- [ ] Test login functionality in production
- [ ] Verify that all features work correctly in production
- [ ] Check server logs for any errors: `pm2 logs`
- [ ] Set up monitoring for your application (optional)

## Security Considerations
- [ ] Ensure your `.env` file has restricted permissions: `chmod 600 .env`
- [ ] Use HTTPS for your domain (Dreamhost provides Let's Encrypt certificates)
- [ ] Regularly update your admin password
- [ ] Keep your dependencies up to date
- [ ] Set up automatic security updates for your server 