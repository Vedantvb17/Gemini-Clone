# Gemini Frontend Clone Assignment

A fully functional, responsive, and visually appealing frontend for a Gemini-style conversational AI chat application built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Live Demo

[Live Deployment URL](https://your-deployment-url.vercel.app) (To be updated after deployment)

## 📋 Features

### ✅ Authentication
- **OTP-based Login/Signup** with country code selection
- **Country data fetching** from restcountries.com API
- **Simulated OTP** send and validation using setTimeout
- **Form validation** using React Hook Form + Zod

### ✅ Dashboard
- **Chatroom management** - Create, delete, and list chatrooms
- **Toast notifications** for user feedback
- **Responsive grid layout** for mobile and desktop

### ✅ Chat Interface
- **Real-time chat UI** with user and AI messages
- **Typing indicator** - "Gemini is typing..." animation
- **Simulated AI responses** with throttled delays
- **Auto-scroll** to latest messages
- **Reverse infinite scroll** for loading older messages
- **Client-side pagination** (20 messages per page)
- **Image upload support** with preview
- **Copy-to-clipboard** feature on message hover
- **Message timestamps** with proper formatting

### ✅ Global UX Features
- **Mobile responsive design** for all screen sizes
- **Dark/Light mode toggle** with persistence
- **Debounced search** to filter chatrooms
- **LocalStorage persistence** for auth and chat data
- **Loading skeletons** for better UX
- **Toast notifications** for all key actions
- **Keyboard accessibility** for main interactions

## 🛠️ Tech Stack

| Feature | Technology |
|---------|------------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **State Management** | Zustand |
| **Form Validation** | React Hook Form + Zod |
| **Styling** | Tailwind CSS |
| **Icons** | Lucide React |
| **Notifications** | Sonner |
| **Deployment** | Vercel |

## 📁 Project Structure

```
src/
├── app/                   # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard and chat pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── auth/              # Authentication components
│   ├── chat/              # Chat-related components
│   ├── dashboard/         # Dashboard components
│   └── ui/                # Base UI components
├── hooks/                 # Custom React hooks
│   └── useCountries.ts    # Countries API hook
├── lib/                   # Utility libraries
│   └── utils.ts           # Helper functions
├── stores/                # Zustand stores
│   ├── auth.ts            # Authentication state
│   ├── chat.ts            # Chat and chatrooms state
│   └── theme.ts           # Theme state
├── types/                 # TypeScript type definitions
│   └── index.ts           # All interface definitions
└── utils/                 # Utility functions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vedantvb17/Gemini-Clone
   cd Gemini-Colne
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Key Implementation Details

### 🔐 Authentication Flow
- **OTP Simulation**: Uses `setTimeout` to simulate API delays
- **Country Selection**: Fetches real country data from restcountries.com
- **Form Validation**: Zod schemas ensure proper input validation
- **Persistence**: Auth state persists across browser sessions

### 💬 Chat Features
- **Message Throttling**: AI responses are throttled with 1-3 second delays
- **Infinite Scroll**: Reverse infinite scroll loads 10 older messages per batch
- **Real-time Typing**: Simulated typing indicator during AI responses
- **Image Upload**: Supports image preview using base64 encoding
- **Copy Feature**: Click any message to copy its content

### 🎨 UI/UX Enhancements
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Dark Mode**: System preference detection with manual toggle
- **Loading States**: Skeleton screens for better perceived performance
- **Accessibility**: Keyboard navigation and ARIA labels
- **Toast Notifications**: User feedback for all major actions

### 📱 Mobile Optimization
- **Touch-friendly**: Larger tap targets for mobile devices
- **Swipe gestures**: Natural mobile interactions
- **Viewport optimization**: Proper mobile viewport handling
- **Performance**: Lazy loading and code splitting

## 🔍 Search & Filtering
- **Debounced search**: 300ms delay prevents excessive API calls
- **Real-time filtering**: Chatrooms filter as you type
- **Case-insensitive**: Search works regardless of case

## 💾 Data Persistence
- **LocalStorage**: All user data persists locally
- **Zustand Persist**: Automatic state hydration
- **Graceful Fallbacks**: Handles storage unavailability

## 🧪 Testing the App

### OTP Login
- Enter any phone number with a country code
- Use any 6-digit number as OTP (e.g., 123456)
- The app will simulate authentication

### Chat Features
- Create new chatrooms from the dashboard
- Send messages and watch for AI responses
- Upload images by clicking the image icon
- Try the search functionality
- Toggle dark/light mode

## 🚀 Deployment

### Vercel Deployment
1. **Connect to Vercel**
   ```bash
   npx vercel
   ```

2. **Configure settings**
   - Framework: Next.js
   - Build command: `npm run build`
   - Output directory: `.next`

3. **Deploy**
   ```bash
   npx vercel --prod
   ```

### Environment Variables
No environment variables required for this demo application.

## 📊 Performance Optimizations

- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js Image component
- **Lazy Loading**: Components loaded on demand
- **Memoization**: React.memo and useMemo where appropriate
- **Bundle Size**: Tree-shaking and dead code elimination

## 🔧 Configuration Files

### TypeScript Configuration
- Strict mode enabled
- Path aliases configured (`@/*`)
- Latest ES features supported

### Tailwind Configuration
- Custom color schemes
- Dark mode support
- Mobile-first responsive design

### ESLint Configuration
- Next.js recommended rules
- TypeScript support
- Auto-formatting on save

## 👨‍💻 Author

**Vedant Barde**
- Email: Vedantvb17@gmail.com.com
- GitHub: [@vedantvb17](https://github.com/Vedantvb17)
