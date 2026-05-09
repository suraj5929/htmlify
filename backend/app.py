import os
from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS

load_dotenv()

from routes.generate import generate_bp

app = Flask(__name__)
CORS(app, origins=['http://localhost:5173'])

app.register_blueprint(generate_bp, url_prefix='/api')


@app.get('/health')
def health():
    return jsonify({'ok': True})


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 3001))
    print(f'Backend running on http://localhost:{port}')
    app.run(port=port, debug=True)
