# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Official website for Mainstream Movement Ltd - a For-Profit For Good R&D organization (est. 2014). The site showcases projects, handles contact forms, and accepts donations/pledges.

**Company:** Mainstream Movement Ltd | Registered England & Wales | Company No. 09098347
**Domain:** gomainstream.org | **Email:** jules@gomainstream.org

## Development Commands

```bash
npm run dev      # Development server (http://localhost:3000)
npm run build    # Production build
npm start        # Start production server
npm run lint     # Lint code
```

**Node requirement:** >= 18.17.0

## Architecture

### Next.js 14 App Router Structure

```
app/
  layout.jsx    - Minimal root layout
  page.jsx      - Main client component with all site logic
api-contact.js  - Contact form API (root dir, should move to app/api/)
api-pledge.js   - Pledge form API (root dir, should move to app/api/)
```

**Key:** This project uses Next.js 14 App Router. The API routes are currently in the root directory but should eventually migrate to `app/api/contact/route.js` and `app/api/pledge/route.js` following App Router conventions.

### Main Component Architecture (app/page.jsx)

Single large client component (~860 lines) managing entire site. Key systems:

**1. Theme System**
- Three color schemes: green (default), red, blue
- Cycles through themes: green → red → blue → green via `cycleTheme()`
- Dark mode toggle independent of color theme
- Theme definitions in `themes` object with properties: `light`, `dark`, `accent`, `accentHover`, `text`, `border`

**2. State Management**
- `darkMode` - Dark/light toggle
- `theme` - Current color theme string
- `mobileMenuOpen` - Mobile nav state
- `expandedProject` - Project accordion tracking (id or null)
- `donationType` - 'donate' or 'pledge' mode
- `selectedProject` - Target project for support ('all' or project.id)
- `formData` - Shared state: `{name, email, phone, message, amount}`
- `isSubmitting`, `submitStatus` - Form submission tracking

**3. Navigation & Scroll**
- `scrollToSection(sectionId)` - Smooth scroll with 80px navbar offset
- Intersection Observer pattern for scroll-triggered fade-in animations
- Mobile menu with backdrop blur overlay

**4. Projects Data**
Hardcoded array of 3 projects with structure:
```js
{ id, title, shortDesc, fullDesc, icon, status }
```

**5. Form Handlers**
- `handleContactSubmit()` → POST `/api/contact`
- `handleDonationSubmit()` → Stripe (placeholder) or POST `/api/pledge`

### Styling System

**Tailwind CSS** with custom animations defined in `tailwind.config.js`:
- `float` - Keyframe animation for floating motion (6s cycle)
- `pulse-slow` - Slower pulse variant (4s cycle)

**Inline Animations** (in page.jsx `<style jsx>`):
- `.fade-in-section` - Scroll-triggered opacity/transform transitions
- `.btn-hover` - Primary button with shimmer overlay effect
- `.btn-secondary-hover` - Secondary button with scale effect
- `.gradient-text` - Purple gradient text effect

**Dark Mode:** Class-based (`darkMode: 'class'` in tailwind.config.js)

### API Routes (Placeholder Implementation)

Both routes currently **log to console only** - no actual email sending or data persistence.

**api-contact.js**
- Expects: `{name, email, phone?, message}`
- Should email: jules@gomainstream.org
- Returns success regardless (placeholder)

**api-pledge.js**
- Expects: `{name, email, phone?, message, amount, project}`
- Should email admin and send confirmation to pledger
- Should store in database (not implemented)
- Returns success regardless (placeholder)

**Integration needed:** See comments in files for Resend/SendGrid/Nodemailer examples.

## Critical Implementation Gaps

### 1. Email Service Not Configured
Contact and pledge forms only log to console. Need to integrate:
- Resend (recommended - see file comments)
- SendGrid
- Nodemailer (SMTP)

Environment variables required (add to `.env.local`):
```env
RESEND_API_KEY=re_***
# OR SENDGRID_API_KEY / SMTP credentials
```

### 2. Stripe Not Integrated
Donation button shows alert placeholder. Requires:
- Stripe Checkout or Payment Elements implementation
- Environment variables:
  ```env
  STRIPE_SECRET_KEY=sk_test_***
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_***
  ```

### 3. No Data Persistence
Pledge submissions aren't stored anywhere. Production needs database integration.

## Logo Branding

The "Mm²" logo pattern:
- Font: Arial Black
- Superscript "2" notation
- Gradient background (amber/yellow tones)
- Hover: scale + rotate transform
- Text shadow for depth

See `LOGO-SETUP-INSTRUCTIONS.md` for detailed guidelines.

## Content Modification

All content hardcoded in `app/page.jsx`:
- **Projects:** `projects` array (~lines 62-87)
- **Themes:** `themes` object (~lines 35-60)
- **Theme cycle order:** `themeOrder` array in `cycleTheme()` (~line 16)
- **Company info:** Contact section and Footer sections

## Deployment Notes

**Recommended:** Vercel (optimized for Next.js)
**Alternative:** Netlify

**Pre-deployment:**
1. Configure email service integration
2. Implement Stripe payments
3. Add real project images to `/public/images/` (currently using icon placeholders)
4. Remove "under construction" banner from hero section
5. Set environment variables in deployment platform
