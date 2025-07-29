---

## 🧠 YOLOv10 FastAPI Inference Server

A lightweight HTTP server using **FastAPI** to perform object detection using a locally trained **YOLOv10** model.
Uploads an image → performs inference → returns a **JPEG image** with bounding boxes and labels drawn.

---

### 📦 Installation

```bash
# 1. Clone the repo or navigate to the directory containing main.py and infer.py

# 2. Create and activate a virtual environment (venv or conda, whiever you prefer)
python -m venv venv
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt
```

---

### 🚀 Running the Server

```bash
uvicorn main:app --reload
```

* The API will be available at:
  `http://localhost:8000/infer`

---

### 📤 Making a Request (Postman)

1. Open Postman
2. Set method to **POST**
3. Set URL to: `http://localhost:8000/infer`
4. Under **Body → form-data**:

   * Key: `file` (set **type** to `File`)
   * Value: Upload an image file
5. Click **Send**

The response will be a **JPEG image** with detection results drawn on it (you can download it from the Postman response viewer).

---

### 🗂 File Structure and Purpose

| File               | Description                                                                                                                    |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `main.py`          | FastAPI entrypoint. Exposes `/infer` endpoint, accepts image uploads and returns annotated results.                            |
| `infer.py`         | Contains all inference logic using Ultralytics YOLOv10. Handles image resizing, drawing bounding boxes, and formatting labels. |
| `requirements.txt` | Required Python packages to run the server and inference.                                                                      |

---

### 🔍 Notes on Image Handling

* ✅ The model was trained on 640x640 images.
* ✅ Incoming images of **any size** are accepted. The Ultralytics `YOLO.predict()` call handles resizing internally:

  ```python
  model.predict(image, imgsz=640)
  ```
* 💡 You do **not** need to resize images manually; the API supports variable-sized images during inference and will automatically reshape them to match the model's expected input size.

---

### 🖼️ Label Format

Bounding box labels are formatted as:

```
Name: <class name>, Confidence: <score>
```

e.g.:

```
Name: cancer_type_1, Confidence: 0.93
```

---

### ✅ Example Response

You’ll receive a JPEG image with red boxes and red labels like:

```
┌────────────┐
│            │
│            │ ← bounding box
│            │
└────────────┘
Name: cancer_type_1, Confidence: 0.93
```

---

### 🔧 To Do (Optional Enhancements)

* Return both image + JSON in a `multipart` response to support FE
* Add batch support for multiple files ??

---

Let me know if you’d like to generate a test HTML client or convert this into a Dockerized service.
