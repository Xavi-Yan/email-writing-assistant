# Email Writing Assistant - Frontend 📧✨

A beautiful React application that transforms rough thoughts into polished, professional emails using AI.

![React](https://img.shields.io/badge/react-18.x-61dafb.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🌟 Features

- **AI-Powered Email Generation** - Powered by Claude Sonnet 4.5
- **Multiple Tone Options** - Professional, Warm, Concise, Formal, Casual, and Persuasive
- **Context-Aware** - Paste the email you're responding to for better context
- **Multi-Language Support** - English and Spanish (easily extensible)
- **Copy to Clipboard** - One-click copying of generated emails
- **Keyboard Shortcuts** - Cmd/Ctrl + Enter to generate
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Beautiful UI** - Modern gradient design with smooth animations

## 🏗️ Tech Stack

- **React 18.x** - UI framework
- **Lucide React** - Icon library
- **Tailwind CSS** - Styling (via utility classes)
- **Cloudflare Pages** - Hosting and deployment

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Backend API running ([Backend Repository](https://github.com/yourusername/email-writer-backend))

## 🚀 Local Development

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/email-writing-assistant.git
cd email-writing-assistant
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your backend API URL:

```env
REACT_APP_API_URL=http://localhost:3001/api/generate
```

### 4. Start Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

## 📦 Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## 🌐 Deployment to Cloudflare Pages

### Method 1: Connect to Git (Recommended)

1. **Go to Cloudflare Dashboard**
    - Visit https://dash.cloudflare.com/
    - Navigate to **Workers & Pages**

2. **Create New Project**
    - Click **Create application** → **Pages**
    - Click **Connect to Git**

3. **Connect Repository**
    - Select your Git provider (GitHub/GitLab)
    - Authorize Cloudflare
    - Select this repository

4. **Configure Build Settings**
   ```
   Build command: npm run build
   Build output directory: build
   Root directory: / (or leave blank)
   ```

5. **Add Environment Variables**
    - Click **Add variable**
    - Name: `REACT_APP_API_URL`
    - Value: `https://api.yourdomain.com/api/generate`
    - Click **Save**

6. **Deploy**
    - Click **Save and Deploy**
    - Wait for build to complete (2-5 minutes)

7. **Get Your URL**
    - You'll get a URL like: `https://your-app.pages.dev`
    - Can add custom domain in Settings → Custom domains

### Method 2: Direct Upload

```bash
# Build the app
npm run build

# Install Wrangler CLI (if not installed)
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
wrangler pages deploy build --project-name=email-writer
```

### Auto-Deployment

Once connected to Git, Cloudflare automatically deploys when you push to your main branch!

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API endpoint | `https://api.yourdomain.com/api/generate` |

**Note:** All React environment variables must start with `REACT_APP_`

### Updating Backend URL

After deployment, if your backend URL changes:

1. Go to Cloudflare Dashboard → Your project
2. **Settings** → **Environment variables**
3. Edit `REACT_APP_API_URL`
4. **Deployments** → **Retry deployment**

## 📁 Project Structure

```
src/
├── EmailWriterApp.jsx    # Main component
├── api.js                # API integration
├── translations.js       # Multi-language support
├── constants.js          # Configuration constants
├── styles.css           # Component styles
├── App.tsx              # App wrapper
└── index.tsx            # Entry point
```

## 🔧 Development

### Adding New Translations

Edit `src/translations.js`:

```javascript
export const TRANSLATIONS = {
  "en-US": { /* English */ },
  "es-ES": { /* Spanish */ },
  "fr-FR": { /* Add French */ }
};
```

### Adding New Tones

Edit `src/constants.js`:

```javascript
export const TONE_OPTIONS = [
  // ... existing tones
  { 
    value: 'enthusiastic', 
    labelKey: 'enthusiasticTone', 
    descriptionKey: 'enthusiasticDescription' 
  }
];
```

Then add translations in `translations.js`.

## 🐛 Troubleshooting

### Build Fails

**Issue:** `npm ci` fails with package-lock.json out of sync

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "Update package-lock.json"
git push
```

### API Calls Fail

**Issue:** "Load failed" or CORS errors

**Solutions:**
1. Check `REACT_APP_API_URL` is set correctly
2. Verify backend is running and accessible
3. Test backend directly: `curl https://api.yourdomain.com/health`
4. Check browser console for detailed error messages

### Environment Variables Not Working

**Issue:** `REACT_APP_API_URL` not being used

**Solutions:**
1. Make sure variable starts with `REACT_APP_`
2. Restart dev server after changing `.env`
3. In Cloudflare, redeploy after adding variables
4. Check in browser console: `console.log(process.env.REACT_APP_API_URL)`

### Mixed Content Errors

**Issue:** HTTPS page calling HTTP API

**Solution:** Backend must use HTTPS. Update backend with SSL certificate.

## 🔄 Updating

```bash
# Pull latest changes
git pull

# Install any new dependencies
npm install

# Start dev server
npm start
```

For production, just push to Git - Cloudflare auto-deploys!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

### Code Style

- Use functional components with hooks
- Keep components modular and reusable
- Add comments for complex logic
- Follow existing naming conventions
- Use meaningful variable names

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related

- **Backend Repository**: [email-writer-backend](https://github.com/yourusername/email-writer-backend)
- **Live Demo**: [https://your-app.pages.dev](https://your-app.pages.dev)

## 📧 Support

- **Issues**: Please use GitHub Issues for bug reports
- **Questions**: Use GitHub Discussions
- **Backend Issues**: Report in the backend repository

## 🙏 Acknowledgments

- [Anthropic](https://www.anthropic.com/) - Claude API
- [Cloudflare](https://www.cloudflare.com/) - Hosting
- [Lucide Icons](https://lucide.dev/) - Icons

---

**Built with ❤️ using Claude AI**

⭐️ Star this repo if it helped you!