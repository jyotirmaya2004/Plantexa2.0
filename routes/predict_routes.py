"""Prediction routes for Flask application."""

from flask import Blueprint, jsonify, request

from backend.disease_info import get_disease_details
from backend.predict_two_stage import PredictionError, predict_two_stage

predict_bp = Blueprint("predict", __name__)


@predict_bp.route("/api/predict", methods=["POST"])
def predict():
    if "file" not in request.files and "image" not in request.files:
        return jsonify({"success": False, "error": "No image file provided."}), 400

    file = request.files.get("file") or request.files.get("image")
    if not file or file.filename == "":
        return jsonify({"success": False, "error": "No selected file."}), 400

    try:
        image_bytes = file.read()
        if not image_bytes:
            return jsonify({"success": False, "error": "Uploaded file is empty."}), 400

        result = predict_two_stage(image_bytes, top_k=3)
        disease_name = result.get("disease")
        disease_info = get_disease_details(disease_name) if disease_name else None

        return jsonify(
            {
                "success": True,
                "data": result,
                "disease_info": disease_info,
            }
        )
    except PredictionError as pe:
        return jsonify({"success": False, "error": str(pe)}), 422
    except Exception as exc:
        return jsonify({"success": False, "error": f"An unexpected error occurred: {exc}"}), 500
