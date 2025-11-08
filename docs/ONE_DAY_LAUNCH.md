# Formation Lab - ONE DAY LAUNCH PLAN
**Speed Run Edition - Google Play Store Focus**

**Domain:** vipspot.net
**Backend:** Heroku
**Infrastructure:** Firebase (Auth, Firestore, Storage, Analytics)
**Target:** Google Play Store ONLY (fuck iOS for now)

---

## Pre-Work (Do This First - 30 mins)

### Firebase Setup
```bash
npm install firebase
```

**Firebase Console (https://console.firebase.google.com):**
- [ ] Create new Firebase project: "formation-lab-prod"
- [ ] Enable Authentication → Email/Password + Google Sign-In
- [ ] Create Firestore Database (production mode)
- [ ] Enable Firebase Storage
- [ ] Enable Google Analytics
- [ ] Get config keys

**Heroku Setup:**
- [ ] Login to Heroku
- [ ] Create new app: `formation-lab-api`
- [ ] Note down app URL

---

## HOUR 1-2: Firebase Integration (7am-9am)

### Firebase Config & Auth (60 mins)

**Create `scripts/firebase-config.js`:**
```javascript
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, where, updateDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAnalytics, logEvent } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
export const googleProvider = new GoogleAuthProvider();
```

**Create `scripts/firebase-auth.js`:**
```javascript
import { auth, googleProvider, analytics } from './firebase-config.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { logEvent } from 'firebase/analytics';

export const firebaseAuth = {
  currentUser: null,

  async signUp(email, password) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      logEvent(analytics, 'sign_up', { method: 'email' });
      return { user: result.user, error: null };
    } catch (error) {
      return { user: null, error: error.message };
    }
  },

  async signIn(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      logEvent(analytics, 'login', { method: 'email' });
      return { user: result.user, error: null };
    } catch (error) {
      return { user: null, error: error.message };
    }
  },

  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      logEvent(analytics, 'login', { method: 'google' });
      return { user: result.user, error: null };
    } catch (error) {
      return { user: null, error: error.message };
    }
  },

  async signOut() {
    try {
      await signOut(auth);
      logEvent(analytics, 'logout');
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  },

  onAuthChange(callback) {
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
      callback(user);
    });
  }
};
```

### Firestore Database (30 mins)

**Create `scripts/firebase-db.js`:**
```javascript
import { db, auth, storage, analytics } from './firebase-config.js';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, updateDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { logEvent } from 'firebase/analytics';

export const firebaseDB = {
  async saveFormation(title, formationData) {
    const user = auth.currentUser;
    if (!user) throw new Error('Not logged in');

    // Check if free user has hit limit
    const userFormations = await this.getFormations();
    const isPro = await this.isPro();

    if (!isPro && userFormations.length >= 5) {
      throw new Error('Free tier limited to 5 formations. Upgrade to Pro!');
    }

    try {
      // Generate thumbnail
      const thumbnail = await this.generateThumbnail();
      const thumbnailUrl = await this.uploadThumbnail(thumbnail);

      const docRef = await addDoc(collection(db, 'formations'), {
        userId: user.uid,
        title: title,
        data: formationData,
        thumbnail: thumbnailUrl,
        isPublic: false,
        shareToken: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      logEvent(analytics, 'formation_saved');
      return { id: docRef.id, error: null };
    } catch (error) {
      return { id: null, error: error.message };
    }
  },

  async getFormations() {
    const user = auth.currentUser;
    if (!user) return [];

    try {
      const q = query(
        collection(db, 'formations'),
        where('userId', '==', user.uid),
        orderBy('updatedAt', 'desc')
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting formations:', error);
      return [];
    }
  },

  async deleteFormation(id) {
    try {
      await deleteDoc(doc(db, 'formations', id));
      logEvent(analytics, 'formation_deleted');
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  },

  async shareFormation(formationId) {
    const shareToken = this.generateShareToken();

    try {
      await updateDoc(doc(db, 'formations', formationId), {
        isPublic: true,
        shareToken: shareToken,
        updatedAt: serverTimestamp()
      });

      logEvent(analytics, 'formation_shared');
      return {
        shareUrl: `https://vipspot.net/?share=${shareToken}`,
        error: null
      };
    } catch (error) {
      return { shareUrl: null, error: error.message };
    }
  },

  async loadSharedFormation(shareToken) {
    try {
      const q = query(
        collection(db, 'formations'),
        where('shareToken', '==', shareToken),
        where('isPublic', '==', true)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return { data: null, error: 'Formation not found' };
      }

      return {
        data: { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() },
        error: null
      };
    } catch (error) {
      return { data: null, error: error.message };
    }
  },

  async uploadThumbnail(blob) {
    const user = auth.currentUser;
    const fileName = `thumbnails/${user.uid}/${Date.now()}.png`;
    const storageRef = ref(storage, fileName);

    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  },

  async generateThumbnail() {
    const svgElement = document.querySelector('.flab-field');
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    return new Promise((resolve) => {
      img.onload = () => {
        canvas.width = 400;
        canvas.height = 600;
        ctx.drawImage(img, 0, 0, 400, 600);
        canvas.toBlob((blob) => resolve(blob), 'image/png');
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    });
  },

  generateShareToken() {
    return Math.random().toString(36).substr(2, 9);
  },

  async isPro() {
    const user = auth.currentUser;
    if (!user) return false;

    try {
      const q = query(
        collection(db, 'subscriptions'),
        where('userId', '==', user.uid),
        where('status', '==', 'active')
      );
      const querySnapshot = await getDocs(q);

      return !querySnapshot.empty;
    } catch (error) {
      return false;
    }
  }
};
```

---

## HOUR 3-4: UI Integration (9am-11am)

### Auth UI (60 mins)

**Add to `index.html` (before closing `</body>`):**
```html
<!-- Auth Modal -->
<div id="authModal" class="modal" style="display:none;">
  <div class="modal-content">
    <span class="close">&times;</span>
    <h2 id="authTitle">Sign In</h2>

    <div id="authForm">
      <input type="email" id="authEmail" placeholder="Email" />
      <input type="password" id="authPassword" placeholder="Password" />
      <button id="authSubmit">Sign In</button>
      <button id="googleSignIn">Sign in with Google</button>
      <p id="authToggle">Don't have an account? <a href="#">Sign up</a></p>
      <p id="authError" style="color:red;"></p>
    </div>
  </div>
</div>

<!-- Formations Modal -->
<div id="formationsModal" class="modal" style="display:none;">
  <div class="modal-content">
    <span class="close">&times;</span>
    <h2>My Formations</h2>
    <div id="formationsList"></div>
  </div>
</div>

<!-- Upgrade Modal -->
<div id="upgradeModal" class="modal" style="display:none;">
  <div class="modal-content">
    <span class="close">&times;</span>
    <h2>Upgrade to Pro</h2>
    <p>Unlock unlimited formations, PDF exports, and more!</p>
    <div class="pricing">
      <h3>$9.99/month</h3>
      <button id="upgradePro">Upgrade Now</button>
    </div>
  </div>
</div>
```

**Create `scripts/ui-auth.js`:**
```javascript
import { firebaseAuth } from './firebase-auth.js';
import { firebaseDB } from './firebase-db.js';

let isSignUp = false;

export function initAuthUI() {
  const modal = document.getElementById('authModal');
  const authSubmit = document.getElementById('authSubmit');
  const googleSignIn = document.getElementById('googleSignIn');
  const authToggle = document.getElementById('authToggle');
  const authError = document.getElementById('authError');

  // Show modal if not logged in
  firebaseAuth.onAuthChange((user) => {
    if (user) {
      modal.style.display = 'none';
      updateToolbarForUser(user);
    } else {
      // Show auth modal on first load
      // modal.style.display = 'block';
    }
  });

  authSubmit.addEventListener('click', async () => {
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;

    let result;
    if (isSignUp) {
      result = await firebaseAuth.signUp(email, password);
    } else {
      result = await firebaseAuth.signIn(email, password);
    }

    if (result.error) {
      authError.textContent = result.error;
    } else {
      modal.style.display = 'none';
      authError.textContent = '';
    }
  });

  googleSignIn.addEventListener('click', async () => {
    const result = await firebaseAuth.signInWithGoogle();
    if (result.error) {
      authError.textContent = result.error;
    } else {
      modal.style.display = 'none';
      authError.textContent = '';
    }
  });

  authToggle.addEventListener('click', (e) => {
    e.preventDefault();
    isSignUp = !isSignUp;
    document.getElementById('authTitle').textContent = isSignUp ? 'Sign Up' : 'Sign In';
    authSubmit.textContent = isSignUp ? 'Sign Up' : 'Sign In';
    authToggle.innerHTML = isSignUp
      ? 'Already have an account? <a href="#">Sign in</a>'
      : 'Don\'t have an account? <a href="#">Sign up</a>';
  });

  // Close modals
  document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
      closeBtn.closest('.modal').style.display = 'none';
    });
  });
}

function updateToolbarForUser(user) {
  // Add user profile button, logout, etc.
  console.log('User logged in:', user.email);
}
```

### Cloud Save UI (60 mins)

**Add buttons to toolbar:**
```html
<!-- Add to your toolbar -->
<button id="btnSaveCloud" title="Save to Cloud">☁️ Save</button>
<button id="btnMyFormations" title="My Formations">📁 My Formations</button>
<button id="btnAccount" title="Account">👤 Account</button>
```

**Create `scripts/ui-cloud.js`:**
```javascript
import { firebaseDB } from './firebase-db.js';
import { firebaseAuth } from './firebase-auth.js';

export function initCloudUI() {
  const btnSaveCloud = document.getElementById('btnSaveCloud');
  const btnMyFormations = document.getElementById('btnMyFormations');
  const formationsModal = document.getElementById('formationsModal');
  const upgradeModal = document.getElementById('upgradeModal');

  btnSaveCloud.addEventListener('click', async () => {
    if (!firebaseAuth.currentUser) {
      alert('Please sign in to save formations');
      document.getElementById('authModal').style.display = 'block';
      return;
    }

    const title = prompt('Formation name:');
    if (!title) return;

    const formationData = captureFormationData();

    try {
      await firebaseDB.saveFormation(title, formationData);
      alert('Formation saved!');
    } catch (error) {
      if (error.message.includes('Free tier')) {
        upgradeModal.style.display = 'block';
      } else {
        alert('Error: ' + error.message);
      }
    }
  });

  btnMyFormations.addEventListener('click', async () => {
    if (!firebaseAuth.currentUser) {
      alert('Please sign in');
      document.getElementById('authModal').style.display = 'block';
      return;
    }

    const formations = await firebaseDB.getFormations();
    displayFormations(formations);
    formationsModal.style.display = 'block';
  });
}

function captureFormationData() {
  // Capture current formation state
  return {
    players: [...document.querySelectorAll('.player')].map(p => ({
      id: p.id,
      x: p.getAttribute('cx'),
      y: p.getAttribute('cy'),
      number: p.querySelector('text')?.textContent
    })),
    passes: window.FLAB?.passes || [],
    orientation: window.FLAB?.orientation || 'portrait'
  };
}

function displayFormations(formations) {
  const list = document.getElementById('formationsList');
  list.innerHTML = '';

  if (formations.length === 0) {
    list.innerHTML = '<p>No saved formations yet.</p>';
    return;
  }

  formations.forEach(formation => {
    const item = document.createElement('div');
    item.className = 'formation-item';
    item.innerHTML = `
      <img src="${formation.thumbnail}" alt="${formation.title}" />
      <h3>${formation.title}</h3>
      <button onclick="loadFormation('${formation.id}')">Load</button>
      <button onclick="shareFormation('${formation.id}')">Share</button>
      <button onclick="deleteFormation('${formation.id}')">Delete</button>
    `;
    list.appendChild(item);
  });
}

window.loadFormation = async (id) => {
  const formations = await firebaseDB.getFormations();
  const formation = formations.find(f => f.id === id);
  if (formation) {
    applyFormationData(formation.data);
    document.getElementById('formationsModal').style.display = 'none';
  }
};

window.shareFormation = async (id) => {
  const { shareUrl, error } = await firebaseDB.shareFormation(id);
  if (error) {
    alert('Error: ' + error);
  } else {
    navigator.clipboard.writeText(shareUrl);
    alert('Share link copied to clipboard!');
  }
};

window.deleteFormation = async (id) => {
  if (confirm('Delete this formation?')) {
    await firebaseDB.deleteFormation(id);
    document.getElementById('btnMyFormations').click(); // Refresh list
  }
};

function applyFormationData(data) {
  // Load formation data back into the app
  // TODO: Implement based on your app's state management
  console.log('Loading formation:', data);
}
```

---

## HOUR 5: Heroku Backend for Payments (11am-12pm)

### Stripe Checkout API (60 mins)

**Create `backend/server.js` (Node.js/Express on Heroku):**
```javascript
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const admin = require('firebase-admin');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({ origin: 'https://vipspot.net' }));

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
});

const db = admin.firestore();

// Create Checkout Session
app.post('/create-checkout-session', async (req, res) => {
  const { userId, priceId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: 'https://vipspot.net/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://vipspot.net',
      client_reference_id: userId,
      metadata: { userId }
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stripe Webhook
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        await db.collection('subscriptions').add({
          userId: session.metadata.userId,
          stripeCustomerId: session.customer,
          stripeSubscriptionId: session.subscription,
          status: 'active',
          plan: 'pro',
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        break;

      case 'customer.subscription.deleted':
        const subscription = event.data.object;
        const sub = await db.collection('subscriptions')
          .where('stripeSubscriptionId', '==', subscription.id)
          .get();

        if (!sub.empty) {
          await sub.docs[0].ref.update({ status: 'canceled' });
        }
        break;
    }

    res.json({ received: true });
  } catch (error) {
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

**Deploy to Heroku:**
```bash
# In backend/ folder
git init
heroku git:remote -a formation-lab-api
git add .
git commit -m "Initial backend"
git push heroku main

# Set env vars
heroku config:set STRIPE_SECRET_KEY=sk_live_...
heroku config:set STRIPE_WEBHOOK_SECRET=whsec_...
heroku config:set FIREBASE_SERVICE_ACCOUNT='{"type":"service_account",...}'
```

**Frontend integration:**
```javascript
// scripts/payments.js
export async function upgradeToProNow() {
  const user = firebaseAuth.currentUser;
  if (!user) return;

  const response = await fetch('https://formation-lab-api.herokuapp.com/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: user.uid,
      priceId: 'price_...' // Your Stripe price ID
    })
  });

  const { url } = await response.json();
  window.location.href = url;
}

document.getElementById('upgradePro').addEventListener('click', upgradeToProNow);
```

---

## HOUR 6: Google Play Store Setup (12pm-1pm)

### Build Android App (PWA → TWA)

**Install Bubblewrap:**
```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest=https://vipspot.net/manifest.json
```

**Update `manifest.json` in your web app:**
```json
{
  "name": "Formation Lab",
  "short_name": "FormationLab",
  "description": "Design youth soccer drills with drag, pass arrows, and instant exports",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1a2332",
  "theme_color": "#ffd166",
  "orientation": "any",
  "icons": [
    {
      "src": "/assets/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/assets/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**Create icons (use Canva):**
- 192x192 → `/assets/icon-192.png`
- 512x512 → `/assets/icon-512.png`

**Build APK:**
```bash
bubblewrap build
```

**Sign APK:**
```bash
# Generate keystore
keytool -genkey -v -keystore formation-lab.keystore -alias formation-lab -keyalg RSA -keysize 2048 -validity 10000

# Sign
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore formation-lab.keystore app-release-unsigned.apk formation-lab

# Align
zipalign -v 4 app-release-unsigned.apk formation-lab-release.apk
```

---

## HOUR 7: Google Play Console (1pm-2pm)

### Upload to Play Store

1. **Create Developer Account:**
   - Go to https://play.google.com/console
   - Pay $25 one-time fee
   - Fill out account details

2. **Create App:**
   - Click "Create App"
   - Name: "Formation Lab"
   - Default language: English
   - App type: App
   - Category: Sports
   - Free app

3. **App Content:**
   - Privacy Policy URL: `https://vipspot.net/privacy`
   - App access: All features available without restrictions
   - Ads: No
   - Target audience: Ages 13+
   - Content rating: Fill questionnaire (should be E for Everyone)

4. **Store Listing:**
   - Short description (80 chars): "Design soccer drills with drag & drop, pass arrows, instant PNG/PDF exports"
   - Full description (4000 chars): Write compelling copy about features
   - Screenshots: Take 4-8 screenshots on Android device
   - Feature graphic: 1024x500 banner image
   - App icon: 512x512 high-res icon

5. **Upload APK:**
   - Production → Create release
   - Upload `formation-lab-release.apk`
   - Release name: v1.0.0
   - Release notes: "Initial release"

6. **Pricing:**
   - Free to download
   - In-app purchases: Yes (add your Pro subscription)

7. **Submit for Review:**
   - Click "Send for review"
   - Wait 1-3 days for approval

---

## HOUR 8: Polish & Testing (2pm-3pm)

### Quick Wins

**Add to `index.html`:**
```html
<!-- Add Firebase + Auth imports -->
<script type="module">
  import { initAuthUI } from './scripts/ui-auth.js';
  import { initCloudUI } from './scripts/ui-cloud.js';

  window.addEventListener('DOMContentLoaded', () => {
    initAuthUI();
    initCloudUI();

    // Check for share link
    const params = new URLSearchParams(window.location.search);
    const shareToken = params.get('share');
    if (shareToken) {
      loadSharedFormation(shareToken);
    }
  });

  async function loadSharedFormation(token) {
    const { data, error } = await firebaseDB.loadSharedFormation(token);
    if (data) {
      applyFormationData(data.data);
    } else {
      alert('Formation not found');
    }
  }
</script>
```

**Add CSS for modals:**
```css
.modal {
  position: fixed;
  z-index: 10000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: #1a2332;
  padding: 30px;
  border-radius: 10px;
  max-width: 500px;
  width: 90%;
  color: white;
}

.modal-content input {
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border-radius: 5px;
  border: none;
  font-size: 16px;
}

.modal-content button {
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border-radius: 5px;
  border: none;
  background: #ffd166;
  color: #1a2332;
  font-weight: bold;
  cursor: pointer;
  font-size: 16px;
}

.modal-content button:hover {
  background: #f0c419;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.formation-item {
  border: 1px solid #333;
  padding: 15px;
  margin: 10px 0;
  border-radius: 5px;
}

.formation-item img {
  width: 100%;
  border-radius: 5px;
  margin-bottom: 10px;
}

.formation-item button {
  width: auto;
  padding: 8px 15px;
  margin: 5px;
}
```

---

## HOUR 9: Deploy & Launch (3pm-4pm)

### Deploy to vipspot.net

**If using Vercel/Netlify:**
```bash
# Vercel
npm install -g vercel
vercel --prod

# Point vipspot.net domain to Vercel in DNS settings
```

**If using your own server:**
```bash
# Build
npm run build

# Upload dist/ to vipspot.net via FTP/SSH
```

### Post-Launch Checklist

- [ ] Test on Android device: https://vipspot.net
- [ ] Sign up → Save formation → Load → Share → works?
- [ ] Free tier limit (5 formations) working?
- [ ] Upgrade button opens Stripe checkout?
- [ ] Payment test mode works?
- [ ] Switch Stripe to live mode
- [ ] Test live payment
- [ ] APK installs on Android?
- [ ] Share on Twitter/LinkedIn
- [ ] Post in r/bootroom, r/SoccerCoaching

---

## Final Setup Checklist

### Firebase (30 mins)
- [ ] Project created
- [ ] Auth enabled (Email + Google)
- [ ] Firestore database created
- [ ] Storage enabled
- [ ] Security rules set
- [ ] Config added to app

### Heroku Backend (30 mins)
- [ ] App created
- [ ] Stripe integration
- [ ] Webhook endpoint
- [ ] Env vars set
- [ ] Deployed

### Stripe (20 mins)
- [ ] Account created
- [ ] Products created ($9.99/mo)
- [ ] API keys copied
- [ ] Webhook configured
- [ ] Test mode → Live mode

### Google Play (60 mins)
- [ ] Developer account ($25)
- [ ] App created
- [ ] Store listing complete
- [ ] APK uploaded
- [ ] Submitted for review

### vipspot.net (20 mins)
- [ ] DNS pointed correctly
- [ ] SSL certificate working
- [ ] Firebase config updated for domain
- [ ] Deployed and live

---

## Pricing Strategy

**Free Tier:**
- Up to 5 saved formations
- PNG export only
- Formation Lab watermark
- Share formations

**Pro Tier - $9.99/month:**
- Unlimited formations
- PDF export (high quality)
- Remove watermark
- Priority support
- Template library access (coming soon)

---

## Marketing (POST-LAUNCH)

### Week 1:
- [ ] Post on Reddit: r/bootroom, r/SoccerCoaching (read rules first!)
- [ ] Twitter thread about building in public
- [ ] LinkedIn post for coaches
- [ ] Facebook groups: Soccer coaching communities
- [ ] Email to local youth soccer clubs

### Week 2:
- [ ] Product Hunt launch
- [ ] YouTube demo video
- [ ] Blog post: "How I built Formation Lab"
- [ ] Reach out to soccer coaching YouTubers

### Week 3-4:
- [ ] Google Ads ($100 test budget)
- [ ] Facebook Ads targeting coaches
- [ ] Content marketing (drill ideas blog)
- [ ] Build template library

---

## Success Metrics (First 30 Days)

**Day 1-7:**
- 100 signups
- 10 formations created
- 1 paid user (🎉)

**Day 8-14:**
- 500 signups
- 50 formations created
- 5 paid users ($50 MRR)

**Day 15-30:**
- 2,000 signups
- 200 formations created
- 20 paid users ($200 MRR)

---

## Troubleshooting

**Firebase not connecting?**
- Check console for errors
- Verify API keys
- Check Firebase security rules

**Stripe not working?**
- Verify webhook URL in Stripe dashboard
- Check Heroku logs: `heroku logs --tail -a formation-lab-api`
- Test with Stripe CLI: `stripe listen --forward-to localhost:3000/webhook`

**APK not installing?**
- Enable "Install from unknown sources" on Android
- Check signing: `jarsigner -verify formation-lab-release.apk`

**Payment not activating Pro?**
- Check Firestore for subscription record
- Check Heroku logs for webhook errors
- Verify userId matches

---

## You're Done! 🎉

**By end of day you'll have:**
- ✅ Live web app on vipspot.net
- ✅ Firebase auth + cloud save
- ✅ Stripe payments working
- ✅ Free tier limits enforced
- ✅ Android APK submitted to Play Store
- ✅ Ready to make money

**Tomorrow:**
- Monitor analytics
- Fix bugs
- Add more features
- Market the shit out of it

**Let's fucking GO! 💰🚀**
