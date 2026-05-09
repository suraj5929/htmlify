import json
import anthropic
from flask import Blueprint, request, Response, stream_with_context
from prompts import get_system_prompt, get_user_prompt

generate_bp = Blueprint('generate', __name__)

client = None


def get_client():
    global client
    if client is None:
        import os
        client = anthropic.Anthropic(api_key=os.environ['ANTHROPIC_API_KEY'])
    return client


def event(data: dict) -> str:
    return f"data: {json.dumps(data)}\n\n"


@generate_bp.post('/generate')
def generate():
    body = request.get_json(silent=True) or {}
    prompt = body.get('prompt', '').strip()
    template = body.get('template', '').strip()

    if not prompt or not template:
        return {'error': 'prompt and template are required'}, 400

    def stream():
        try:
            with get_client().messages.stream(
                model='claude-haiku-4-5',
                max_tokens=4096,
                system=[
                    {
                        'type': 'text',
                        'text': get_system_prompt(),
                        'cache_control': {'type': 'ephemeral'},  # 90% cheaper on repeat calls
                    }
                ],
                messages=[
                    {'role': 'user', 'content': get_user_prompt(template, prompt)}
                ],
            ) as s:
                for text in s.text_stream:
                    yield event({'text': text})

            yield event({'done': True})

        except Exception as e:
            print(f'Claude API error: {e}')
            yield event({'error': str(e)})

    return Response(
        stream_with_context(stream()),
        content_type='text/event-stream',
        headers={
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no',
        },
    )
