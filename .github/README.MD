# Facebook Protect - Server Setup

## Setup Instructions

### 1. Install PM2 & Nginx
```bash
npm install pm2 -g
```
Copy `Default` file to:
```bash
sudo cp Default /etc/nginx/sites-available/
sudo cp Default /etc/nginx/sites-enabled/
```

### 2. Install Node.js Packages
```bash
npm install express multer cookie-parser cors axios
```

### 3. Run the Application
```bash
pm2 start app.js --name "facebook-protect" --node-args="--experimental-specifier-resolution=node"
```

### 4. Run & Restart Nginx
```bash
sudo nginx -t
sudo systemctl restart nginx
sudo nginx reload
```