# FORMATION LAB - LAUNCH IN ONE DAY

**Stack:** Firebase + Heroku + Google Play + vipspot.net

## Quick Start (Copy/Paste Ready)

### 1. Firebase Setup (5 mins)
1. Create project: https://console.firebase.google.com
2. Enable: Auth (Email/Google), Firestore, Storage, Analytics
3. Copy your config keys

### 2. Install & Configure (10 mins)

```bash
npm install firebase
```

Create `scripts/firebase-config.js`:
```javascript
import { initializeApp } from 'firebase/app';
import { getAuth, getFirestore, getStorage, getAnalytics } from 'firebase/auth';

const config = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

const app = initializeApp(config);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
```

### 3. Copy Firebase Modules (Already Coded)

Use the code from docs/ONE_DAY_LAUNCH.md for:
- `scripts/firebase-auth.js` - Login/signup
- `scripts/firebase-db.js` - Save/load formations
- `scripts/ui-auth.js` - Auth UI
- `scripts/ui-cloud.js` - Cloud UI

### 4. Add Heroku Backend (15 mins)

Create `backend/server.js` (from ONE_DAY_LAUNCH.md)

Deploy:
```bash
cd backend
heroku create formation-lab-api
heroku config:set STRIPE_SECRET_KEY=sk_live_...
heroku config:set STRIPE_WEBHOOK_SECRET=whsec_...
git push heroku main
```

### 5. Stripe Setup (10 mins)

1. Create account: https://stripe.com
2. Create product: $9.99/month
3. Get API keys
4. Add webhook: `https://formation-lab-api.herokuapp.com/webhook`

### 6. Build Android APK (20 mins)

```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest=https://vipspot.net/manifest.json
bubblewrap build
```

Sign APK (from ONE_DAY_LAUNCH.md instructions)

### 7. Google Play Store (30 mins)

1. Create developer account ($25): https://play.google.com/console
2. Create app listing
3. Upload APK
4. Submit for review (1-3 days)

### 8. Deploy to vipspot.net (5 mins)

```bash
npm run build
# Upload dist/ to your host
```

## That's it. You're live.

Money starts flowing in after Play Store approval (24-72 hours).

**Next steps:** Monitor analytics, fix bugs, add features.

---

## File Structure (Don't Add Anything Else)

```
Formation Lab/
├── scripts/
│   ├── main.js (existing)
│   ├── firebase-config.js (NEW)
│   ├── firebase-auth.js (NEW)
│   ├── firebase-db.js (NEW)
│   ├── ui-auth.js (NEW)
│   ├── ui-cloud.js (NEW)
│   └── ... (existing)
├── backend/
│   ├── server.js (NEW)
│   ├── package.json (NEW)
│   └── Procfile (NEW)
├── dist/ (build output)
├── index.html (update with new buttons)
├── LAUNCH.md (this file)
└── ... (existing)
```

---

## Key Features

**Free:** 5 formations, PNG export
**Pro ($9.99/mo):** Unlimited, PDF export, remove watermark

**Complete in one day. Get paid tomorrow.**
