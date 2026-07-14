# Deploying RoutineIQ on Alibaba Cloud ECS (Elastic Compute Service)

This guide provides a step-by-step walkthrough to deploy your Next.js application (combining the frontend UI and the backend API routes) onto a single, production-ready Alibaba Cloud ECS Linux virtual machine.

---

## 1. Network & Database Configuration (Crucial)

Since your **ApsaraDB RDS Serverless (MySQL)** database is hosted inside an Alibaba Cloud VPC, the ECS instance must be in the same private network to communicate with it.

### Step 1: Create ECS in the Same VPC
When provisioning your ECS instance in the Alibaba Cloud Console:
- Select the **same Region** as your database (e.g., `ap-southeast-1` Singapore).
- Select the **same VPC** (Virtual Private Cloud) that your ApsaraDB RDS database is attached to.
- Select a VSwitch in the same availability zone.

### Step 2: Add ECS Private IP to RDS Whitelist
Once your ECS instance is created:
1. Go to the **Alibaba Cloud RDS Console**.
2. Select your database instance -> **Database Connection & Whitelists** (or **Security Control**).
3. Under the whitelist settings, add the **Private IP address** of your new ECS instance. 
4. Save the changes.

---

## 2. Server Environment Setup (Ubuntu)

SSH into your ECS instance using your terminal:
```bash
ssh root@<your-ecs-public-ip>
```

### Option 1: Automated Setup Script (Recommended)
We have provided an automated script `setup-ecs-ubuntu.sh` in the root of the project. You can run it on your ECS instance to automatically update the system, install Node.js 20 LTS, install Git & PM2, configure Nginx, and enable the firewall:

```bash
# Fetch and run the automated script directly
curl -o setup-ecs-ubuntu.sh https://raw.githubusercontent.com/Dannyblaq15/routineiq/main/setup-ecs-ubuntu.sh
chmod +x setup-ecs-ubuntu.sh
sudo ./setup-ecs-ubuntu.sh
```

### Option 2: Manual Setup

#### Install Node.js (Node 20 Recommended)
```bash
# Install NodeSource Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Install Git
```bash
sudo apt-get update
sudo apt-get install -y git
```

#### Install PM2 (Process Manager for Node.js)
PM2 keeps your Next.js application running in the background and restarts it on crashes or server reboots.
```bash
sudo npm install -g pm2
```

---

## 3. Deploying the Application

### Option A: Direct Git Deploy & PM2 (Recommended)
This approach is lightweight, doesn't require a Docker registry, and makes updating the code very simple.

1. **Clone your repository:**
   ```bash
   cd /var/www
   sudo git clone https://github.com/Dannyblaq15/routineiq.git
   cd routineiq
   ```

2. **Configure your Environment Variables:**
   Create a `.env` file in the root of the project:
   ```bash
   sudo nano .env
   ```
   Paste all your production secrets:
   ```env
   DATABASE_URL="mysql://username:password@your-rds-endpoint.mysql.rds.aliyuncs.com:3306/routineiq"
   FIREBASE_PROJECT_ID="your-firebase-project-id"
   FIREBASE_CLIENT_EMAIL="your-firebase-client-email"
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
   QWEN_API_KEY="your-qwen-api-key"
   ```

3. **Install Dependencies and Build the App:**
   ```bash
   # Install dependencies
   npm install
   
   # Generate Prisma Client
   npx prisma generate
   
   # Build the production application
   npm run build
   ```

4. **Start the Application using PM2:**
   Instead of running `npm run start` (which exits when you close the terminal), run it via PM2:
   ```bash
   pm2 start npm --name "routineiq" -- start
   ```

5. **Enable PM2 to Start on Server Boot:**
   ```bash
   pm2 startup
   # Copy and run the command printed in the terminal output by the startup command above!
   pm2 save
   ```

---

### Option B: Docker Container Deploy
If you prefer containerization:

1. **Install Docker on ECS:**
   ```bash
   sudo apt-get install -y docker.io
   sudo systemctl start docker
   sudo systemctl enable docker
   ```

2. **Clone the Repo & Create `.env`:**
   (Same as Step 1 & 2 in Option A above).

3. **Build the Docker Image:**
   ```bash
   sudo docker build -t routineiq .
   ```

4. **Run the Container:**
   Since the `Dockerfile` defaults to port `3000`, we map port `3000` on the server to `3000` in the container:
   ```bash
   sudo docker run -d \
     --name routineiq \
     -p 3000:3000 \
     --env-file .env \
     --restart always \
     routineiq
   ```

---

## 4. Setting up Nginx Reverse Proxy (Port 80/443 -> 3000)

By default, Next.js runs on port `3000`. We want traffic coming to your domain (port `80` for HTTP and port `443` for HTTPS) to be automatically forwarded to port `3000`.

### Install Nginx
```bash
sudo apt-get install -y nginx
```

### Configure Nginx
Create a configuration file for your app:
```bash
sudo nano /etc/nginx/sites-available/routineiq
```
Add the following configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com; # Replace with your actual domain or ECS public IP

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Activate Configuration
```bash
# Link to sites-enabled
sudo ln -s /etc/nginx/sites-available/routineiq /etc/nginx/sites-enabled/
# Remove default Nginx config to avoid conflicts
sudo rm /etc/nginx/sites-enabled/default
# Test config
sudo nginx -t
# Restart Nginx
sudo systemctl restart nginx
```

---

## 5. Enable SSL / HTTPS (Let's Encrypt)

Secure your application with HTTPS using Certbot.

```bash
sudo apt-get install -y certbot python3-certbot-nginx
# Run Certbot to automatically configure SSL for Nginx
sudo certbot --nginx -d yourdomain.com
```
Follow the interactive prompts. Certbot will obtain the SSL certificate and configure Nginx to force HTTPS.
