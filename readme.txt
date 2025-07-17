# Idle Circle - Friends-Only Idle RPG Arena

Idle Circle is a cross-platform, privacy-focused **idle RPG web app** designed for small, invite-only friend groups. You and your friends build a squad, assign builds, and let battles happen automatically while you’re away. Flex, strategize, and dominate in your **Circle** — a private combat group that only you control.

---

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
- Private feed: “Shiro hit level 30!”
- Emoji reacts, comments, and 1v1 “challenge” buttons

### 🎁 Circle Forge
- Risk gear for co-forging
- One-time trade+fusion mechanic

---

## 📱 Platforms

- ✅ Android (via PWA install or browser)
- ✅ iOS (PWA install or Safari/Chrome)
- ✅ Desktop (via browser)

---

## 🔐 Tech Stack

| Layer       | Stack                            |
|-------------|----------------------------------|
| Frontend    | React + Vite (PWA ready)         |
| Styling     | Tailwind CSS                     |
| Backend     | Firebase Firestore + Firebase Auth |
| Hosting     | Firebase Hosting (PWA deploy)    |
| Realtime    | Firestore listeners + IndexedDB cache |
| Offline     | LocalStorage + Service Worker    |
| Auth        | Email/Phone/Google + Invite Code |

---

## 🗂️ Workspace Layout

idle-circle/
│
├── public/ # Static assets and manifest
│ ├── icons/ # App icons for PWA
│ └── index.html
│
├── src/
│ ├── assets/ # Logo, UI, background images
│ ├── components/ # React components (UI/UX)
│ ├── hooks/ # Custom React hooks (e.g., useAuth)
│ ├── pages/ # Views like Dashboard, Circle, Forge
│ ├── services/ # Firebase and API logic
│ ├── utils/ # Helpers (time formatters, battle sim)
│ ├── App.tsx # App entry
│ └── main.tsx # Main render file
│
├── .firebaserc # Firebase project config
├── firebase.json # Hosting rules
├── firestore.rules # Firestore security rules
├── tailwind.config.js # Tailwind CSS config
├── vite.config.ts # Vite build config
├── package.json
├── tsconfig.json
└── README.md

yaml
Copy
Edit

---

## 🔧 Setup Instructions

```bash
# Clone repo
git clone https://github.com/yourname/idle-circle.git
cd idle-circle

# Install dependencies
npm install

# Start development server
npm run dev

# Firebase setup (requires CLI installed)
firebase login
firebase init hosting firestore
firebase deploy
🧪 Future Plans
 Offline battle simulation using local cache

 Ghost PvP battles when friends are offline

 Customizable avatars with pixel skins

 Weekly ranked Circles

 Discord Rich Presence support

💜 Made by Rylee + Shiro