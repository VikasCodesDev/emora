# 🚀 EMORA - Complete Setup & Deployment Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Environment Configuration](#environment-configuration)
4. [Running the Application](#running-the-application)
5. [Deployment](#deployment)
6. [API Keys Setup](#api-keys-setup)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software
- **Node.js** 18.x or higher
- **MongoDB** 4.4 or higher (local or Atlas)
- **npm** or **yarn**
- **Git**

### API Keys Needed
- OpenAI API Key (for AI features)
- Spotify Client ID & Secret (for music)
- Optional: Cricket API key

## Local Development Setup

### 1. Clone or Extract the Project

```bash
cd emora
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in `backend/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/emora
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long_please
JWT_EXPIRE=7d
NODE_ENV=development

# OpenAI (Required for mood analysis, quotes, AI features)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Spotify (Required for music playlists)
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# Cricket API (Optional)
CRICKET_API_KEY=your_cricket_api_key

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000
```

**Start Backend:**
```bash
npm run dev
```

Backend will run on: `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local` file in `frontend/` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_spotify_client_id
```

**Start Frontend:**
```bash
npm run dev
```

Frontend will run on: `http://localhost:3000`

## Environment Configuration

### MongoDB Setup

#### Option 1: Local MongoDB
```bash
# Install MongoDB locally
# macOS
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Connection string:
MONGODB_URI=mongodb://localhost:27017/emora
```

#### Option 2: MongoDB Atlas (Recommended for Production)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Replace in `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/emora?retryWrites=true&w=majority
```

### API Keys Setup

#### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys
4. Create new secret key
5. Add to `.env`: `OPENAI_API_KEY=sk-...`

#### Spotify API
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create an app
3. Get Client ID and Client Secret
4. Add redirect URI: `http://localhost:3000` (for local)
5. Add to `.env`:
```env
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
```

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 3 - MongoDB (if local):**
```bash
mongod
```

### Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- API Health Check: http://localhost:5000/api/health

## Deployment

### Frontend Deployment (Vercel)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
cd frontend
vercel
```

3. **Set Environment Variables in Vercel Dashboard:**
- `NEXT_PUBLIC_API_URL` = your backend URL
- `NEXT_PUBLIC_SPOTIFY_CLIENT_ID` = your Spotify client ID

### Backend Deployment (Render)

1. **Create account on [Render](https://render.com/)**

2. **Create New Web Service**
- Connect GitHub repository
- Build Command: `npm install && npm run build`
- Start Command: `npm start`

3. **Set Environment Variables:**
- All variables from `.env`
- Set `NODE_ENV=production`
- Set `FRONTEND_URL` to your Vercel URL

4. **Deploy**

### Alternative: Deploy to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize
railway init

# Deploy backend
cd backend
railway up

# Deploy frontend
cd frontend
railway up
```

## Production Checklist

- [ ] MongoDB Atlas cluster created
- [ ] All API keys obtained
- [ ] Environment variables set
- [ ] CORS configured with production URLs
- [ ] JWT_SECRET is secure (32+ characters)
- [ ] Rate limiting configured
- [ ] SSL/HTTPS enabled
- [ ] Error logging set up
- [ ] Database backups configured

## Testing

### Test Backend API
```bash
# Health check
curl http://localhost:5000/api/health

# Test signup (replace with your data)
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"Test1234","confirmPassword":"Test1234"}'
```

### Test Frontend
1. Navigate to http://localhost:3000
2. Test signup flow
3. Test login flow
4. Test mood detection
5. Test memes page
6. Test vault (requires login)

## Troubleshooting

### MongoDB Connection Issues
```
Error: connect ECONNREFUSED
```
**Solution:** Ensure MongoDB is running or check Atlas connection string

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Kill the process or change PORT in `.env`

### CORS Errors
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** 
- Check `FRONTEND_URL` in backend `.env`
- Ensure frontend URL matches exactly (with/without trailing slash)

### OpenAI API Errors
```
Error: Invalid API key
```
**Solution:**
- Verify API key is correct
- Check OpenAI account has credits
- Ensure key starts with `sk-`

### Build Errors
```
Module not found
```
**Solution:**
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json
npm install
```

## Performance Optimization

### Frontend
- Images are already optimized with Next.js Image
- Dynamic imports for heavy components (Three.js)
- Lazy loading implemented

### Backend
- MongoDB indexes on frequently queried fields
- Rate limiting prevents abuse
- Efficient queries with proper field selection

## Security Features

✅ Password hashing with bcrypt (12 rounds)
✅ JWT authentication with HTTP-only cookies
✅ CORS protection
✅ Rate limiting
✅ Input validation with Zod
✅ Helmet security headers
✅ Protected routes middleware
✅ No sensitive data in frontend

## Support

For issues or questions:
1. Check this guide first
2. Review error logs
3. Check API documentation
4. Verify all environment variables are set correctly

## License

MIT License - Feel free to use for personal or commercial projects

---

**Built with ❤️ using Next.js, Three.js, OpenAI, and MongoDB**
