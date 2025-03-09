# Deployment Guide for Dreamhost

This guide explains how to deploy your Next.js application on Dreamhost with a single admin account.

## Prerequisites

- A Dreamhost account with SSH access
- Node.js installed on your Dreamhost server (version 16+ recommended)
- Git installed on your Dreamhost server

## Step 1: Set Up Environment Variables

Create a `.env` file in your application's root directory on the server with the following variables:

```
# Admin credentials
ADMIN_EMAIL=your-actual-email@example.com
ADMIN_PASSWORD=your-actual-secure-password

# JWT Secret (generate a strong random string)
JWT_SECRET=your-actual-long-random-string-at-least-32-characters

# Environment
NODE_ENV=production
```

Make sure to set secure permissions on this file:

```bash
chmod 600 .env
```

## Step 2: Clone and Build the Application

1. SSH into your Dreamhost server:
   ```bash
   ssh username@your-domain.com
   ```

2. Navigate to your web directory:
   ```bash
   cd ~/your-domain.com
   ```

3. Clone your repository:
   ```bash
   git clone https://github.com/yourusername/your-repo.git .
   ```

4. Install dependencies:
   ```bash
   npm install --production
   ```

5. Build the application:
   ```bash
   npm run build
   ```

## Step 3: Set Up a Persistent Process

Dreamhost requires you to set up a persistent process for Node.js applications. You can use a process manager like PM2:

1. Install PM2 globally:
   ```bash
   npm install -g pm2
   ```

2. Start your application with PM2:
   ```bash
   pm2 start server.js --name "your-app-name"
   ```

3. Set up PM2 to start on server reboot:
   ```bash
   pm2 startup
   pm2 save
   ```

## Step 4: Configure Dreamhost Proxy

1. Log in to your Dreamhost panel
2. Go to Domains > your-domain.com > Manage Domain
3. Under "Web Hosting", click "Edit"
4. Select "Proxy server" and enter the port your Node.js app is running on (default: 3000)
5. Save changes

## Step 5: Verify Deployment

1. Visit your website at https://your-domain.com
2. Try logging in at https://your-domain.com/login with your admin credentials

## Troubleshooting

- Check the application logs:
  ```bash
  pm2 logs
  ```

- If you need to restart the application:
  ```bash
  pm2 restart your-app-name
  ```

- If you update your code, pull the changes and rebuild:
  ```bash
  git pull
  npm install --production
  npm run build
  pm2 restart your-app-name
  ```

## Security Considerations

- Never commit your `.env` file to version control
- Regularly update your admin password
- Consider setting up automatic security updates for your server
- Use HTTPS for your domain (Dreamhost provides Let's Encrypt certificates) 