# HTMLify — Build Guide

Turn any prompt into a beautiful HTML page using Claude API + React.

## Read these files in order

| File | What it covers |
|---|---|
| 01-project-setup.md | Create folders, install packages |
| 02-backend.md | Node.js server + Claude API integration |
| 03-frontend.md | React UI — split panel layout |
| 04-templates.md | HTML skeletons to save tokens |
| 05-run-and-test.md | Start the app, test prompts, fix errors |
| 06-share-and-deploy.md | Share links + Vercel/Railway deploy |

## Time estimate

| Phase | Time |
|---|---|
| Setup + backend | 1–2 hours |
| Frontend UI | 1–2 hours |
| Templates | 1 hour |
| First working generation | Day 1 |
| Share links + deploy | Day 2 |

## Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- AI: Claude Haiku 4.5 (cheapest, ~₹1–2/request)
- Storage: Cloudflare R2 (for share links)
- Deploy: Vercel (frontend) + Railway (backend)

## Budget

- API: $5 Anthropic credit = ~380 generations
- Hosting: Free tier on Vercel + Railway
- Total to launch: $5

## Quick start command

```bash
mkdir htmlify && cd htmlify
npm create vite@latest frontend -- --template react
mkdir backend && cd backend && npm init -y
```

Then follow the files in order.
