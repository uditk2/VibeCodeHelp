# FixMyCode - Vibe Coded Project Assistance

A beautiful glassmorphism UI for gauging user interest in getting their vibe coded projects fixed. Built with vanilla HTML, CSS, and JavaScript for easy deployment on GitHub Pages.

## 🚀 Live Demo

Visit the live site: `https://yourusername.github.io/vibecodehelp`

## ✨ Features

- **Glassmorphism Design**: Modern, elegant UI with glass-like effects
- **Google OAuth Integration**: Secure user authentication
- **Cal.com Integration**: Seamless booking for free 10-minute sessions
- **Issue Collection**: Comprehensive form to understand user problems
- **Responsive Design**: Works perfectly on all devices
- **GitHub Pages Ready**: Static deployment with CI/CD

## 🛠️ Setup Instructions

### 1. Deploy to GitHub Pages

1. Fork or clone this repository
2. Go to repository Settings → Pages
3. Select "GitHub Actions" as the source
4. Push to main/master branch to trigger automatic deployment

### 2. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 Client ID credentials
5. Add your GitHub Pages domain to authorized origins:
   - `https://yourusername.github.io`
6. Replace `YOUR_GOOGLE_CLIENT_ID` in `script.js` with your actual client ID

### 3. Cal.com Integration

The calendar is already configured to use: `https://cal.com/udit-khandelwal-mpzber/vibecodehelp`

To use your own Cal.com link:
1. Update the iframe src in `script.js` (line ~126)
2. Replace with your Cal.com booking URL

## 📁 Project Structure

```
vibecodehelp/
├── index.html          # Main HTML file
├── styles.css          # Glassmorphism styles
├── script.js           # JavaScript functionality
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Actions deployment
└── README.md           # This file
```

## 🔐 Google OAuth Security

**Important**: This implementation uses client-side OAuth which is secure for static sites because:

- ✅ **Client ID Only**: No client secret needed for frontend authentication
- ✅ **Authorized Domains**: Google validates requests come from your domain
- ✅ **JWT Tokens**: User data is signed and tamper-proof
- ✅ **No Server Required**: Perfect for static GitHub Pages deployment

**Never expose client secrets in frontend code!**

## 🎯 User Flow

1. **Landing Page**: Glassmorphism hero with feature showcase
2. **Authentication**: Google OAuth sign-in
3. **Issue Form**: Collect project details and problems
4. **Calendar Booking**: Schedule free 10-minute consultation
5. **Thank You**: Confirmation with next steps

## 📱 Responsive Features

- Mobile-optimized layouts
- Touch-friendly interactions
- Adaptive typography
- Flexible grid systems

## 🚀 Deployment

The site automatically deploys to GitHub Pages when you:

1. Push to main/master branch
2. GitHub Actions workflow runs
3. Site is available at `https://yourusername.github.io/vibecodehelp`

## 🎨 Customization

### Colors
Edit CSS custom properties in `styles.css`:
```css
:root {
  --primary-gradient: linear-gradient(45deg, #667eea, #764ba2);
  --glass-bg: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.2);
}
```

### Content
Update text content in `index.html` sections:
- Hero title and subtitle
- Feature descriptions
- Form labels and options

### Branding
Replace the Material Icons logo with your own:
```html
<div class="logo">
  <img src="your-logo.png" alt="Your Brand">
  <span>Your Brand Name</span>
</div>
```

## 📊 Analytics Integration

The code includes tracking functions ready for:
- Google Analytics
- Mixpanel
- Custom analytics

Uncomment and configure in `script.js`:
```javascript
// gtag('event', eventName, eventData);
// analytics.track(eventName, eventData);
```

## 🛡️ Security Best Practices

- Client-side OAuth only (no secrets exposed)
- Form validation and sanitization
- HTTPS enforcement via GitHub Pages
- CSP headers recommended for production

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 💬 Support

For issues and questions:
- Open a GitHub issue
- Contact via the booking calendar
- Email: your-email@example.com

---

Built with ❤️ for the developer community