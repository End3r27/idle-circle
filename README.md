# Idle Circle - Friends-Only Idle RPG Arena

Idle Circle is a cross-platform, privacy-focused **idle RPG web app** designed for small, invite-only friend groups. You and your friends build a squad, assign builds, and let battles happen automatically while you're away. Flex, strategize, and dominate in your **Circle** — a private combat group that only you control.

## 🚀 Features

### 👥 Friends-Only Circles
- Invite-only gameplay (QR or invite link)
- Each Circle is capped (e.g., 10 members max)
- Multiple Circles per user allowed (like guilds)

### ⚔️ Idle Combat System
- Scheduled auto-battles (e.g., every 30min)
- Custom loadouts (offense, defense, support roles)
- Idle battle logs and rewards viewable later

### 🧠 Team Synergy
- Combo bonuses based on Circle composition
- Dual-ultimate skills unlocked by synergy

### 🗓️ Weekly Events
- Boss fights for cooperative reward hunts
- Hidden events unlocked by group behavior (e.g. all online at same time)

### 📢 Social Layer
- Private feed: "Shiro hit level 30!"
- Emoji reacts, comments, and 1v1 "challenge" buttons

### 🎁 Circle Forge
- Risk gear for co-forging
- One-time trade+fusion mechanic

## 🔧 Setup Instructions

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Firebase setup (requires CLI installed)
firebase login
firebase init hosting firestore
firebase deploy
```

## 🔐 Tech Stack

- **Frontend**: React + Vite (PWA ready)
- **Styling**: Tailwind CSS
- **Backend**: Firebase Firestore + Firebase Auth
- **Hosting**: Firebase Hosting (PWA deploy)
- **Realtime**: Firestore listeners + IndexedDB cache
- **Offline**: LocalStorage + Service Worker
- **Auth**: Email/Phone/Google + Invite Code

## 📱 PWA Features

This app is designed to work as a Progressive Web App (PWA) with:
- Offline functionality
- App-like experience on mobile devices
- Push notifications (future feature)
- Automatic updates

## 🧪 Future Plans

- Offline battle simulation using local cache
- Ghost PvP battles when friends are offline
- Customizable avatars with pixel skins
- Weekly ranked Circles
- Discord Rich Presence support

💜 Made by Rylee + Shiro