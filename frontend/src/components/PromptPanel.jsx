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
