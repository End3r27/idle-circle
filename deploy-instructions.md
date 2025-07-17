# Deploy Instructions

## Option 1: Vercel (Recommended)
1. Push code to GitHub
2. Go to https://vercel.com
3. Import project
4. Auto-deploys on push

## Option 2: Netlify
1. Build: `npm run build`
2. Go to https://netlify.com
3. Drag `dist` folder to deploy

## Option 3: Firebase Hosting
1. `firebase login`
2. `firebase init hosting`
3. `firebase deploy`

## Option 4: ngrok (Local tunneling)
1. Install ngrok
2. `npm run dev`
3. `ngrok http 5173`
4. Use the public URL

## Firebase Config Needed
Update `src/services/firebase.ts` with your Firebase project settings from https://console.firebase.google.com