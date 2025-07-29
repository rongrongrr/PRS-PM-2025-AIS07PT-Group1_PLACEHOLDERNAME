from fastapi import FastAPI, File, UploadFile
from fastapi.responses import StreamingResponse
from infer import run_inference_and_annotate
from PIL import Image
import io

app = FastAPI()

@app.post("/infer")
async def infer_image(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        result_img_bytes = run_inference_and_annotate(image)

        return StreamingResponse(io.BytesIO(result_img_bytes), media_type="image/jpeg")
    except Exception as e:
        return {"error": str(e)}
