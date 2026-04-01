# Sleepy Commissions

A full-stack React + Node.js affiliate marketing app with a public storefront, lead capture, click tracking, and an admin dashboard.

## What this app is for

This app helps you run an affiliate site:

- Show software offers on a public storefront
- Send visitors to affiliate links
- Track offer clicks before redirecting
- Collect email leads
- Manage offers from an admin dashboard

You make money when visitors click your affiliate link and buy from the partner company. Some programs also pay recurring commission.

## Tech stack

- React + Vite frontend
- Node.js + Express backend
- MongoDB via Mongoose when `MONGODB_URI` is set
- File-based persistence fallback for local development

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Create env files:

```bash
copy server\.env.example server\.env
copy client\.env.example client\.env
```

3. Start both apps:

```bash
npm run dev
```

4. Open the frontend:

`http://localhost:5173`

## Admin access

- Admin page: `http://localhost:5173/admin`
- Default admin key: `demo-admin`

## Local env values

### `server/.env`

```env
PORT=4000
ADMIN_KEY=demo-admin
CLIENT_URL=http://localhost:5173
CLIENT_URLS=http://localhost:5173
MONGODB_URI=
```

### `client/.env`

```env
VITE_API_URL=http://localhost:4000/api
```

## Deploy on Netlify + Render

### Architecture

- Netlify hosts the React frontend
- Render hosts the Node.js API
- MongoDB Atlas is recommended for production data

### Deploy backend on Render

1. Push this repo to GitHub.
2. In Render, create a new `Web Service` from the repo.
3. Render can read [render.yaml](C:\IBRAZ\My app Codex\render.yaml) automatically, or you can configure it manually.
4. Set these environment variables in Render:

```env
ADMIN_KEY=your-secret-admin-key
CLIENT_URLS=https://your-netlify-site.netlify.app,http://localhost:5173
MONGODB_URI=your-mongodb-atlas-uri
```

5. After deploy, copy your Render backend URL, for example:

`https://sleepy-commissions-api.onrender.com`

Your API base URL will be:

`https://sleepy-commissions-api.onrender.com/api`

### Deploy frontend on Netlify

1. In Netlify, create a new site from the same GitHub repo.
2. Netlify can use [netlify.toml](C:\IBRAZ\My app Codex\netlify.toml).
3. In Netlify, add this environment variable:

```env
VITE_API_URL=https://your-render-service.onrender.com/api
```

4. Deploy the site.

### Build settings used

#### Netlify

- Build command: `npm install && npm run build --workspace client`
- Publish directory: `client/dist`

#### Render

- Build command: `npm install`
- Start command: `npm run start --workspace server`

## Important production note

The app is functional, but you still need to replace offer destination URLs with your real tracked affiliate links from each partner dashboard. Without your unique tracking URLs, clicks will work but sales will not be credited to you.

## MongoDB

For production, use MongoDB Atlas and set:

```env
MONGODB_URI=mongodb+srv://...
```

If `MONGODB_URI` is not set, the app uses local file storage, which is fine for testing but not reliable for production hosting.
