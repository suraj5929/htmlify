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
