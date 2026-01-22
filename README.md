# Mainstream Movement Website

Official website for **Mainstream Movement Ltd** - A For-Profit For Good organization focused on Research & Development of tech systems to alleviate societal stress and pain points.

**Trading Name:** Mainstream Movement  
**Domain:** gomainstream.org  
**Company:** Mainstream Movement Ltd  
**Registered:** England & Wales  
**Company Number:** 09098347  
**Established:** 2014

## 🎯 Features

- **Modern Design** - Clean, professional interface with micro-animations
- **Dark Mode** - Full dark/light theme toggle
- **Color Themes** - Choose from 4 color schemes (Blue, Green, Purple, Orange)
- **Responsive** - Mobile-first design that works on all devices
- **Projects Showcase** - Interactive accordion-based project display
- **Donation System** - Accept donations and pledges with Stripe integration
- **Contact Form** - Direct email integration to jules@gomainstream.org
- **Animations** - Smooth scroll animations and hover effects
- **SEO Optimized** - Built with Next.js for excellent SEO

## 🚀 Tech Stack

- **Framework:** Next.js 14
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui principles (Lucide React icons)
- **Language:** React / JavaScript
- **Deployment:** Ready for Vercel, Netlify, or any Node.js host

## 📦 Installation

### Prerequisites

- Node.js 18.17.0 or higher
- npm or yarn package manager

### Setup Steps

1. **Clone or create your project directory:**
```bash
mkdir mainstream-movement
cd mainstream-movement
```

2. **Copy the files into your project structure:**
```
mainstream-movement/
├── pages/
│   ├── api/
│   │   ├── contact.js
│   │   └── pledge.js
│   ├── _app.js
│   └── index.js
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

3. **Install dependencies:**
```bash
npm install
```

4. **Configure Tailwind CSS:**

Create `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
```

Create `postcss.config.js`:
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

5. **Create the pages structure:**

Create `pages/_app.js`:
```javascript
import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

Create `pages/index.js` and copy the content from `mainstream-movement-site.jsx` into it, making sure to export it as default:
```javascript
import MainstreamMovement from '../components/MainstreamMovement'

export default function Home() {
  return <MainstreamMovement />
}
```

6. **Create global styles:**

Create `styles/globals.css`:
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

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}
```

7. **Run the development server:**
```bash
npm run dev
```

Visit `http://localhost:3000` to see your website!

## 📧 Email Configuration

The contact form currently logs to console. To enable actual email sending, you need to configure an email service in `/pages/api/contact.js` and `/pages/api/pledge.js`.

### Recommended Email Services:

#### Option 1: Resend (Recommended - Easy Setup)
```bash
npm install resend
```

In `/pages/api/contact.js`:
```javascript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Replace the fetch call with:
await resend.emails.send({
  from: 'noreply@gomainstream.org',
  to: 'jules@gomainstream.org',
  subject: `New Contact Form Submission from ${name}`,
  html: emailData.html,
});
```

Add to `.env.local`:
```
RESEND_API_KEY=your_api_key_here
```

#### Option 2: SendGrid
```bash
npm install @sendgrid/mail
```

#### Option 3: Nodemailer (SMTP)
```bash
npm install nodemailer
```

## 💳 Stripe Integration

To enable donations:

1. **Install Stripe:**
```bash
npm install @stripe/stripe-js stripe
```

2. **Get your Stripe keys** from https://dashboard.stripe.com/apikeys

3. **Add to `.env.local`:**
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

4. **Update the donation form** in the component to integrate Stripe Checkout or Payment Elements.

### Example Stripe Checkout Integration:

Create `pages/api/create-checkout-session.js`:
```javascript
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { amount, project } = req.body;
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'gbp',
              product_data: {
                name: project === 'all' ? 'Donation - All Projects' : `Donation - Project ${project}`,
              },
              unit_amount: amount * 100, // Convert to pence
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/?success=true`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
      });
      
      res.status(200).json({ sessionId: session.id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}
```

## 🎨 Customization

### Changing Colors

The website supports 4 color themes. To add more themes, edit the `themes` object in the main component:

```javascript
const themes = {
  yourTheme: {
    light: 'from-color-50 to-color-100',
    dark: 'from-gray-900 to-color-900',
    accent: 'bg-color-600',
    accentHover: 'hover:bg-color-700',
    text: 'text-color-600',
    border: 'border-color-600'
  }
};
```

### Adding Projects

Edit the `projects` array in the component:

```javascript
const projects = [
  {
    id: 1,
    title: "Your Project Title",
    shortDesc: "Brief description here.",
    fullDesc: "Detailed description that appears in accordion.",
    icon: <YourIcon className="w-12 h-12" />,
    status: "In Development"
  },
  // Add more projects...
];
```

### Replacing Placeholder Images

The current version uses icons for project images. To use actual images:

1. Add images to `/public/images/`
2. Replace the icon section with:

```javascript
<div className="h-48 relative overflow-hidden">
  <img 
    src="/images/your-project-image.jpg" 
    alt={project.title}
    className="w-full h-full object-cover"
  />
</div>
```

## 📱 Project Image Recommendations

For the 3 projects, you should add these images to `/public/images/`:

1. **smart-connect-app.jpg** - Phone app screenshot or mockup
2. **mobility-solution.jpg** - Phone displaying a car/transportation app
3. **community-hub.jpg** - People in social/sports groups setting

Recommended size: 800x450px (16:9 ratio)

## 🚀 Deployment

### Deploy to Vercel (Recommended):

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Deploy!

### Deploy to Netlify:

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Import your repository
4. Build command: `npm run build`
5. Publish directory: `.next`
6. Deploy!

### Environment Variables for Production:

```
RESEND_API_KEY=your_key
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

## 📝 Content Updates

### Company Information
Update in the Contact section and Footer of the main component.

### About Section
Edit the content in the "About Section" of the component.

### Projects
Modify the `projects` array with your actual project details.

## 🔒 Security Notes

- Never commit `.env.local` to version control
- Always use environment variables for sensitive keys
- Validate all form inputs on the server side
- Implement rate limiting on API routes in production
- Use HTTPS in production

## 📄 License

© 2024 Mainstream Movement Ltd. All rights reserved.

## 🤝 Support

For technical support or questions about the website:
- Email: jules@gomainstream.org
- Website: gomainstream.org

---

**Built with ❤️ for positive change**
