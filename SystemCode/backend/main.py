from fastapi import FastAPI, File, UploadFile
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi import Response
import base64
from infer import run_inference_and_annotate
from PIL import Image
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/infer")
async def infer_image(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        img_bytes, detections = run_inference_and_annotate(image)

        # Encode image as base64
        img_base64 = base64.b64encode(img_bytes).decode("utf-8")

        # Return multipart JSON
        return {
            "image": img_base64,
            "detections": detections
        }
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)
