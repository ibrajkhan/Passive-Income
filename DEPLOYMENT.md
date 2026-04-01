# Deployment Guide

This guide shows the simplest way to deploy this app with:

- Netlify for the frontend
- Render for the backend
- MongoDB Atlas for the database

## Before you start

Make sure:

1. Your code is pushed to GitHub
2. You have a Netlify account
3. You have a Render account
4. You have a MongoDB Atlas account

## Part 1: Create MongoDB Atlas database

1. Log in to MongoDB Atlas
2. Create a new project
3. Create a new cluster
4. Wait for the cluster to finish creating
5. Open `Database Access`
6. Create a database user
7. Save the username and password
8. Open `Network Access`
9. Add IP address `0.0.0.0/0`
10. Confirm access
11. Go back to `Database`
12. Click `Connect`
13. Choose `Drivers`
14. Copy the MongoDB connection string
15. Replace the placeholder username and password in the connection string

It should look similar to:

```env
MONGODB_URI=mongodb+srv://username:password@cluster-url.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

## Part 2: Deploy backend on Render

1. Log in to Render
2. Click `New +`
3. Click `Web Service`
4. Connect your GitHub account if needed
5. Select your repository
6. If Render detects `render.yaml`, continue with it
7. Confirm the service name
8. Confirm runtime is `Node`
9. Confirm build command is:

```bash
npm install
```

10. Confirm start command is:

```bash
npm run start --workspace server
```

11. Open the environment variables section
12. Add:

```env
ADMIN_KEY=your-secret-admin-key
CLIENT_URLS=https://your-netlify-site.netlify.app,http://localhost:5173
MONGODB_URI=your-mongodb-atlas-uri
```

13. Click `Create Web Service`
14. Wait for deployment to finish
15. Copy your Render URL

It will look like:

`https://your-render-service.onrender.com`

Your API base URL will be:

`https://your-render-service.onrender.com/api`

## Part 3: Deploy frontend on Netlify

1. Log in to Netlify
2. Click `Add new site`
3. Click `Import an existing project`
4. Connect GitHub if needed
5. Select your repository
6. Netlify should detect the settings from `netlify.toml`
7. Confirm build command is:

```bash
npm install && npm run build --workspace client
```

8. Confirm publish directory is:

```bash
client/dist
```

9. Open environment variables before deploying
10. Add:

```env
VITE_API_URL=https://your-render-service.onrender.com/api
```

11. Click `Deploy site`
12. Wait for deployment to finish
13. Copy your Netlify site URL

It will look like:

`https://your-site-name.netlify.app`

## Part 4: Connect frontend and backend

After Netlify gives you your final frontend URL:

1. Go back to Render
2. Open your backend service
3. Open environment variables
4. Update `CLIENT_URLS` to include your real Netlify URL

Example:

```env
CLIENT_URLS=https://your-site-name.netlify.app,http://localhost:5173
```

5. Save changes
6. Redeploy the Render service if needed

## Part 5: Test the deployed app

1. Open your Netlify site
2. Confirm the homepage loads
3. Confirm offers appear
4. Click an offer and make sure it redirects
5. Submit the lead form
6. Visit `/admin`
7. Enter your `ADMIN_KEY`
8. Confirm the dashboard loads
9. Add a new offer and confirm it appears

## Part 6: Replace placeholder affiliate destinations

This is the part that matters for revenue.

1. Join the affiliate programs you want to promote
2. Get your personal tracking links from each affiliate dashboard
3. Open the admin page
4. Replace each offer’s destination URL with your personal affiliate link

Without your own tracked affiliate links:

- clicks will still work
- redirects will still work
- but you will not get paid

## Part 7: How you make money

The flow is:

1. A visitor lands on your site
2. They read your offer or review content
3. They click your affiliate link
4. They sign up or buy on the partner site
5. The partner tracks the sale to your affiliate account
6. You earn commission

You can improve revenue by:

- publishing SEO pages targeting buying keywords
- posting short-form content to bring visitors
- collecting emails and promoting offers again later
- testing which offers get the most clicks

## Troubleshooting

### Netlify frontend loads but no data appears

Check:

- `VITE_API_URL` is correct in Netlify
- Render backend is deployed successfully
- Render backend URL ends with `/api`

### CORS error in browser

Check:

- `CLIENT_URLS` in Render includes your Netlify URL exactly
- the backend has redeployed after env changes

### Admin page says invalid admin key

Check:

- the value you type matches `ADMIN_KEY` in Render exactly

### Data disappears after redeploy

Check:

- you are using MongoDB Atlas
- `MONGODB_URI` is set in Render

If `MONGODB_URI` is missing, production may fall back to file storage, which is not reliable for hosted deployments.

## Quick summary

- MongoDB Atlas stores real data
- Render runs the API
- Netlify runs the frontend
- Your affiliate links generate revenue
- Your content and traffic bring visitors
