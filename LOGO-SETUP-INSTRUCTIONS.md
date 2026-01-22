# Logo Image Setup Instructions

## 📸 Your Mm² Logo Integration

### ⚠️ Important: Preview vs Production

**In this artifact preview:**
- Shows a styled text version of "Mm²" with golden gradient
- This is because the preview can't load local images

**In your actual Next.js deployment:**
- Will display your actual golden glowing Mm² image
- Simply place the image file as shown below

## 📁 To Use Your Real Logo Image:

### Step 1: Place the Image File

Put `Mm2-3.png` in your project at:

```
mainstream-movement-website/
├── public/
│   └── images/
│       └── Mm2-3.png    ← Place your logo here
```

### Step 2: Update the Component

Replace the styled text logos with image tags in `components/MainstreamMovement.jsx`:

**Navigation Logo (around line 150):**
```javascript
<div className="transform hover:scale-110 hover:rotate-12 transition-all duration-300 cursor-pointer active:scale-95">
  <img 
    src="/images/Mm2-3.png" 
    alt="Mainstream Movement Logo" 
    className="h-12 w-auto"
  />
</div>
```

**Hero Logo (around line 250):**
```javascript
<div className="inline-block animate-float">
  <img 
    src="/images/Mm2-3.png" 
    alt="Mainstream Movement Logo" 
    className="h-32 md:h-40 w-auto mx-auto drop-shadow-2xl"
  />
</div>
```

### Step 3: Optional Background Watermark

Add this above the hero content for a subtle background effect:

```javascript
{/* Background Logo */}
<div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
  <img 
    src="/images/Mm2-3.png" 
    alt="Background Logo" 
    className="w-full max-w-4xl h-auto"
  />
</div>
```

## ✨ What You'll See:

### Navigation Bar
- Your golden Mm² logo (48px height)
- Scales and rotates on hover
- Positioned top-left

### Hero Section
- Large centered logo (128px mobile, 160px desktop)
- Floating animation
- Dramatic drop shadow
- Optional watermark background at 10% opacity

## 🚀 Quick Setup Commands:

```bash
# Create images directory
mkdir -p public/images

# Copy your logo
cp Mm2-3.png public/images/

# Restart dev server
npm run dev
```

## 🎨 Current Preview Shows:

Since this is a preview, you're seeing:
- **Styled "Mm²" text** with golden gradient
- Bold typography with text shadow
- Same animations and hover effects
- Changes color with theme switching

## 📝 Note:

The styled text version in the preview is temporary. Once you:
1. Set up your actual Next.js project
2. Place the image in `public/images/`
3. Deploy or run locally

Your actual glowing golden Mm² logo image will display beautifully! 🌟

---

**The code is ready - just add the image file when you deploy!**
