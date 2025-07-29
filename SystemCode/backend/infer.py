from ultralytics import YOLO
from PIL import Image, ImageDraw, ImageFont
import io

model = YOLO("yolov10nano_skin_detection_400runs.pt")
model.to("cpu")  # Force CPU inference

def run_inference_and_annotate(image: Image.Image) -> bytes:
    results = model.predict(image, imgsz=640)[0]
    draw = ImageDraw.Draw(image)
    font = ImageFont.load_default()

    for box in results.boxes:
        x1, y1, x2, y2 = map(int, box.xyxy[0])
        cls_id = int(box.cls[0])
        conf = float(box.conf[0])
        label_text = f"Name: {model.names[cls_id]}, Confidence: {conf:.2f}"

        # Draw rectangle
        draw.rectangle([x1, y1, x2, y2], outline="red", width=2)

        # Simulate bold by drawing text multiple times
        for offset in [(0, 0), (1, 0), (0, 1), (1, 1)]:
            draw.text((x1 + offset[0], y1 - 20 + offset[1]), label_text, fill="red", font=font)

    # Convert back to JPEG for response
    buf = io.BytesIO()
    image.save(buf, format="JPEG")
    buf.seek(0)
    return buf.read()
