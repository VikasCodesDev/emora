# 🌟 EMORA - AI-Powered Social Hybrid Platform

A next-generation, immersive web application combining social features, AI-powered mood detection, entertainment, and personalization.

## 🚀 Features

- **3D Interactive Homepage** - React Three Fiber powered immersive experience
- **AI Mood Detection** - Text and image-based mood analysis with OpenAI
- **Memes Hub** - Auto-fetch memes with AI-generated captions
- **Music Integration** - Spotify mood-based playlists
- **Personal Vault** - Save and organize your favorite content
- **Live Cricket** - Real-time cricket scores and updates
- **Wallpapers** - Mood-filtered wallpaper gallery
- **AI Quotes** - Generate personalized quotes
- **Polls** - Create and participate in live polls
- **Astrology** - AI-powered horoscopes
- **Fashion** - Mood-based outfit suggestions
- **Full Authentication** - JWT-based secure authentication

## 🛠️ Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- React Three Fiber
- ShadCN UI
- Zustand
- React Hook Form
- Zod
- Axios

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcrypt
- OpenAI API

## 📦 Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_spotify_client_id
```

Run development server:
```bash
npm run dev
```

Frontend will run on: http://localhost:3000

### Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/emora
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
OPENAI_API_KEY=your_openai_api_key
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
CRICKET_API_KEY=your_cricket_api_key
```

Run development server:
```bash
npm run dev
```

Backend will run on: http://localhost:5000

## 🗂️ Project Structure

```
emora/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   ├── (protected)/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   ├── lib/
│   │   ├── store/
│   │   └── types/
│   ├── public/
│   ├── package.json
│   └── tailwind.config.ts
└── backend/
    ├── controllers/
    ├── models/
    ├── routes/
    ├── middleware/
    ├── config/
    ├── server.ts
    └── package.json
```

## 🔐 API Endpoints

### Authentication
- POST `/api/auth/signup` - Register new user
- POST `/api/auth/login` - Login user
- POST `/api/auth/logout` - Logout user
- GET `/api/auth/me` - Get current user

### Mood
- POST `/api/mood/analyze-text` - Analyze mood from text
- POST `/api/mood/analyze-image` - Analyze mood from image

### Content
- GET `/api/memes` - Fetch memes
- POST `/api/memes/caption` - Generate AI caption
- GET `/api/music/playlists` - Get mood playlists
- GET `/api/cricket/matches` - Get live cricket scores
- GET `/api/wallpapers` - Fetch wallpapers
- POST `/api/quotes/generate` - Generate AI quote
- GET `/api/astro/horoscope/:sign` - Get horoscope

### Vault
- GET `/api/vault` - Get user's saved content
- POST `/api/vault/save` - Save content to vault
- DELETE `/api/vault/:id` - Remove from vault

## 🎨 Design Features

- Dark futuristic theme
- Glassmorphism effects
- Neon gradient highlights
- Animated glowing borders
- 3D floating backgrounds
- Cursor glow particle trail
- Parallax scrolling
- Micro-interactions
- Premium typography

## 🚢 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel
```

### Backend (Render)
1. Connect GitHub repository
2. Set environment variables
3. Deploy

## 📝 License

MIT License

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines first.

---

Built with ❤️ using Next.js, Three.js, and OpenAI
