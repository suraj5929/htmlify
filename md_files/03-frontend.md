# Step 3 — Frontend (React)

## File: frontend/src/App.jsx

```jsx
import { useState } from 'react'
import PromptPanel from './components/PromptPanel'
import PreviewPanel from './components/PreviewPanel'

export default function App() {
  const [html, setHtml]       = useState('')
  const [loading, setLoading] = useState(false)
  const [template, setTemplate] = useState('explainer')

  async function handleGenerate(prompt) {
    setHtml('')
    setLoading(true)

    try {
      const res = await fetch('http://localhost:3001/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, template })
      })

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const data = JSON.parse(line.slice(6))
            if (data.text) {
              accumulated += data.text
              setHtml(accumulated)   // live update iframe as HTML streams in
            }
            if (data.done || data.error) break
          } catch {}
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function handleDownload() {
    const blob = new Blob([html], { type: 'text/html' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `htmlify-${template}-${Date.now()}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 font-mono">
      <PromptPanel
        template={template}
        setTemplate={setTemplate}
        onGenerate={handleGenerate}
        loading={loading}
      />
      <PreviewPanel
        html={html}
        loading={loading}
        onDownload={handleDownload}
      />
    </div>
  )
}
```

## File: frontend/src/components/PromptPanel.jsx

```jsx
import { useState } from 'react'

const TEMPLATES = [
  { id: 'explainer',  label: 'Concept explainer', color: 'border-blue-500' },
  { id: 'report',     label: 'Status report',      color: 'border-teal-500' },
  { id: 'pr',         label: 'PR explainer',        color: 'border-purple-500' },
  { id: 'dashboard',  label: 'Dashboard',           color: 'border-amber-500' },
  { id: 'slideshow',  label: 'Slide deck',          color: 'border-pink-500' },
  { id: 'explorer',   label: 'Code explorer',       color: 'border-green-500' },
]

export default function PromptPanel({ template, setTemplate, onGenerate, loading }) {
  const [prompt, setPrompt] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!prompt.trim() || loading) return
    onGenerate(prompt.trim())
  }

  return (
    <div className="w-80 flex-shrink-0 border-r border-gray-800 flex flex-col p-4 gap-4">

      {/* Logo */}
      <div className="border-b border-gray-800 pb-4">
        <div className="text-lg font-bold tracking-tight">
          html<span className="text-blue-400">ify</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">prompt → beautiful HTML</div>
      </div>

      {/* Template selector */}
      <div>
        <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">
          Template
        </div>
        <div className="flex flex-col gap-1">
          {TEMPLATES.map(t => (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id)}
              className={`text-left px-3 py-2 rounded text-sm border transition-all
                ${template === t.id
                  ? `${t.color} bg-gray-800 text-white`
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Prompt input */}
      <div className="flex flex-col gap-2 flex-1">
        <div className="text-xs text-gray-500 uppercase tracking-widest">
          Prompt
        </div>
        <textarea
          className="flex-1 bg-gray-900 border border-gray-700 rounded p-3
                     text-sm text-gray-100 placeholder-gray-600 resize-none
                     focus:outline-none focus:border-blue-500 transition-colors"
          placeholder={`Describe what you want...\n\ne.g. Explain how Redis works with diagrams`}
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && e.metaKey) handleSubmit(e)
          }}
        />
        <div className="text-xs text-gray-600 text-right">⌘ + Enter to generate</div>
      </div>

      {/* Generate button */}
      <button
        onClick={handleSubmit}
        disabled={!prompt.trim() || loading}
        className={`w-full py-3 rounded text-sm font-semibold tracking-wide transition-all
          ${loading || !prompt.trim()
            ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer'
          }`}
      >
        {loading ? 'Generating...' : 'Generate HTML'}
      </button>

      {/* Cost indicator */}
      <div className="text-xs text-gray-600 text-center">
        ~₹1–2 per generation · Haiku model
      </div>
    </div>
  )
}
```

## File: frontend/src/components/PreviewPanel.jsx

```jsx
export default function PreviewPanel({ html, loading, onDownload }) {
  return (
    <div className="flex-1 flex flex-col">

      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-gray-800 px-4 py-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-400 animate-pulse' : html ? 'bg-green-400' : 'bg-gray-600'}`} />
          <span className="text-xs text-gray-500">
            {loading ? 'Generating...' : html ? 'Ready' : 'Waiting for prompt'}
          </span>
        </div>
        <div className="flex gap-2">
          {html && (
            <>
              <button
                onClick={onDownload}
                className="text-xs px-3 py-1 border border-gray-700 rounded
                           hover:border-gray-500 text-gray-400 hover:text-gray-200 transition-all"
              >
                Download .html
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(html)}
                className="text-xs px-3 py-1 border border-gray-700 rounded
                           hover:border-gray-500 text-gray-400 hover:text-gray-200 transition-all"
              >
                Copy HTML
              </button>
            </>
          )}
        </div>
      </div>

      {/* Preview iframe */}
      {html ? (
        <iframe
          srcDoc={html}
          className="flex-1 w-full border-0"
          title="HTML Preview"
          sandbox="allow-scripts"
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-700">
          <div className="text-5xl mb-4 opacity-30">◈</div>
          <div className="text-sm">Your generated HTML will appear here</div>
          <div className="text-xs mt-2 opacity-60">Pick a template and write a prompt</div>
        </div>
      )}
    </div>
  )
}
```
