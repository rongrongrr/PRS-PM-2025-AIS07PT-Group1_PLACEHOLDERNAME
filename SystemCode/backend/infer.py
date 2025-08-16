from ultralytics import YOLO
from PIL import Image, ImageDraw, ImageFont
import io

model = YOLO("yolov10nano_skin_detection_400runs.pt")
model.to("cpu")  # Force CPU inference

# Mapping from abbreviation to full name
FULL_NAMES = {
    "akiec": "Actinic keratoses and intraepithelial carcinoma / Bowen's disease",
    "bcc": "Basal cell carcinoma",
    "bkl": "Benign keratosis-like lesions (solar lentigines / seborrheic keratoses and lichen-planus like keratoses)",
    "df": "Dermatofibroma",
    "mel": "Melanoma",
    "nv": "Melanocytic nevi",
    "vasc": "Vascular lesions (angiomas, angiokeratomas, pyogenic granulomas and hemorrhage)"
}

def run_inference_and_annotate(image: Image.Image) -> bytes:
    results = model.predict(image, imgsz=640)[0]
    draw = ImageDraw.Draw(image)
    # Use a larger font size (e.g., 24)
    try:
        font = ImageFont.truetype("arial.ttf", 24)
    except IOError:
        font = ImageFont.load_default()
    detections = []

    for box in results.boxes:
        x1, y1, x2, y2 = map(int, box.xyxy[0])
        cls_id = int(box.cls[0])
        conf = float(box.conf[0])
        abbr = model.names[cls_id]
        fullname = FULL_NAMES.get(abbr.lower(), abbr.lower())
        label_text = f"Name: {abbr}, Confidence: {conf:.2f}"
        detections.append({
            "name": f"{fullname} ({abbr})",
            "confidence": conf
        })
        # Draw rectangle
        draw.rectangle([x1, y1, x2, y2], outline="red", width=2)

        # Simulate bold by drawing text multiple times
        text_gap = 32
        for offset in [(0, 0), (1, 0), (0, 1), (1, 1)]:
            draw.text((x1 + offset[0], y1 - text_gap + offset[1]), label_text, fill="red", font=font)

    # Convert back to JPEG for response
    buf = io.BytesIO()
    image.save(buf, format="JPEG")
    buf.seek(0)
    return buf.read(), detections
