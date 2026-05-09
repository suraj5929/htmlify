# Step 6 — Share Links + Deploy (optional after MVP works)

## Add shareable links (Phase 2)

### Install storage package

```bash
cd backend
npm install @aws-sdk/client-s3
```

### Add share route: backend/routes/share.js

```js
import express from 'express'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { nanoid } from 'nanoid'

export const shareRoute = express.Router()

const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,     // from Cloudflare R2
  credentials: {
    accessKeyId:     process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_KEY,
  }
})

shareRoute.post('/share', async (req, res) => {
  const { html } = req.body
  if (!html) return res.status(400).json({ error: 'html required' })

  const id = nanoid(8)    // e.g. "aB3kR9mX"
  const key = `artifacts/${id}.html`

  await s3.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: key,
    Body: html,
    ContentType: 'text/html',
    CacheControl: 'public, max-age=31536000',
  }))

  res.json({
    id,
    url: `${process.env.PUBLIC_URL}/s/${id}`
  })
})
```

### Add to backend/.env

```bash
R2_ENDPOINT=https://YOUR_ACCOUNT.r2.cloudflarestorage.com
R2_ACCESS_KEY=your_r2_access_key
R2_SECRET_KEY=your_r2_secret_key
R2_BUCKET=htmlify-artifacts
PUBLIC_URL=https://your-domain.com
```

### Add Share button to frontend PreviewPanel.jsx

```jsx
// Add this inside PreviewPanel alongside Download button:
async function handleShare() {
  const res = await fetch('http://localhost:3001/api/share', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html })
  })
  const { url } = await res.json()
  await navigator.clipboard.writeText(url)
  alert(`Link copied: ${url}`)
}

// Button JSX:
<button onClick={handleShare} className="...">
  Copy share link
</button>
```

## Deploy (free tier)

### Frontend → Vercel

```bash
cd frontend
npm run build

# Install Vercel CLI
npm i -g vercel
vercel

# Follow prompts — done in 2 minutes
# Your app is live at https://htmlify.vercel.app
```

### Backend → Railway or Render (free tier)

```bash
# Railway (recommended — simple)
npm install -g @railway/cli
railway login
railway init
railway up

# Add your env variables in Railway dashboard
# ANTHROPIC_API_KEY, R2_*, etc.
```

### Update CORS for production

```js
// backend/index.js — update cors origin:
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://htmlify.vercel.app'    // your vercel URL
  ]
}))
```

## Your $5 budget projection

At Haiku + skeleton templates:
- Cost per request: ~$0.013 (₹1.2)
- $5 total budget: ~380 requests
- That's enough to:
  - Build the whole app (50 test requests)
  - Validate with 10 real users (50 requests each)
  - Have budget left for iteration

When you run out: top up $5 more.
By then you should have paying users covering the cost.
