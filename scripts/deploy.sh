#!/bin/bash

# Deployment script for Dreamhost
# Usage: ./scripts/deploy.sh username your-domain.com

if [ $# -lt 2 ]; then
  echo "Usage: $0 <username> <domain>"
  echo "Example: $0 yourusername your-domain.com"
  exit 1
fi

USERNAME=$1
DOMAIN=$2

echo "Building the application..."
npm run build

echo "Creating deployment package..."
mkdir -p deploy
cp -r .next deploy/
cp -r public deploy/
cp package.json deploy/
cp package-lock.json deploy/
cp server.js deploy/
cp next.config.js deploy/

echo "Creating .env file template..."
cat > deploy/.env.template << EOF
# Admin credentials
ADMIN_EMAIL=your-actual-email@example.com
ADMIN_PASSWORD=your-actual-secure-password

# JWT Secret (generate a strong random string)
JWT_SECRET=your-actual-long-random-string-at-least-32-characters

# Environment
NODE_ENV=production
EOF

echo "Zipping deployment package..."
cd deploy
zip -r ../deploy.zip .
cd ..

echo "Uploading to Dreamhost..."
scp deploy.zip $USERNAME@$DOMAIN:~/

echo "SSH instructions for server setup:"
echo "1. SSH into your server: ssh $USERNAME@$DOMAIN"
echo "2. Unzip the deployment package: unzip deploy.zip -d ~/your-domain.com"
echo "3. Create .env file: cp ~/your-domain.com/.env.template ~/your-domain.com/.env"
echo "4. Edit the .env file with your credentials: nano ~/your-domain.com/.env"
echo "5. Install dependencies: cd ~/your-domain.com && npm install --production"
echo "6. Start the server: npm start"

echo "Deployment package created and uploaded successfully!"
echo "Follow the SSH instructions above to complete the deployment." 