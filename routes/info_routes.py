"""Information routes for the Flask knowledge base and report exporter."""

import io
import re
from datetime import datetime, timedelta, timezone

from flask import Blueprint, jsonify, request, send_file

from backend.disease_info import load_disease_info

info_bp = Blueprint("info", __name__)
IST = timezone(timedelta(hours=5, minutes=30))


@info_bp.route("/api/diseases", methods=["GET"])
def get_diseases():
    try:
        data = load_disease_info()
        return jsonify({"success": True, "diseases": data})
    except Exception as exc:
        return jsonify({"success": False, "error": str(exc)}), 500


@info_bp.route("/api/export-report", methods=["POST"])
def export_report():
    data = request.get_json(silent=True) or {}
    disease = data.get("disease", "Unknown Disease")
    confidence = data.get("confidence", "N/A")
    symptoms = data.get("symptoms", "Not available")
    causes = data.get("causes", "Not available")
    treatment = data.get("treatment", "Not available")
    prevention = data.get("prevention", "Not available")
    image_b64 = data.get("image_b64", "")

    try:
        import base64
        from reportlab.lib import colors
        from reportlab.lib.pagesizes import letter
        from reportlab.lib.styles import getSampleStyleSheet
        from reportlab.lib.units import inch
        from reportlab.platypus import Image, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle
    except ImportError:
        return jsonify({"success": False, "error": "ReportLab package is missing."}), 400

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=letter, rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40
    )
    styles = getSampleStyleSheet()
    story = []

    story.append(Paragraph("Plantexa AI - Plant Disease Diagnostic Report", styles["Title"]))
    story.append(Spacer(1, 15))

    meta_table = [
        [
            Paragraph("<b>Diagnosis:</b>", styles["Normal"]),
            Paragraph(f"<b>{disease}</b>", styles["Normal"]),
        ],
        [
            Paragraph("<b>Confidence Score:</b>", styles["Normal"]),
            Paragraph(f"{confidence}%", styles["Normal"]),
        ],
        [
            Paragraph("<b>Date & Time:</b>", styles["Normal"]),
            Paragraph(datetime.now(IST).strftime("%B %d, %Y - %I:%M %p IST"), styles["Normal"]),
        ],
    ]
    t_meta = Table(meta_table, colWidths=[150, 380])
    t_meta.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f4f9f4")),
                ("PADDING", (0, 0), (-1, -1), 8),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#52b788")),
            ]
        )
    )
    story.append(t_meta)
    story.append(Spacer(1, 12))

    # Render Current Uploaded Leaf Photo in Generated PDF Report
    if image_b64:
        try:
            raw_b64 = image_b64.split(",", 1)[1] if "," in image_b64 else image_b64
            img_bytes = base64.b64decode(raw_b64)
            img_io = io.BytesIO(img_bytes)
            leaf_img = Image(img_io, width=2.4 * inch, height=2.4 * inch)
            leaf_img.hAlign = "CENTER"
            story.append(Paragraph("<font color='#1b4332'><b>Analyzed Leaf Sample Photo:</b></font>", styles["Heading3"]))
            story.append(Spacer(1, 6))
            story.append(leaf_img)
            story.append(Spacer(1, 12))
        except Exception:
            pass

    sections = [
        ("Symptoms", symptoms),
        ("Causes", causes),
        ("Treatment & Management", treatment),
        ("Prevention Strategies", prevention),
    ]

    for title, content in sections:
        story.append(Paragraph(f"<font color='#1b4332'><b>{title}</b></font>", styles["Heading3"]))
        story.append(Spacer(1, 4))
        cleaned_content = content.replace("\n", "<br/>")
        story.append(Paragraph(cleaned_content, styles["Normal"]))
        story.append(Spacer(1, 10))

    def add_footer(canvas, doc):
        canvas.saveState()
        canvas.setFont("Helvetica", 9)
        canvas.setFillColor(colors.dimgrey)
        footer_text = f"Plantexa AI Plant Disease Report - Page {doc.page}"
        canvas.drawCentredString(letter[0] / 2.0, 0.5 * inch, footer_text)
        canvas.restoreState()

    doc.build(story, onFirstPage=add_footer, onLaterPages=add_footer)
    buffer.seek(0)

    safe_name = re.sub(r"[^a-zA-Z0-9]+", "_", disease).strip("_").lower()
    filename = f"plantexa_report_{safe_name}.pdf"

    return send_file(
        buffer,
        mimetype="application/pdf",
        as_attachment=True,
        download_name=filename,
    )
