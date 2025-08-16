from fastapi import FastAPI, File, UploadFile, Query
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
    
CONDITION_DATABASE = {
    "Actinic keratoses and intraepithelial carcinoma / Bowen's disease (akiec)": {
        "fullname": "Actinic keratoses and intraepithelial carcinoma / Bowen's disease",
        "description": "Precancerous skin lesions that may progress to squamous cell carcinoma. Often appear as rough, scaly patches.",
        "symptoms": [
            "Scaly or crusty growths",
            "Red or pink patches",
            "Itching or burning",
            "Bleeding or ulceration"
        ]
    },
    "Basal cell carcinoma (bcc)": {
        "fullname": "Basal cell carcinoma",
        "description": "A common type of skin cancer that arises from basal cells. Usually appears as a pearly bump.",
        "symptoms": [
            "Pearly or waxy bump",
            "Flat, flesh-colored lesion",
            "Bleeding or scabbing sore"
        ]
    },
    "Melanocytic nevi (NV)": {
        "fullname": "Melanocytic nevi",
        "description": "TEST",
        "symptoms": [
            "S1",
            "S2"
        ]
    },
    # Add more conditions as needed...
}

@app.get("/condition-info")
def get_condition_info(name: str = Query(..., description="Full name and abbreviation")):
    info = CONDITION_DATABASE.get(name)
    if info:
        return info
    return JSONResponse(
        status_code=404,
        content={"error": "Condition info not found"}
    )

# Dummy clinics data (matches frontend placeholder)
CLINICS_DATA = [
    {
        "name": "Singapore General Hospital",
        "department": "Dermatology Department",
        "address": "Outram Road, Singapore 169608",
        "rating": "⭐ 4.2 • 2.3 km away",
        "lat": 1.2789,
        "lng": 103.8345
    },
    {
        "name": "National Skin Centre",
        "department": "Specialist Dermatology Clinic",
        "address": "1 Mandalay Road, Singapore 308205",
        "rating": "⭐ 4.5 • 3.1 km away",
        "lat": 1.3211,
        "lng": 103.8483
    },
    {
        "name": "Mount Elizabeth Medical Centre",
        "department": "Private Dermatology Practice",
        "address": "3 Mount Elizabeth, Singapore 228510",
        "rating": "⭐ 4.3 • 1.8 km away",
        "lat": 1.3048,
        "lng": 103.8341
    }
]

@app.get("/clinics")
def get_clinics(lat: float = Query(None), lng: float = Query(None)):
    # For now, just return all clinics (placeholder)
    # In future, filter/sort by distance using lat/lng
    return JSONResponse(content=CLINICS_DATA)