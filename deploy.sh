#!/bin/bash

set -e

echo "================================="
echo "Starting Frontend Deployment..."
echo "================================="

cd /var/www/ensis/frontend || exit 1

echo "Fetching latest code..."
git fetch origin

echo "Resetting to latest master..."
git reset --hard origin/master

echo "Installing dependencies..."
npm install

echo "Removing old build..."
rm -rf .next

echo "Building application..."
npm run build

echo "Restarting PM2..."
pm2 restart ensis

echo "================================="
echo "Deployment Completed Successfully"
echo "================================="