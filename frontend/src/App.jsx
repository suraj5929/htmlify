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
