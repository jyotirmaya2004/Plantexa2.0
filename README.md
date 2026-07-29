# Plantexa AI

Plantexa AI is a Flask web application for plant-leaf disease analysis. It validates uploaded leaf images, classifies crop diseases with TensorFlow models, displays Grad-CAM heatmaps, provides disease guidance, and includes an NVIDIA-powered agronomist chat assistant.

The frontend is built with server-rendered HTML, CSS, and vanilla JavaScript. The backend exposes JSON APIs through Flask.

## Features

- Drag-and-drop image upload with client-side preview
- Two-stage leaf validation and disease classification
- Top-three predictions and optional Grad-CAM heatmap
- Searchable disease guide
- Downloadable diagnosis and chat PDF reports
- Browser-stored user profile and agriculture-focused AI chat

## Requirements

- Python 3.11 or later
- The model artifacts in `model/`:
  - `leaf_disease_model.keras`
  - `leaf_vs_non_leaf_model.keras`
  - `class_names.json`
- An NVIDIA API key is optional and only needed for the chat assistant

## Run locally

From the project root, create an isolated environment and install the dependencies:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
cp .env.example .env
python app.py
```

Open http://127.0.0.1:5000.

Set `NVIDIA_API_KEY` in `.env` to enable the AI assistant. Image analysis and the knowledge base work without it.

To stop the server, press `Ctrl+C`. On Windows PowerShell, activate the environment with `.venv\\Scripts\\Activate.ps1` instead of `source .venv/bin/activate`.

For a production-style local server after installing the dependencies, run:

```bash
gunicorn --bind 0.0.0.0:5000 --workers 1 --timeout 180 app:app
```

## Docker

```bash
docker compose up --build
```

The application is available at http://localhost:5000.

## API

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/api/predict` | `POST` | Analyze an uploaded image from a `file` multipart field |
| `/api/diseases` | `GET` | Retrieve disease guidance data |
| `/api/export-report` | `POST` | Generate a diagnosis PDF |
| `/api/chat` | `POST` | Send a chat conversation to the agronomist assistant |
| `/api/chat/export-pdf` | `POST` | Generate a chat-transcript PDF |

## Project structure

```text
app.py               Flask application entry point
routes/              Prediction, knowledge-base, and chat API routes
backend/             Model loading, prediction pipeline, disease metadata access
templates/           HTML page templates
static/              CSS and browser JavaScript
model/               TensorFlow model artifacts and class names
```
