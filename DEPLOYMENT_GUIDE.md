# Deployment Guide for Health Detective Site

This guide will walk you through deploying your Health Diagnostics System to Render and connecting it to your Hostinger domain.

## 1. Prepare Your Project for Deployment

### 1.1. Update API Endpoints

1. Replace the hardcoded API URLs in `frontend/js/script.js` with relative paths:
   - Change `https://healthdetective.site/predict` to `/api/predict`
   - Change `https://healthdetective.site/diseases` to `/api/diseases`

2. Create a `requirements.txt` file in the backend directory with the following content:
   ```
   fastapi==0.115.12
   uvicorn==0.34.0
   python-multipart==0.0.20
   scikit-learn==1.6.1
   numpy==1.26.4
   gunicorn==21.2.0
   ```

3. Create a `Procfile` in the backend directory with the following content:
   ```
   web: gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
   ```

## 2. Deploy to Render

### 2.1. Create a Render Account

1. Go to [render.com](https://render.com) and sign up for an account
2. Verify your email address

### 2.2. Deploy the Backend

1. In the Render dashboard, click "New" and select "Web Service"
2. Connect your GitHub repository or upload your code
3. Configure the service:
   - Name: `healthdetective-api`
   - Environment: `Python 3`
   - Build Command: `pip install -r backend/requirements.txt`
   - Start Command: `cd backend && gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app`
   - Plan: Free (or choose a paid plan for better performance)

4. Click "Create Web Service"
5. Wait for the deployment to complete (this may take a few minutes)

### 2.3. Deploy the Frontend

1. In the Render dashboard, click "New" and select "Static Site"
2. Connect your GitHub repository or upload your code
3. Configure the service:
   - Name: `healthdetective-site`
   - Build Command: `echo "No build required"`
   - Publish Directory: `frontend`
   - Environment Variables: None required

4. Click "Create Static Site"
5. Wait for the deployment to complete

## 3. Connect to Your Hostinger Domain

### 3.1. Get Your Render URLs

1. After deployment, Render will provide you with URLs for both services:
   - Backend: `https://healthdetective-api.onrender.com`
   - Frontend: `https://healthdetective-site.onrender.com`

### 3.2. Configure DNS in Hostinger

1. Log in to your Hostinger account
2. Go to "Domains" and select "healthdetective.site"
3. Click on "DNS / Nameservers"
4. Add the following DNS records:

   | Type  | Name | Value                                |
   |-------|------|--------------------------------------|
   | A     | @    | 76.76.21.21                         |
   | CNAME | www  | healthdetective-site.onrender.com   |

5. Save the changes

### 3.3. Configure Custom Domain in Render

1. Go to your frontend service in Render
2. Click on "Settings"
3. Scroll down to "Custom Domains"
4. Click "Add Domain"
5. Enter "healthdetective.site" and click "Add"
6. Follow the instructions to verify domain ownership
7. Wait for DNS propagation (can take up to 48 hours)

## 4. Update CORS Settings

1. Go to your backend service in Render
2. Click on "Settings"
3. Scroll down to "Environment Variables"
4. Add the following environment variable:
   - Key: `ALLOWED_ORIGINS`
   - Value: `https://healthdetective.site,https://www.healthdetective.site`

5. Update your `main.py` file to use this environment variable:

```python
import os

# Get allowed origins from environment variable or use defaults
allowed_origins = os.environ.get("ALLOWED_ORIGINS", "https://healthdetective.site,https://www.healthdetective.site").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

6. Redeploy your backend service

## 5. Test Your Deployment

1. Visit https://healthdetective.site in your browser
2. Test the disease prediction functionality
3. Test the disease search functionality
4. Verify that all features are working correctly

## 6. Troubleshooting

### 6.1. DNS Issues

- DNS changes can take up to 48 hours to propagate
- Use [dnschecker.org](https://dnschecker.org) to check DNS propagation

### 6.2. CORS Issues

- Check the browser console for CORS errors
- Verify that your backend CORS settings include your domain
- Make sure your frontend is using relative API paths

### 6.3. API Connection Issues

- Check that your backend service is running
- Verify that your frontend is using the correct API paths
- Check the Render logs for any errors

## 7. Maintenance

### 7.1. Updating Your Application

1. Make changes to your code
2. Push changes to your repository
3. Render will automatically redeploy your application

### 7.2. Monitoring

1. Use Render's built-in monitoring to check service health
2. Set up external monitoring with services like UptimeRobot

### 7.3. Backups

1. Regularly back up your model and data files
2. Consider using Render's backup features for your database (if you add one)