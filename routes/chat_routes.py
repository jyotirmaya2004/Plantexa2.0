"""Chat routes for Flask application (NVIDIA LLM assistant & ReportLab PDF exporter)."""

import io
import os
import re
from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv
from flask import Blueprint, jsonify, request, send_file
from openai import OpenAI

load_dotenv()

chat_bp = Blueprint("chat", __name__)

NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1"
DEFAULT_MODEL = "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning"
SYSTEM_PROMPT = """
You are Plantexa AI, a professional agronomist and plant pathologist.
Provide expert, scientifically accurate advice on plant diseases, crop care, fertilizers, and pest management.
Keep your responses extremely concise, using short bullet points and direct, actionable recommendations.
If the user asks about topics outside of agriculture or botany, politely decline and steer the conversation back to plant health.
""".strip()

IST = timezone(timedelta(hours=5, minutes=30))

AVATAR_ROLES = {
    "🧑‍🌾": "Farmer",
    "👩‍🌾": "Gardener",
    "👨‍🌾": "Agronomist",
    "🪴": "Plant Lover",
    "🌻": "Sunflower",
    "🌵": "Cactus",
    "🌾": "Botanist",
    "🤖": "AI Bot",
}


def _get_float_env(name: str, default: float) -> float:
    try:
        return float(os.getenv(name, default))
    except (TypeError, ValueError):
        return default


def _get_int_env(name: str, default: int) -> int:
    try:
        return int(os.getenv(name, default))
    except (TypeError, ValueError):
        return default


def _build_client() -> OpenAI | None:
    api_key = os.getenv("NVIDIA_API_KEY")
    if not api_key:
        return None
    return OpenAI(api_key=api_key, base_url=NVIDIA_BASE_URL)


def _generate_followups(client: OpenAI, messages: list[dict], app_lang: str, prediction: dict | None) -> list[str]:
    sys_prompt = (
        "Suggest exactly 3 short follow-up questions for the user based on the conversation. "
        "Output them strictly on a single line separated by a pipe character `|`. "
        "Do not include any intro text, numbers, or bullet points. "
        f"You must write the questions in {app_lang}."
    )
    if prediction and prediction.get("disease"):
        sys_prompt += f" The user's plant was just diagnosed with '{prediction['disease']}'."

    context = [m for m in messages if m.get("role") in {"user", "assistant"}][-4:]
    api_messages = [{"role": "system", "content": sys_prompt}] + context

    try:
        response = client.chat.completions.create(
            model=os.getenv("NVIDIA_MODEL", DEFAULT_MODEL),
            messages=api_messages,
            temperature=0.7,
            max_tokens=80,
        )
        text = response.choices[0].message.content.strip().replace("`", "")
        questions = [q.strip() for q in text.split("|") if q.strip()]
        return questions[:3]
    except Exception:
        return [
            "How do I prevent this disease?",
            "What fertilizers should I use?",
            "How often should I water my crop?",
        ]


@chat_bp.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}
    user_messages = data.get("messages", [])
    username = data.get("username", "")
    avatar = data.get("avatar", "")
    app_lang = data.get("language", "English")
    prediction = data.get("prediction")

    client = _build_client()
    if client is None:
        return jsonify(
            {
                "success": False,
                "error": "NVIDIA_API_KEY is not configured in environment.",
                "reply": "⚠️ NVIDIA_API_KEY is missing. Please set your NVIDIA_API_KEY in the `.env` file to enable the Plantexa AI Chatbot.",
                "followups": [],
            }
        )

    system_prompt = SYSTEM_PROMPT + f"\n\nIMPORTANT: You must reply entirely in {app_lang}."

    if username:
        role = AVATAR_ROLES.get(avatar, "Plant Enthusiast")
        system_prompt += f"\n\nUser Context: You are talking to {username}, who is a {role} ({avatar}). Tailor your advice appropriately."

    if prediction and prediction.get("disease"):
        disease = prediction["disease"]
        confidence = prediction.get("confidence", 0)
        system_prompt += (
            f"\n\nCurrent Context: The user just analyzed a plant leaf. "
            f"Diagnosed as '{disease}' with {confidence}% confidence. "
            f"Tailor advice to this context if asked."
        )

    api_messages = [{"role": "system", "content": system_prompt}]
    for m in user_messages:
        if m.get("role") in {"user", "assistant"}:
            api_messages.append({"role": m["role"], "content": m["content"]})

    try:
        response = client.chat.completions.create(
            model=os.getenv("NVIDIA_MODEL", DEFAULT_MODEL),
            messages=api_messages,
            temperature=_get_float_env("NVIDIA_TEMPERATURE", 0.6),
            top_p=_get_float_env("NVIDIA_TOP_P", 0.95),
            max_tokens=_get_int_env("NVIDIA_MAX_TOKENS", 1200),
        )
        reply_content = response.choices[0].message.content

        followups = _generate_followups(client, user_messages, app_lang, prediction)

        return jsonify(
            {
                "success": True,
                "reply": reply_content,
                "followups": followups,
            }
        )
    except Exception as exc:
        return jsonify({"success": False, "error": f"Chat API error: {exc}"}), 500


@chat_bp.route("/api/chat/export-pdf", methods=["POST"])
def export_pdf():
    data = request.get_json(silent=True) or {}
    messages = data.get("messages", [])
    disease = data.get("disease", "")

    try:
        from reportlab.lib import colors
        from reportlab.lib.pagesizes import letter
        from reportlab.lib.styles import getSampleStyleSheet
        from reportlab.lib.units import inch
        from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle
    except ImportError:
        return jsonify({"success": False, "error": "ReportLab package is missing."}), 400

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=letter, rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40
    )
    styles = getSampleStyleSheet()
    story = []

    story.append(Paragraph("Plantexa AI - Chat Transcript", styles["Title"]))
    story.append(Spacer(1, 15))

    def format_text(text):
        text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        text = re.sub(r"\*\*(.*?)\*\*", r"<b>\1</b>", text)
        text = re.sub(r"\*(.*?)\*", r"<i>\1</i>", text)
        text = re.sub(r"(?m)^#{1,6}\s+(.*)", r"<b>\1</b>", text)
        text = re.sub(r"[^\x00-\x7F\u0080-\u00FF\u2013\u2014\u2018-\u201D\u2022]", "", text)
        return text

    for msg in messages:
        is_user = msg.get("role") == "user"
        role_name = "User" if is_user else "Plantexa AI"
        color = "#1b4332" if is_user else "#2d6a4f"

        role_html = f'<font color="{color}"><b>{role_name}:</b></font>'
        story.append(Paragraph(role_html, styles["Heading4"]))
        story.append(Spacer(1, 4))

        content = format_text(msg.get("content", "")).replace("\n", "<br/>")
        if content.strip():
            story.append(Paragraph(content, styles["Normal"]))
            story.append(Spacer(1, 10))

    def add_footer(canvas, doc):
        canvas.saveState()
        canvas.setFont("Helvetica", 9)
        canvas.setFillColor(colors.dimgrey)
        footer_text = f"Plantexa AI Chat Transcript - Page {doc.page}"
        canvas.drawCentredString(letter[0] / 2.0, 0.5 * inch, footer_text)
        date_str = datetime.now(IST).strftime("%B %d, %Y")
        canvas.drawString(0.5 * inch, 0.5 * inch, date_str)
        canvas.restoreState()

    doc.build(story, onFirstPage=add_footer, onLaterPages=add_footer)
    buffer.seek(0)

    safe_name = re.sub(r"[^a-zA-Z0-9]+", "_", disease).strip("_").lower() if disease else "transcript"
    filename = f"plantexa_ai_{safe_name}.pdf"

    return send_file(
        buffer,
        mimetype="application/pdf",
        as_attachment=True,
        download_name=filename,
    )
