import json
from functools import lru_cache
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
DISEASE_INFO_PATH = BASE_DIR / "disease_info.json"


class DiseaseInfoError(Exception):
    """Raised when disease metadata cannot be loaded."""


@lru_cache(maxsize=1)
def load_disease_info():
    try:
        with DISEASE_INFO_PATH.open("r", encoding="utf-8") as file:
            data = json.load(file)
        return data
    except Exception as e:
        raise DiseaseInfoError(
            f"Unable to load disease info: {e}"
        ) from e


def normalize_key(text):
    if not text:
        return ""
    return str(text).lower().replace("_", "").replace("-", "").replace(" ", "").replace("(", "").replace(")", "")


def generate_fallback_info(class_name):
    clean_name = str(class_name).replace("_", " ").replace("  ", " ").strip()
    is_healthy = "healthy" in clean_name.lower()

    if is_healthy:
        return {
            "disease_name": f"{clean_name.title()} (Healthy)",
            "symptoms": "Foliage exhibits lush green color, firm tissue texture, normal development, and no signs of lesions, wilting, or fungal growth.",
            "causes": "Optimal plant health supported by balanced soil nutrients, adequate sunlight, consistent drip irrigation, and good canopy airflow.",
            "treatment": "No chemical or curative treatment required. Maintain current agronomic schedule and routine weekly monitoring.",
            "prevention": "Practice crop rotation, maintain soil organic matter, avoid overhead irrigation, and prune overcrowded foliage to sustain health."
        }
    
    # Generic smart agricultural diagnostic fallback for diseased plants
    return {
        "disease_name": clean_name.title(),
        "symptoms": f"Observed symptoms on {clean_name}: leaf spot lesions, localized chlorosis (yellowing), tissue discoloration, and reduced photosynthetic efficiency.",
        "causes": f"Fungal, bacterial, or viral pathogen colonization on foliage, aggravated by high relative humidity, leaf wetness, and dense canopy growth.",
        "treatment": f"Prune heavily infected lower leaves. Apply appropriate organic or chemical fungicides/bactericides targeted for {clean_name} according to local agronomic guidelines.",
        "prevention": "Utilize certified disease-free seeds/transplants, implement drip irrigation to reduce leaf wetness, maintain proper plant spacing, and sanitize farm tools."
    }


def get_disease_details(class_name):
    disease_data = load_disease_info()
    if not class_name:
        return generate_fallback_info("Unknown Crop Condition")

    # 1. Exact match
    if class_name in disease_data:
        details = disease_data[class_name]
        return {
            "disease_name": details.get("disease_name", class_name),
            "symptoms": details.get("symptoms") or "Leaf lesions and chlorosis observed.",
            "causes": details.get("causes") or "Pathogen colonization under humid conditions.",
            "treatment": details.get("treatment") or "Prune affected leaves and apply targeted treatment.",
            "prevention": details.get("prevention") or "Practice crop rotation and maintain good airflow.",
        }

    # 2. Normalized key match
    norm_target = normalize_key(class_name)
    for raw_key, details in disease_data.items():
        if normalize_key(raw_key) == norm_target or normalize_key(details.get("disease_name", "")) == norm_target:
            return {
                "disease_name": details.get("disease_name", class_name),
                "symptoms": details.get("symptoms"),
                "causes": details.get("causes"),
                "treatment": details.get("treatment"),
                "prevention": details.get("prevention"),
            }

    # 3. Partial keyword match (e.g. "Early Blight" in key)
    for raw_key, details in disease_data.items():
        norm_key = normalize_key(raw_key)
        if norm_target in norm_key or norm_key in norm_target:
            return {
                "disease_name": details.get("disease_name", class_name),
                "symptoms": details.get("symptoms"),
                "causes": details.get("causes"),
                "treatment": details.get("treatment"),
                "prevention": details.get("prevention"),
            }

    # 4. Fallback generator
    return generate_fallback_info(class_name)


