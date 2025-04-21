from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import logging
from typing import List, Dict, Any
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:8080",
        "http://localhost:8080",
        "https://healthdetective.site",
        "http://healthdetective.site"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load diseases data
def load_diseases_data() -> Dict[str, Any]:
    try:
        with open("data/indian_diseases.json", "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        logger.error("Diseases data file not found")
        return {}
    except json.JSONDecodeError:
        logger.error("Invalid JSON in diseases data file")
        return {}
    except Exception as e:
        logger.error(f"Error loading diseases data: {str(e)}")
        return {}

diseases_data = load_diseases_data()

class SymptomRequest(BaseModel):
    symptoms: List[str]

@app.get("/diseases")
async def get_diseases():
    """Get list of all diseases and their symptoms"""
    try:
        diseases = []
        for disease, data in diseases_data.items():
            diseases.append({
                "name": disease,
                "symptoms": data["symptoms"],
                "description": data["description"]
            })
        return {"diseases": diseases}
    except Exception as e:
        logger.error(f"Error getting diseases: {str(e)}")
        raise HTTPException(status_code=500, detail="Error retrieving diseases data")

@app.post("/predict")
async def predict_disease(request: SymptomRequest):
    """Predict possible diseases based on symptoms"""
    try:
        logger.info(f"Received symptoms: {request.symptoms}")
        
        if not request.symptoms:
            raise HTTPException(status_code=400, detail="No symptoms provided")
        
        # Convert symptoms to lowercase for case-insensitive matching
        input_symptoms = [symptom.lower() for symptom in request.symptoms]
        
        # Find matching diseases
        matching_diseases = []
        for disease, data in diseases_data.items():
            disease_symptoms = [symptom.lower() for symptom in data["symptoms"]]
            matching_symptoms = [symptom for symptom in input_symptoms if symptom in disease_symptoms]
            
            if matching_symptoms:
                match_percentage = (len(matching_symptoms) / len(input_symptoms)) * 100
                matching_diseases.append({
                    "disease": disease,
                    "match_percentage": round(match_percentage, 2),
                    "description": data["description"],
                    "precautions": data["precautions"],
                    "medications": data["medications"]
                })
        
        # Sort by match percentage and take top 3
        matching_diseases.sort(key=lambda x: x["match_percentage"], reverse=True)
        matching_diseases = matching_diseases[:3]  # Limit to top 3 matches
        
        logger.info(f"Found {len(matching_diseases)} matching diseases")
        return {"predictions": matching_diseases}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error predicting disease: {str(e)}")
        raise HTTPException(status_code=500, detail="Error processing prediction request")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 