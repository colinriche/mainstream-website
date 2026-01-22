# Mainstream Movement Website - Quick Start Guide

This guide will help you get the website up and running in minutes.

## ⚡ Quick Setup (5 Minutes)

### 1. Project Structure Setup

Create your project directory and organize files:

```bash
mkdir mainstream-movement-website
cd mainstream-movement-website
```

Create this folder structure:
```
mainstream-movement-website/
├── pages/
│   ├── api/
│   │   ├── contact.js      (from api-contact.js)
│   │   └── pledge.js       (from api-pledge.js)
│   ├── _app.js
│   └── index.js
├── components/
│   └── MainstreamMovement.jsx  (from mainstream-movement-site.jsx)
├── styles/
│   └── globals.css
├── public/
│   └── images/             (for project images)
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
├── .gitignore
├── .env.local.example
└── README.md
```

### 2. File Setup

**pages/_app.js:**
```javascript
import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

**pages/index.js:**
```javascript
import MainstreamMovement from '../components/MainstreamMovement'

export default function Home() {
  return <MainstreamMovement />
}
```

**components/MainstreamMovement.jsx:**
- Copy the entire content from `mainstream-movement-site.jsx`

**pages/api/contact.js:**
- Copy from `api-contact.js`

**pages/api/pledge.js:**
- Copy from `api-pledge.js`

**styles/globals.css:**
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

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 🎯 What Works Out of the Box

✅ Complete website with all sections  
✅ Dark mode toggle  
✅ 4 color themes (Blue, Green, Purple, Orange)  
✅ Responsive design  
✅ Smooth animations  
✅ Project accordions  
✅ Contact form (logs to console)  
✅ Donation/Pledge forms (logs to console)  

## 🔧 What Needs Configuration

### Email Sending (Required for Production)

**Option 1: Resend (Easiest - Recommended)**

1. Sign up at [resend.com](https://resend.com)
2. Get API key
3. Install: `npm install resend`
4. Create `.env.local`:
```
RESEND_API_KEY=re_your_key_here
```
5. Update `/pages/api/contact.js` - see comments in file

**Option 2: SendGrid**
- Sign up at [sendgrid.com](https://sendgrid.com)
- Install: `npm install @sendgrid/mail`
- Add API key to `.env.local`

**Option 3: SMTP (Any Email Provider)**
- Install: `npm install nodemailer`
- Add SMTP credentials to `.env.local`

### Stripe Integration (For Live Donations)

1. Sign up at [stripe.com](https://stripe.com)
2. Get API keys from dashboard
3. Add to `.env.local`:
```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```
4. Install: `npm install @stripe/stripe-js stripe`
5. Implement checkout (see README.md for example)

### Project Images

Add real images to `/public/images/`:
- `smart-connect-app.jpg` - Phone app screenshot
- `mobility-solution.jpg` - Phone with car app
- `community-hub.jpg` - Social/sports groups

Then update the component to use actual images instead of icons.

## 🚀 Deploy to Production

### Vercel (Easiest)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Or connect your GitHub repo at [vercel.com](https://vercel.com)

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod
```

## 📝 Quick Customization Guide

### Change Company Details
Edit the Contact section in `components/MainstreamMovement.jsx`

### Add/Remove Projects
Edit the `projects` array in the component

### Change Colors
Edit the `themes` object in the component

### Update About Section
Edit the About section content in the component

## ⚠️ Important Notes

- **Never commit `.env.local`** - it's in .gitignore for security
- Test email functionality before going live
- Use Stripe test mode keys during development
- Switch to Stripe live keys only when ready for real payments
- Set up proper form validation and rate limiting for production

## 🆘 Troubleshooting

**Issue:** CSS not loading
- Solution: Make sure `globals.css` is imported in `_app.js`

**Issue:** Icons not showing
- Solution: Check that `lucide-react` is installed: `npm install lucide-react`

**Issue:** Dark mode not working
- Solution: Ensure `darkMode: 'class'` is in `tailwind.config.js`

**Issue:** Forms not submitting
- Solution: API routes must be in `/pages/api/` directory

## 📞 Support

Questions? Contact: jules@gomainstream.org

---

**Next Steps:**
1. ✅ Get the site running locally
2. 🎨 Customize content and colors
3. 📧 Set up email service
4. 💳 Configure Stripe
5. 📸 Add real project images
6. 🚀 Deploy to production

Good luck! 🎉
