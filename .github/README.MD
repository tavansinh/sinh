# Facebook Protect

## Deployment Steps

1. SSH into your VPS:
   ```
   ssh user@your_vps_ip
   ```

2. Create a directory for your application:
   ```
   mkdir -p /var/www/facebook-protect
   cd /var/www/facebook-protect
   ```

3. Clone the repository (if using version control):
   ```
   git clone https://your-repository-url.git .
   ```
   Or copy your project files to this directory.

4. Install dependencies:
   ```
   npm install
   ```

5. Ensure your `package.json` includes `"type": "module"`:
   This allows the use of ES modules in your Node.js application. Your `package.json` should include:
   ```json
   {
     "name": "facebook-protect",
     "type": "module",
   }
   ```

6. Install PM2 globally:
   ```
   npm install -g pm2
   ```

7. Start the application using PM2:
   ```
   pm2 start app.js --name "facebook-protect" --node-args="--experimental-specifier-resolution=node"
   ```

   Alternatively, you can create an ecosystem file for PM2:

   Create a file named `ecosystem.config.cjs` with the following content:
   ```javascript
   module.exports = {
     apps: [{
       name: "facebook-protect",
       script: "app.js",
       node_args: "--experimental-specifier-resolution=node"
     }]
   };
   ```

   Then start your application using:
   ```
   pm2 start ecosystem.config.cjs
   ```

8. Install Nginx:
   ```
   sudo apt update
   sudo apt install nginx
   ```

9. Configure Nginx:
   ```
   sudo cp default /etc/nginx/sites-available/default
   ```

10. Enable the Nginx configuration:
    ```
    sudo ln -s /etc/nginx/sites-available/facebook-protect /etc/nginx/sites-enabled/
    ```

11. Test Nginx configuration:
    ```
    sudo nginx -t
    ```

12. If the test is successful, restart Nginx:
    ```
    sudo systemctl restart nginx
    ```

## Updating the Application

To update the application:

1. SSH into the VPS
2. Navigate to the application directory: `cd /var/www/facebook-protect`
3. Pull the latest changes (if using git): `git pull`
4. Install any new dependencies: `npm install`
5. Restart the PM2 process:
   ```
   pm2 restart facebook-protect
   ```
   Or if using the ecosystem file:
   ```
   pm2 restart ecosystem.config.cjs
   ```

## Troubleshooting

- If you encounter any issues, check the PM2 logs: `pm2 logs facebook-protect`
- Ensure your firewall allows traffic on port 80 (and 443 if using HTTPS)
- Make sure your app is listening on the correct port (default is 3000 for Express)
- If you encounter module import issues, ensure that `"type": "module"` is set in your `package.json`
- When using ES modules with PM2, make sure to use the `--experimental-specifier-resolution=node` flag to allow importing files without specifying the `.js` extension.
- If you're having issues with ES module imports, try using the ecosystem file method as it provides more flexibility in configuring Node.js arguments.
