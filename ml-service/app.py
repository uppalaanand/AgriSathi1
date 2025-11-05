#original 1
# import os
# from fastapi import FastAPI
# from pydantic import BaseModel
# import base64, io, json
# from PIL import Image
# import numpy as np
# import requests
# from datetime import datetime, timedelta

# app = FastAPI()

# ROBOFLOW_KEY = os.getenv('ROBOFLOW_API_KEY')
# TF_MODEL_PATH = os.getenv('TF_MODEL_PATH','./models/plant_disease_model.h5')

# class ImageRequest(BaseModel):
#     imageBase64: str
#     crop: str = None
#     location: str = None

# @app.post("/predict_disease")
# async def predict_disease(payload: ImageRequest):
#     # try Roboflow first
#     if ROBOFLOW_KEY:
#         try:
#             headers = {"Authorization": f"Bearer {ROBOFLOW_KEY}", "Content-Type":"application/json"}
#             # Roboflow example: send base64 image to their predict endpoint (URL depends on your model)
#             # For demonstrative purposes, we show a mock call (update with your Roboflow model URL)
#             rf_url = "https://api.roboflow.com/detect/your-model/version/predict"
#             resp = requests.post(rf_url, headers=headers, json={"image": payload.imageBase64})
#             data = resp.json()
#             # parse Roboflow response
#             # return simplified
#             return {"disease": data.get('predictions',[{}])[0].get('class','unknown'),
#                     "severity":"moderate",
#                     "advice":"Use recommended fungicide + remove infected leaves"}
#         except Exception as e:
#             print("Roboflow failed:", e)

#     # fallback: basic TensorFlow model (mock if model absent)
#     if os.path.exists(TF_MODEL_PATH):
#         # load and predict (omitted heavy logic)
#         return {"disease":"Leaf Blight", "severity":"high","advice":"Apply copper-based fungicide"}
#     else:
#         # mock result
#         return {"disease":"Healthy", "severity":"none","advice":"No action required. Keep monitoring."}

# @app.get("/forecast_price")
# async def forecast_price(crop: str = "wheat", market: str = "default"):
#     # In a real implementation: load historical mandi data and use Prophet or LSTM to produce forecast.
#     # Here: return a simple mocked forecast for 7 days
#     base = 1200
#     forecast = []
#     for i in range(7):
#         dt = (datetime.utcnow() + timedelta(days=i)).strftime('%Y-%m-%d')
#         forecast.append({"date":dt, "predicted_price": base + i*5 + (i%2)*10})
#     return {"crop":crop, "market":market, "forecast": forecast, "model":"mock_prophet"}

# @app.post("/recommend_crop")
# async def recommend_crop(data: dict):
#     # expect { ph, nitrogen, phosphorus, potassium, moisture, season }
#     # Use a trained RF/XGBoost model; fallback rule-based
#     ph = data.get('ph',7)
#     season = data.get('season','kharif')
#     if ph >=6 and ph <=7.5 and season=='kharif':
#         return {"recommendations": ["Rice","Maize"], "confidence":0.8}
#     return {"recommendations":["Green Gram"], "confidence":0.5}

#original 2
# import os
# from fastapi import FastAPI
# from pydantic import BaseModel
# import base64, io, json
# from PIL import Image
# import numpy as np
# import requests
# from datetime import datetime, timedelta

# app = FastAPI(title="Agri ML Service")


# from fastapi.middleware.cors import CORSMiddleware

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # allow frontend
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Load environment variables
# ROBOFLOW_KEY = os.getenv('ROBOFLOW_API_KEY')
# TF_MODEL_PATH = os.getenv('TF_MODEL_PATH', './models/plant_disease_model.h5')

# # ---------- Request Models ----------
# class ImageRequest(BaseModel):
#     imageBase64: str
#     crop: str = None
#     location: str = None

# # ---------- Utility ----------
# def safe_json_response(data: dict):
#     """Ensure response is always JSON and never empty"""
#     return {**data, "status": "success"}

# # ---------- Endpoints ----------

# @app.post("/predict_disease")
# async def predict_disease(payload: ImageRequest):
#     """Predict crop disease using Roboflow or fallback TensorFlow/mock"""
#     response = {"disease": "Unknown", "severity": "unknown", "advice": "No advice available"}

#     # Try Roboflow
#     if ROBOFLOW_KEY:
#         try:
#             headers = {"Authorization": f"Bearer {ROBOFLOW_KEY}", "Content-Type": "application/json"}
#             rf_url = "https://api.roboflow.com/detect/your-model/version/predict"
#             resp = requests.post(rf_url, headers=headers, json={"image": payload.imageBase64}, timeout=10)
#             data = resp.json()
#             if "predictions" in data and data["predictions"]:
#                 pred = data["predictions"][0]
#                 response.update({
#                     "disease": pred.get("class", "unknown"),
#                     "severity": "moderate",
#                     "advice": "Use recommended fungicide + remove infected leaves"
#                 })
#             else:
#                 response.update({"disease":"Healthy", "severity":"none","advice":"No action required."})
#         except Exception as e:
#             print("⚠ Roboflow failed:", e)
#             response.update({"disease":"Fallback","severity":"unknown","advice":"Roboflow call failed, using fallback."})

#     # TensorFlow fallback
#     elif os.path.exists(TF_MODEL_PATH):
#         # TODO: load model and predict (currently mocked)
#         response.update({"disease":"Leaf Blight", "severity":"high","advice":"Apply copper-based fungicide"})
#     else:
#         # Default mock
#         response.update({"disease":"Healthy", "severity":"none","advice":"No action required. Keep monitoring."})

#     return safe_json_response(response)


# @app.get("/forecast_price")
# async def forecast_price(crop: str = "wheat", market: str = "default"):
#     """Return a mocked 7-day crop price forecast"""
#     base_price = 1200
#     forecast = []
#     for i in range(7):
#         dt = (datetime.utcnow() + timedelta(days=i)).strftime('%Y-%m-%d')
#         forecast.append({
#             "date": dt,
#             "predicted_price": base_price + i*5 + (i%2)*10
#         })
#     response = {
#         "crop": crop,
#         "market": market,
#         "forecast": forecast,
#         "model": "mock_prophet"
#     }
#     return safe_json_response(response)


# @app.post("/recommend_crop")
# async def recommend_crop(data: dict):
#     print("Received recommendation request:", data)
#     """Recommend crops based on soil and season info"""
#     ph = data.get('ph', 7)
#     season = data.get('season', 'kharif')
#     recommendations = ["Green Gram"]
#     confidence = 0.5

#     # Rule-based simple recommendation
#     if 6 <= ph <= 7.5 and season.lower() == 'kharif':
#         recommendations = ["Rice", "Maize"]
#         confidence = 0.8

#     response = {
#         "recommendations": recommendations,
#         "confidence": confidence
#     }
#     return safe_json_response(response)

#original 3
# import os
# from fastapi import FastAPI
# from pydantic import BaseModel
# from fastapi.middleware.cors import CORSMiddleware
# from datetime import datetime, timedelta
# import numpy as np
# import pickle
# import requests
# import traceback

# app = FastAPI(title="Agri ML Service")

# # -------------------- CORS --------------------
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # -------------------- MODEL LOADING --------------------
# MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "crop_recommendation.pkl")

# try:
#     with open(MODEL_PATH, "rb") as f:
#         model = pickle.load(f)
#     print(f"✅ Loaded crop recommendation model from {MODEL_PATH}")
# except Exception as e:
#     print(f"⚠ Could not load model: {e}")
#     model = None

# # -------------------- REQUEST MODEL --------------------
# class CropInput(BaseModel):
#     nitrogen: float
#     phosphorus: float
#     potassium: float
#     ph: float
#     moisture: float
#     season: str = "kharif"

# class ImageRequest(BaseModel):
#     imageBase64: str
#     crop: str = None
#     location: str = None

# # -------------------- UTILS --------------------
# def safe_json_response(data: dict):
#     return {**data, "status": "success"}

# # -------------------- ENDPOINTS --------------------

# @app.post("/ml/recommend_crop")
# async def recommend_crop(payload: CropInput):
#     """
#     Predict best crop using trained ML model (.pkl)
#     """
#     try:
#         # Ensure model is loaded
#         if not model:
#             return {"recommendations": ["Green Gram"], "confidence": 0.5, "error": "Model not loaded"}

#         # Prepare input
#         features = np.array([[payload.nitrogen, payload.phosphorus, payload.potassium,
#                               payload.moisture, payload.ph, 1 if payload.season.lower() == "kharif" else 0]])
        
#         # Predict
#         print("Features for prediction:", features)
#         pred = model.predict(features)[0]
#         if hasattr(model, "predict_proba"):
#             conf = float(np.max(model.predict_proba(features)))
#         else:
#             conf = 0.8

#         return safe_json_response({
#             "recommendations": [pred],
#             "confidence": round(conf, 2)
#         })

#     except Exception as e:
#         print("⚠ Prediction error:", e)
#         traceback.print_exc()
#         return {"recommendations": ["Green Gram"], "confidence": 0.5, "error": str(e)}


# @app.get("/ml/price-forecast")
# async def forecast_price(crop: str = "wheat", market: str = "default"):
#     """Mocked 7-day forecast (you can later connect a Prophet/LSTM model here)"""
#     base_price = 1200
#     forecast = []
#     for i in range(7):
#         dt = (datetime.utcnow() + timedelta(days=i)).strftime('%Y-%m-%d')
#         forecast.append({"date": dt, "predicted_price": base_price + i * 5 + (i % 2) * 10})

#     return safe_json_response({
#         "crop": crop,
#         "market": market,
#         "forecast": forecast,
#         "model": "mock_prophet"
#     })


# @app.post("/ml/disease")
# async def predict_disease(payload: ImageRequest):
#     """Mock Roboflow/TensorFlow disease detection"""
#     return safe_json_response({
#         "disease": "Healthy",
#         "severity": "none",
#         "advice": "No action required. Keep monitoring."
#     })

# # -------------------- HEALTH CHECK --------------------
# @app.get("/")
# def home():
#     return {"message": "Agri ML Service running ✅"}

#original original 1
# import os
# from fastapi import FastAPI
# from pydantic import BaseModel
# from fastapi.middleware.cors import CORSMiddleware
# import numpy as np
# import pickle
# import traceback
# from datetime import datetime, timedelta

# app = FastAPI(title="Agri ML Service")

# # -------------------- CORS --------------------
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # -------------------- LOAD MODELS & SCALERS --------------------

# MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "crop_recommendation.pkl")
# STD_PATH = os.path.join(os.path.dirname(__file__), "models", "standscaler.pkl")
# MINMAX_PATH = os.path.join(os.path.dirname(__file__), "models", "minmaxscaler.pkl")


# try:
#     model = pickle.load(open(MODEL_PATH, 'rb'))
#     sc = pickle.load(open(STD_PATH, 'rb'))
#     mx = pickle.load(open(MINMAX_PATH, 'rb'))
#     print("✅ Loaded crop recommendation model and scalers")
# except Exception as e:
#     print("⚠ Could not load model/scalers:", e)
#     model, sc, mx = None, None, None

# # -------------------- REQUEST MODELS --------------------
# class CropInput(BaseModel):
#     nitrogen: float
#     phosphorus: float
#     potassium: float
#     temperature: float
#     humidity: float
#     ph: float
#     rainfall: float

# class ImageRequest(BaseModel):
#     imageBase64: str
#     crop: str = None
#     location: str = None

# # -------------------- UTILS --------------------
# def safe_json_response(data: dict):
#     return {**data, "status": "success"}

# # -------------------- ENDPOINTS --------------------

# @app.post("/ml/recommend_crop")
# async def recommend_crop(payload: CropInput):
#     try:
#         if not all([model, sc, mx]):
#             return {"recommendations": ["Green Gram"], "confidence": 0.5, "error": "Model or scalers not loaded"}

#         # Prepare input
#         feature_list = [
#             payload.nitrogen, payload.phosphorus, payload.potassium,
#             payload.temperature, payload.humidity, payload.ph, payload.rainfall
#         ]
#         features = np.array(feature_list).reshape(1, -1)

#         # Apply MinMaxScaler and StandardScaler
#         features_mx = mx.transform(features)
#         features_scaled = sc.transform(features_mx)

#         # Predict crop
#         prediction = model.predict(features_scaled)[0]

#         # Crop dictionary mapping
#         crop_dict = {
#             1: "Rice", 2: "Maize", 3: "Jute", 4: "Cotton", 5: "Coconut", 6: "Papaya",
#             7: "Orange", 8: "Apple", 9: "Muskmelon", 10: "Watermelon", 11: "Grapes",
#             12: "Mango", 13: "Banana", 14: "Pomegranate", 15: "Lentil", 16: "Blackgram",
#             17: "Mungbean", 18: "Mothbeans", 19: "Pigeonpeas", 20: "Kidneybeans",
#             21: "Chickpea", 22: "Coffee"
#         }

#         crop_name = crop_dict.get(prediction, "Unknown")
#         result_text = f"{crop_name} is the best crop to be cultivated right there."

#         return safe_json_response({
#             "recommendations": [crop_name],
#             "confidence": 0.9,
#             "message": result_text
#         })

#     except Exception as e:
#         print("⚠ Prediction error:", e)
#         traceback.print_exc()
#         return {"recommendations": ["Green Gram"], "confidence": 0.5, "error": str(e)}


# @app.get("/price-forecast")
# async def forecast_price(crop: str = "wheat", market: str = "default"):
#     """Mocked 7-day forecast"""
#     base_price = 1200
#     forecast = []
#     for i in range(7):
#         dt = (datetime.utcnow() + timedelta(days=i)).strftime('%Y-%m-%d')
#         forecast.append({"date": dt, "predicted_price": base_price + i * 5 + (i % 2) * 10})

#     return safe_json_response({
#         "crop": crop,
#         "market": market,
#         "forecast": forecast,
#         "model": "mock_prophet"
#     })


# @app.post("/ml/disease")
# async def predict_disease(payload: ImageRequest):
#     """Mock Roboflow/TensorFlow disease detection"""
#     return safe_json_response({
#         "disease": "Healthy",
#         "severity": "none",
#         "advice": "No action required. Keep monitoring."
#     })


# @app.get("/")
# def home():
#     return {"message": "Agri ML Service running ✅"}



import os
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import pickle
import traceback
from datetime import datetime, timedelta

app = FastAPI(title="Agri ML Service")

# -------------------- CORS --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- LOAD MODELS & SCALERS --------------------

MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "crop_recommendation.pkl")
STD_PATH = os.path.join(os.path.dirname(__file__), "models", "standscaler.pkl")
MINMAX_PATH = os.path.join(os.path.dirname(__file__), "models", "minmaxscaler.pkl")


try:
    model = pickle.load(open(MODEL_PATH, 'rb'))
    sc = pickle.load(open(STD_PATH, 'rb'))
    mx = pickle.load(open(MINMAX_PATH, 'rb'))
    print("✅ Loaded crop recommendation model and scalers")
except Exception as e:
    print("⚠ Could not load model/scalers:", e)
    model, sc, mx = None, None, None

# -------------------- REQUEST MODELS --------------------
class CropInput(BaseModel):
    nitrogen: float
    phosphorus: float
    potassium: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float

class ImageRequest(BaseModel):
    imageBase64: str
    crop: str = None
    location: str = None

# -------------------- UTILS --------------------
def safe_json_response(data: dict):
    return {**data, "status": "success"}

# -------------------- ENDPOINTS --------------------

@app.post("/ml/recommend_crop")
async def recommend_crop(payload: CropInput):
    try:
        if not all([model, sc, mx]):
            return {"recommendations": ["Green Gram"], "confidence": 0.5, "error": "Model or scalers not loaded"}

        # Prepare input
        feature_list = [
            payload.nitrogen, payload.phosphorus, payload.potassium,
            payload.temperature, payload.humidity, payload.ph, payload.rainfall
        ]
        features = np.array(feature_list).reshape(1, -1)

        # Apply MinMaxScaler and StandardScaler
        features_mx = mx.transform(features)
        features_scaled = sc.transform(features_mx)

        # Predict crop
        prediction = model.predict(features_scaled)[0]

        # Crop dictionary mapping
        crop_dict = {
            1: "Rice", 2: "Maize", 3: "Jute", 4: "Cotton", 5: "Coconut", 6: "Papaya",
            7: "Orange", 8: "Apple", 9: "Muskmelon", 10: "Watermelon", 11: "Grapes",
            12: "Mango", 13: "Banana", 14: "Pomegranate", 15: "Lentil", 16: "Blackgram",
            17: "Mungbean", 18: "Mothbeans", 19: "Pigeonpeas", 20: "Kidneybeans",
            21: "Chickpea", 22: "Coffee"
        }

        crop_name = crop_dict.get(prediction, "Unknown")
        result_text = f"{crop_name} is the best crop to be cultivated right there."

        return safe_json_response({
            "recommendations": [crop_name],
            "confidence": 0.9,
            "message": result_text
        })

    except Exception as e:
        print("⚠ Prediction error:", e)
        traceback.print_exc()
        return {"recommendations": ["Green Gram"], "confidence": 0.5, "error": str(e)}


@app.get("/price-forecast")
async def forecast_price(crop: str = "wheat", market: str = "default"):
    """Mocked 7-day forecast"""
    base_price = 1200
    forecast = []
    for i in range(7):
        dt = (datetime.utcnow() + timedelta(days=i)).strftime('%Y-%m-%d')
        forecast.append({"date": dt, "predicted_price": base_price + i * 5 + (i % 2) * 10})

    return safe_json_response({
        "crop": crop,
        "market": market,
        "forecast": forecast,
        "model": "mock_prophet"
    })


@app.post("/predict_disease")
async def predict_disease(payload: ImageRequest):
    """Mock Roboflow/TensorFlow disease detection"""
    return safe_json_response({
        "disease": "Healthy",
        "severity": "none",
        "advice": "No action required. Keep monitoring."
    })


@app.get("/")
def home():
    return {"message": "Agri ML Service running ✅"}
