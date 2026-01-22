# 🎯 Mainstream Movement Website - Complete File Structure Guide

## 📦 All Files Provided

You now have all the files needed to build your website. Here's what each file does and where it goes:

### Core Website Files
1. **mainstream-movement-site.jsx** - The main React component with all website features
2. **api-contact.js** - API route for contact form (sends to jules@gomainstream.org)
3. **api-pledge.js** - API route for pledge submissions

### Configuration Files
4. **package.json** - Node.js dependencies and scripts
5. **tailwind.config.js** - Tailwind CSS configuration with custom animations
6. **postcss.config.js** - PostCSS configuration for Tailwind
7. **next.config.js** - Next.js framework configuration

### Project Files
8. **.gitignore** - Files to exclude from version control
9. **.env.local.example** - Template for environment variables

### Documentation
10. **README.md** - Comprehensive documentation
11. **QUICKSTART.md** - Fast setup guide

---

## 🗂️ Complete Project Structure

Create this exact folder structure:

```
mainstream-movement-website/
│
├── 📁 pages/
│   ├── 📁 api/
│   │   ├── 📄 contact.js          ← Copy from api-contact.js
│   │   └── 📄 pledge.js           ← Copy from api-pledge.js
│   ├── 📄 _app.js                 ← Create (see below)
│   └── 📄 index.js                ← Create (see below)
│
├── 📁 components/
│   └── 📄 MainstreamMovement.jsx  ← Copy from mainstream-movement-site.jsx
│
├── 📁 styles/
│   └── 📄 globals.css             ← Create (see below)
│
├── 📁 public/
│   └── 📁 images/                 ← Add your project images here
│       ├── smart-connect-app.jpg  (Phone app screenshot)
│       ├── mobility-solution.jpg   (Phone with car)
│       └── community-hub.jpg       (Social/sports groups)
│
├── 📄 package.json                ← Copy as-is
├── 📄 tailwind.config.js          ← Copy as-is
├── 📄 postcss.config.js           ← Copy as-is
├── 📄 next.config.js              ← Copy as-is
├── 📄 .gitignore                  ← Copy as-is
├── 📄 .env.local.example          ← Copy and rename to .env.local
├── 📄 README.md                   ← Copy as-is
└── 📄 QUICKSTART.md               ← Copy as-is
```

---

## 🚀 Step-by-Step Setup

### Step 1: Create Project Directory
```bash
mkdir mainstream-movement-website
cd mainstream-movement-website
```

### Step 2: Create Folders
```bash
mkdir -p pages/api components styles public/images
```

### Step 3: Copy Files to Correct Locations

**Root Directory Files:**
- Copy `package.json` to root
- Copy `tailwind.config.js` to root
- Copy `postcss.config.js` to root
- Copy `next.config.js` to root
- Copy `.gitignore` to root
- Copy `README.md` to root
- Copy `QUICKSTART.md` to root
- Copy `.env.local.example` to root and rename to `.env.local`

**Component File:**
- Copy `mainstream-movement-site.jsx` to `components/MainstreamMovement.jsx`

**API Files:**
- Copy `api-contact.js` to `pages/api/contact.js`
- Copy `api-pledge.js` to `pages/api/pledge.js`

### Step 4: Create New Files

**Create `pages/_app.js`:**
```javascript
import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

**Create `pages/index.js`:**
```javascript
import MainstreamMovement from '../components/MainstreamMovement'

export default function Home() {
  return <MainstreamMovement />
}
```

**Create `styles/globals.css`:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
}
```

### Step 5: Install Dependencies
```bash
npm install
```

### Step 6: Run Development Server
```bash
npm run dev
```

Visit: **http://localhost:3000** 🎉

---

## 🎨 Features Included

### ✅ Working Out of the Box:
- Modern responsive design
- Dark/Light mode toggle
- 4 color themes (Blue, Green, Purple, Orange)
- Smooth animations and transitions
- Projects section with accordions
- Contact form (logs to console)
- Donation/Pledge system (logs to console)
- Mobile menu
- Floating animations
- Scroll-triggered fade-ins

### 🔧 Needs Configuration:
- **Email sending** - Configure in API routes (see README.md)
- **Stripe payments** - Add API keys and implement checkout
- **Project images** - Replace icon placeholders with real images
- **Custom content** - Update company info, project details, etc.

---

## 💡 Quick Customization

### Change Contact Email
Already set to `jules@gomainstream.org` in both API routes.

### Change Colors
Edit `themes` object in `components/MainstreamMovement.jsx`:
```javascript
const themes = {
  blue: { ... },
  green: { ... },
  // Add your own theme here
}
```

### Add/Edit Projects
Edit `projects` array in `components/MainstreamMovement.jsx`:
```javascript
const projects = [
  {
    id: 1,
    title: "Your Project",
    shortDesc: "Brief description",
    fullDesc: "Detailed description",
    icon: <YourIcon />,
    status: "Active"
  }
]
```

### Update Company Info
Search for these sections in the component:
- Contact section
- Footer section
- About section

---

## 🌐 Deployment Checklist

Before deploying to production:

- [ ] Add real project images to `/public/images/`
- [ ] Configure email service (Resend, SendGrid, or SMTP)
- [ ] Set up Stripe with live API keys
- [ ] Update `.env.local` with production keys
- [ ] Test all forms thoroughly
- [ ] Review and customize all content
- [ ] Set up custom domain (gomainstream.org)
- [ ] Enable HTTPS
- [ ] Test on mobile devices
- [ ] Set up error monitoring (optional: Sentry)
- [ ] Add Google Analytics (optional)

---

## 🚀 Recommended Deployment

**Vercel** (Easiest for Next.js):
1. Push code to GitHub
2. Import repo at vercel.com
3. Add environment variables
4. Deploy!

**Alternative: Netlify**
1. Push code to GitHub
2. Import repo at netlify.com
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Add environment variables
6. Deploy!

---

## 📧 Email Service Setup (Choose One)

### Option 1: Resend (Recommended)
```bash
npm install resend
```
Add to `.env.local`:
```
RESEND_API_KEY=re_your_key
```

### Option 2: SendGrid
```bash
npm install @sendgrid/mail
```
Add to `.env.local`:
```
SENDGRID_API_KEY=your_key
```

### Option 3: SMTP (Nodemailer)
```bash
npm install nodemailer
```
Add to `.env.local`:
```
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_password
```

See detailed implementation in `api-contact.js` and `api-pledge.js` files.

---

## 💳 Stripe Setup

```bash
npm install @stripe/stripe-js stripe
```

Add to `.env.local`:
```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

See README.md for complete Stripe integration example.

---

## 🎯 Key Features Summary

1. **Responsive Design** - Works on all devices
2. **Dark Mode** - Full theme switching
3. **Color Themes** - 4 pre-built themes
4. **Animations** - Smooth micro-interactions
5. **Projects Showcase** - Interactive accordions
6. **Donation System** - Stripe-ready
7. **Contact Forms** - Email integration ready
8. **SEO Optimized** - Next.js benefits
9. **Fast Performance** - Production-ready
10. **Easy to Customize** - Clean code structure

---

## 📞 Support & Questions

**Email:** jules@gomainstream.org  
**Website:** gomainstream.org

---

## 🎉 You're All Set!

Everything you need is included. Follow the steps above, and you'll have a professional, modern website running in minutes.

**Good luck with Mainstream Movement! 🚀**
