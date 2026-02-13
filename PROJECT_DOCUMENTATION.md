# 🌟 EMORA - Complete Project Documentation

## Overview

EMORA is a production-ready, AI-powered social hybrid platform featuring:
- ✨ AI mood detection from text
- 🎭 Auto-fetch memes with AI-generated captions
- 🎵 Spotify mood-based playlists
- 🔐 Personal vault for saved content
- 🏏 Live cricket scores
- 🖼️ Mood-filtered wallpapers
- 💭 AI-generated quotes
- 📊 Interactive polls
- 🌙 AI horoscopes
- 👔 Mood-based fashion suggestions
- 🎨 Immersive 3D WebGL interface

## Project Structure

```
emora/
├── backend/                    # Node.js/Express/MongoDB backend
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── controllers/       # Business logic
│   │   ├── middleware/        # Auth, validation, error handling
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # API endpoints
│   │   └── server.ts          # Main server file
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/                   # Next.js 14 frontend
│   ├── src/
│   │   ├── app/               # Pages and layouts (App Router)
│   │   │   ├── (auth)/        # Login, Signup
│   │   │   ├── (protected)/   # Protected routes (Vault)
│   │   │   ├── memes/         # Memes page
│   │   │   ├── mood/          # Mood detection
│   │   │   ├── music/         # Spotify playlists
│   │   │   ├── trending/      # Trending content
│   │   │   ├── cricket/       # Cricket scores
│   │   │   ├── wallpapers/    # Wallpaper gallery
│   │   │   ├── quotes/        # Quote generator
│   │   │   ├── polls/         # Polls feature
│   │   │   ├── challenge/     # Weekly challenges
│   │   │   ├── astro/         # Horoscopes
│   │   │   ├── fashion/       # Fashion suggestions
│   │   │   └── page.tsx       # Homepage
│   │   ├── components/        # Reusable components
│   │   ├── lib/               # Utilities & API client
│   │   ├── store/             # Zustand state management
│   │   └── types/             # TypeScript types
│   ├── package.json
│   ├── next.config.mjs
│   ├── tailwind.config.ts
│   └── .env.local.example
│
├── README.md                   # Project overview
├── SETUP_GUIDE.md             # Detailed setup instructions
├── quick-start.sh             # Automated setup script
└── .gitignore

```

## Technology Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT with HTTP-only cookies
- **Validation:** Zod schemas
- **Security:** Helmet, CORS, rate limiting, bcrypt
- **AI Integration:** OpenAI GPT-3.5-turbo
- **APIs:** Spotify Web API, Meme API

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom design system
- **3D Graphics:** React Three Fiber (Three.js)
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Forms:** React Hook Form with Zod validation
- **HTTP Client:** Axios with interceptors
- **UI Components:** Custom glass morphism components
- **Notifications:** Sonner toast library

## Key Features Implementation

### 1. Authentication System
- **Signup:** Name, email, password with strong validation
- **Login:** JWT token generation, HTTP-only cookies
- **Logout:** Token invalidation
- **Protected Routes:** Middleware verification
- **Security:** bcrypt hashing (12 rounds), password requirements

### 2. AI Mood Detection
- **Text Analysis:** OpenAI GPT-3.5 analyzes emotional tone
- **Output:** Mood classification, intensity (1-10), explanation, color, emoji
- **Visualization:** Animated results with mood-based theming
- **Persistence:** Save mood analyses to vault

### 3. Memes Hub
- **Auto-fetch:** Reddit memes via Meme API
- **AI Captions:** OpenAI generates witty, Gen-Z friendly captions
- **Interactions:** Save to vault, download, regenerate caption
- **UI:** Grid layout with hover effects, infinite scroll ready

### 4. Music Integration
- **Spotify API:** Fetch playlists based on mood
- **Mood Selector:** Happy, sad, chill, energetic, romantic, focused
- **Features:** Preview, save to vault, open in Spotify
- **Auth:** Requires user login

### 5. Personal Vault
- **Storage:** Save memes, playlists, quotes, moods, wallpapers
- **Organization:** Filter by type, chronological sorting
- **Analytics:** Total saved, breakdown by type, mood distribution
- **Management:** Delete items, view history

### 6. UI/UX Features
- **3D Background:** React Three Fiber with floating particles and rotating mesh
- **Custom Cursor:** Particle trail effect with glow
- **Glass morphism:** Backdrop blur, transparent backgrounds
- **Neon Theme:** Cyan, purple, pink gradient color scheme
- **Animations:** Framer Motion for page transitions, hover effects
- **Responsive:** Mobile-first design, works on all devices
- **Typography:** Orbitron (headings) + Inter (body)

## API Endpoints

### Authentication
```
POST   /api/auth/signup        Register new user
POST   /api/auth/login         Login user
POST   /api/auth/logout        Logout user
GET    /api/auth/me            Get current user
```

### Mood Analysis
```
POST   /api/mood/analyze-text    Analyze mood from text
POST   /api/mood/analyze-image   Analyze mood from image description
```

### Content
```
GET    /api/content/memes                    Fetch memes
POST   /api/content/memes/caption            Generate AI caption
GET    /api/content/music/playlists          Get mood playlists
GET    /api/content/cricket/matches          Get cricket matches
GET    /api/content/wallpapers               Get wallpapers
POST   /api/content/quotes/generate          Generate AI quote
GET    /api/content/astro/horoscope/:sign    Get horoscope
POST   /api/content/fashion/suggestions      Get fashion suggestions
```

### Vault
```
GET    /api/vault                Get user's saved content
POST   /api/vault/save           Save content to vault
DELETE /api/vault/:id            Remove from vault
GET    /api/vault/analytics      Get vault analytics
```

### Polls
```
GET    /api/polls                Get all polls
POST   /api/polls                Create poll
GET    /api/polls/:id            Get poll by ID
POST   /api/polls/:id/vote       Vote on poll
```

## Database Models

### User
```typescript
{
  name: string;
  email: string;        // unique, indexed
  password: string;     // hashed with bcrypt
  createdAt: Date;
}
```

### SavedContent
```typescript
{
  userId: ObjectId;     // indexed
  type: 'meme' | 'playlist' | 'quote' | 'mood' | 'wallpaper';
  contentData: {
    title?: string;
    url?: string;
    description?: string;
    mood?: string;
    imageUrl?: string;
    metadata?: any;
  };
  createdAt: Date;      // indexed
}
```

### Poll
```typescript
{
  userId: ObjectId;
  question: string;
  options: [{
    text: string;
    votes: number;
    voters: ObjectId[];
  }];
  expiresAt?: Date;
  createdAt: Date;
}
```

## Security Features

✅ **Password Security**
- bcrypt hashing with 12 salt rounds
- Strong password requirements (uppercase, lowercase, number, 8+ chars)
- Never stored in plaintext

✅ **JWT Authentication**
- HTTP-only cookies prevent XSS attacks
- 7-day expiration
- Secure flag in production
- Token verification middleware

✅ **API Security**
- Helmet.js for security headers
- CORS with whitelist
- Rate limiting (100 requests/15 min)
- Input validation with Zod
- MongoDB injection protection

✅ **Error Handling**
- Centralized error handler
- No sensitive data in error messages
- Proper status codes
- Logging for debugging

## Performance Optimizations

### Frontend
- Dynamic imports for heavy components (Three.js)
- Next.js Image optimization
- Lazy loading for off-screen content
- CSS animations over JavaScript where possible
- Debounced inputs
- Optimized re-renders with React memo

### Backend
- MongoDB indexes on frequent queries
- Efficient field selection
- Connection pooling
- Response caching potential
- Compressed responses

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/emora
JWT_SECRET=min_32_characters_secure_random_string
JWT_EXPIRE=7d
NODE_ENV=development
OPENAI_API_KEY=sk-...
SPOTIFY_CLIENT_ID=...
SPOTIFY_CLIENT_SECRET=...
CRICKET_API_KEY=...
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=...
```

## Deployment Checklist

- [ ] Environment variables configured
- [ ] MongoDB Atlas connection string
- [ ] OpenAI API key with credits
- [ ] Spotify app credentials
- [ ] JWT secret (32+ characters)
- [ ] CORS URLs updated for production
- [ ] Build succeeds locally
- [ ] All tests passing
- [ ] Error logging configured
- [ ] SSL/HTTPS enabled
- [ ] Domain configured
- [ ] Backup strategy in place

## Future Enhancements

Potential features to add:
- Real-time chat
- User profiles and avatars
- Social following system
- Content recommendations ML model
- Push notifications
- PWA support
- Dark/light theme toggle
- Multi-language support
- Advanced analytics dashboard
- AI image generation
- Video content support

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or contributions:
- Check SETUP_GUIDE.md for detailed setup
- Review API documentation above
- Check troubleshooting section

## Credits

Built with:
- Next.js by Vercel
- Three.js for 3D graphics
- OpenAI for AI capabilities
- MongoDB for database
- Spotify Web API
- Tailwind CSS for styling
- Framer Motion for animations

---

**EMORA** - Where AI meets social entertainment 🌟
