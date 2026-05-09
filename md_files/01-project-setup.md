# Step 1 — Project Setup

## Folder structure we are building

```
htmlify/
├── frontend/          ← React app (what user sees)
├── backend/           ← Node.js server (calls Claude API)
└── templates/         ← HTML skeletons (saves tokens)
```

## Initialize both projects

```bash
# Create root folder
mkdir htmlify && cd htmlify

# Frontend
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
cd ..

# Backend
mkdir backend && cd backend
npm init -y
npm install express @anthropic-ai/sdk dotenv cors nanoid
cd ..
```

## Configure Tailwind

Edit `frontend/tailwind.config.js`:

```js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: { extend: {} },
  plugins: [],
}
```

Edit `frontend/src/index.css` — replace everything with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Create .env file in backend/

```bash
# backend/.env
ANTHROPIC_API_KEY=sk-ant-your-key-here
PORT=3001
```

## Verify setup

```bash
# Terminal 1 — start frontend
cd frontend && npm run dev
# Opens at http://localhost:5173

# Terminal 2 — will start backend later
cd backend && node index.js
# Will run at http://localhost:3001
```
