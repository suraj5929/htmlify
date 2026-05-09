import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { generateRoute } from './routes/generate.js'

dotenv.config()

const app = express()
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json({ limit: '2mb' }))

app.use('/api', generateRoute)

app.get('/health', (req, res) => res.json({ ok: true }))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`))
