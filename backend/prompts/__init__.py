import os

TEMPLATES_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'templates')


def load_skeleton(name):
    """Load skeleton HTML file once at startup (not per request)."""
    file_path = os.path.join(TEMPLATES_DIR, f'{name}.html')
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    return None


def get_system_prompt():
    """System prompt — kept short and cached."""
    return (
        "You are an expert at generating beautiful, self-contained HTML files.\n"
        "Rules you must always follow:\n"
        "- Output ONLY raw HTML. No markdown. No explanation. No code fences.\n"
        "- Start your response with <!DOCTYPE html> and nothing before it.\n"
        "- All CSS must be inline in a <style> tag inside <head>.\n"
        "- No external dependencies. No CDN links. Fully self-contained.\n"
        "- Use dark theme: background #0a0e1a, text #e2e8f0.\n"
        "- Use clean professional fonts via Google Fonts import only.\n"
        "- Make it beautiful enough to share with a manager or client.\n"
        "- Write compact HTML: no HTML comments, no blank lines, minimal whitespace.\n"
        "- Keep CSS concise: use shorthand properties, combine selectors where possible.\n"
        "- No SVG unless explicitly required — use CSS shapes or emoji instead."
    )


def get_user_prompt(template, user_input):
    """Per-template user prompt."""
    skeleton = load_skeleton(template)

    template_instructions = {
        'explainer': (
            "Create a concept explainer HTML page about the following topic.\n"
            "Include: summary card at top, SVG architecture diagram, color-coded sections,\n"
            "component breakdown cards, a step-by-step flow, and a code example if relevant."
        ),
        'report': (
            "Create a professional status report HTML page.\n"
            "Include: summary metrics cards at top, a table of completed items,\n"
            "a risks section with color badges (green/amber/red), and a clean timeline."
        ),
        'pr': (
            "Create a PR explainer HTML page for the following change description.\n"
            "Include: what changed and why, color-coded diff view (green adds / red removes),\n"
            "inline annotations, key files changed, and a risk assessment badge."
        ),
        'dashboard': (
            "Create a data dashboard HTML page.\n"
            "Include: metric cards at top, SVG charts for trends, a data table,\n"
            "and color-coded status indicators."
        ),
        'slideshow': (
            "Create an arrow-key navigable slide deck HTML page.\n"
            "Include 5-7 slides. Use left/right arrow keys to navigate.\n"
            "Each slide should have a title, key points, and relevant visual."
        ),
        'explorer': (
            "Create a code/concept explorer HTML page.\n"
            "Include: overview section, interactive expandable sections for each component,\n"
            "a module map using SVG boxes and arrows, and a glossary."
        ),
    }

    instruction = template_instructions.get(template, template_instructions['explainer'])

    if skeleton:
        # Token-efficient: fill skeleton instead of generating from scratch
        return (
            f"{instruction}\n\n"
            f"TOPIC / CONTENT:\n{user_input}\n\n"
            "Use the following HTML skeleton as your base structure.\n"
            "Keep ALL existing CSS, layout structure, and JS exactly as-is.\n"
            "Only replace placeholder text, data, and SVG content with real content about the topic.\n"
            "Do not add new sections. Do not change fonts or colors.\n\n"
            f"SKELETON:\n{skeleton}"
        )

    # Fallback: full generation (more tokens but works without skeleton)
    return f"{instruction}\n\nTOPIC / CONTENT:\n{user_input}"
