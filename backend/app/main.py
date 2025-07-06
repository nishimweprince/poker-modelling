from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.routes import hands

load_dotenv()

app = FastAPI(title="Texas Hold'em Poker Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(hands.router, prefix="/api", tags=["hands"])

@app.get("/")
async def root():
    return {"message": "Texas Hold'em Poker Backend API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
