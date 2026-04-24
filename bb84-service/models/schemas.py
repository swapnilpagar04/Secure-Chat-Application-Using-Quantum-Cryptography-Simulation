# Pydantic request/response models for FastAPI

from typing import List
from pydantic import BaseModel, Field


class SessionRequest(BaseModel):
    participants: List[str] = Field(..., min_items=2, max_items=2)
    num_qubits: int = 256
    max_error_rate: float = 0.11


class SessionResponse(BaseModel):
    keyId: str
    errorRate: float


class EncryptRequest(BaseModel):
    keyId: str
    plaintext: str


class EncryptResponse(BaseModel):
    keyId: str
    iv: str
    ciphertext: str
    tag: str


class DecryptRequest(BaseModel):
    keyId: str
    iv: str
    ciphertext: str
    tag: str


class DecryptResponse(BaseModel):
    keyId: str
    plaintext: str