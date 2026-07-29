"""Plantexa AI - Flask Web Application Server."""

import os
import sys
from pathlib import Path

from flask import Flask, render_template, send_from_directory
from flask_cors import CORS

ROOT_DIR = Path(__file__).resolve().parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from routes.chat_routes import chat_bp
from routes.info_routes import info_bp
from routes.predict_routes import predict_bp

app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Register API blueprints
app.register_blueprint(predict_bp)
app.register_blueprint(chat_bp)
app.register_blueprint(info_bp)


@app.route("/assets/<path:filename>")
def serve_assets(filename):
    return send_from_directory("assets", filename)


@app.route("/")
def index():
    return render_template("index.html")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"🌱 Starting Plantexa AI Server on http://0.0.0.0:{port}...")
    app.run(host="0.0.0.0", port=port, debug=True)
