# Step 4 — HTML Skeleton Templates

Save these in a `templates/` folder at the root of your project.
These are what keep your token usage low — Claude fills these in
instead of generating HTML from scratch.

## How to get the real skeletons

Go to https://thariqs.github.io/html-effectiveness/
Open each file → Right click → Save as → save into templates/

Map each file to these names:

| Save as | From Thariq's site |
|---|---|
| templates/explainer.html | 15-research-concept-explainer.html |
| templates/report.html | 11-status-report.html |
| templates/pr.html | 03-code-review-pr.html |
| templates/dashboard.html | 04-code-understanding.html |
| templates/slideshow.html | 09-slide-deck.html |
| templates/explorer.html | 14-research-feature-explainer.html |

## What to strip from each skeleton

After saving, open each file and remove the specific content
but keep the structure. Replace content with placeholder comments.

Example — in explainer.html, change things like:

BEFORE (specific content):
```html
<h1>Consistent Hashing</h1>
<p>Consistent hashing is a technique used in distributed systems...</p>
```

AFTER (placeholder):
```html
<h1>TOPIC_TITLE</h1>
<p>TOPIC_INTRODUCTION</p>
```

Keep EVERYTHING else:
- All <style> blocks
- All CSS variables
- All layout divs and classes
- All SVG containers (just empty them)
- All JavaScript

## Minimal fallback skeleton (use if skeletons not ready yet)

Save this as templates/explainer.html to test immediately:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TOPIC_TITLE</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Sans:wght@300;400;600&display=swap');
  :root {
    --bg: #0a0e1a; --surface: #111827; --border: #1e2d45;
    --text: #e2e8f0; --muted: #64748b;
    --blue: #3b82f6; --teal: #14b8a6; --purple: #8b5cf6;
    --amber: #f59e0b; --green: #10b981;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); color: var(--text); font-family: 'IBM Plex Sans', sans-serif;
         font-weight: 300; line-height: 1.7; padding: 2rem; max-width: 1000px; margin: 0 auto; }
  h1 { font-size: 2rem; font-weight: 600; letter-spacing: -0.02em; margin-bottom: 0.5rem; }
  h1 span { color: var(--blue); }
  .summary { background: var(--surface); border: 1px solid var(--border);
             border-left: 3px solid var(--blue); border-radius: 8px;
             padding: 1.25rem 1.5rem; margin: 1.5rem 0; font-size: 0.95rem; color: #94a3b8; }
  .summary strong { color: var(--text); }
  .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px,1fr));
             gap: 1rem; margin: 1.5rem 0; }
  .metric { background: var(--surface); border: 1px solid var(--border);
            border-radius: 8px; padding: 1rem; }
  .metric-label { font-size: 0.7rem; font-family: 'IBM Plex Mono', monospace;
                  color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; }
  .metric-value { font-size: 1.3rem; font-weight: 600; font-family: 'IBM Plex Mono', monospace; }
  .section-title { font-family: 'IBM Plex Mono', monospace; font-size: 0.7rem;
                   letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted);
                   margin: 2rem 0 1rem; display: flex; align-items: center; gap: 8px; }
  .section-title::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .diagram { background: var(--surface); border: 1px solid var(--border);
             border-radius: 10px; padding: 1.5rem; margin-bottom: 2rem; }
  .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px,1fr));
           gap: 1rem; margin-bottom: 2rem; }
  .card { background: var(--surface); border: 1px solid var(--border);
          border-radius: 8px; padding: 1.25rem; }
  .card-title { font-family: 'IBM Plex Mono', monospace; font-size: 0.85rem;
                font-weight: 600; margin-bottom: 0.5rem; }
  .card-desc { font-size: 0.85rem; color: #94a3b8; line-height: 1.6; }
  footer { border-top: 1px solid var(--border); padding-top: 1rem; margin-top: 2rem;
           font-size: 0.75rem; color: var(--muted); font-family: 'IBM Plex Mono', monospace; }
</style>
</head>
<body>
  <h1>TOPIC_TITLE</h1>
  <p style="color:#64748b;font-size:0.9rem;margin-top:4px">TOPIC_SUBTITLE</p>

  <div class="summary">
    <strong>TL;DR — </strong>SUMMARY_TEXT
  </div>

  <div class="metrics">
    <!-- METRICS_CARDS -->
  </div>

  <div class="section-title">Architecture diagram</div>
  <div class="diagram">
    <!-- SVG_DIAGRAM -->
  </div>

  <div class="section-title">Core concepts</div>
  <div class="cards">
    <!-- COMPONENT_CARDS -->
  </div>

  <footer>FOOTER_TEXT</footer>
</body>
</html>
```

## Token savings comparison

| Method | Output tokens | Cost per req |
|---|---|---|
| Full generation (no skeleton) | ~7,000 | ~₹8–10 |
| With this minimal skeleton | ~3,500 | ~₹4 |
| With Thariq's full skeleton | ~2,000 | ~₹2 |

Start with the minimal skeleton above to test immediately.
Upgrade to Thariq's files once you verify everything works.
