from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import re
from scipy.sparse import hstack
from pathlib import Path

app = FastAPI(title="Fraud Predictor API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and vectorizer with absolute paths
MODEL_DIR = Path(__file__).parent.absolute()
model = joblib.load(MODEL_DIR / "fraud_model.pkl")
vectorizer = joblib.load(MODEL_DIR / "vectorizer.pkl")


class JobData(BaseModel):
    title: str = ""
    description: str = ""
    requirements: str = ""
    offer: str = ""
    salaryRange: float = 0
    hasCompanyLogo: int = 0


class PredictionResponse(BaseModel):
    fraudScore: float


def clean_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-zA-Z ]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "service": "Fraud Predictor API"}


@app.post("/predict", response_model=PredictionResponse)
async def predict_fraud(job_data: JobData) -> PredictionResponse:
    combined_text = (
        f"{job_data.title} "
        f"{job_data.description} "
        f"{job_data.requirements} "
        f"{job_data.offer}"
    )

    cleaned = clean_text(combined_text)
    text_vectorized = vectorizer.transform([cleaned])

    salary_array = np.array([[job_data.salaryRange]])
    logo_array = np.array([[job_data.hasCompanyLogo]])

    combined_features = hstack([text_vectorized, salary_array, logo_array])

    prob = model.predict_proba(combined_features)[0][1]

    return PredictionResponse(
        fraudScore=float(round(prob, 3))
    )
