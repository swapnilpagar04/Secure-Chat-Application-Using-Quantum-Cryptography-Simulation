# FastAPI service that exposes BB84 + AES endpoints

from fastapi import FastAPI, HTTPException

from bb84.protocol import run_bb84_session
from bb84.crypto import aes_encrypt, aes_decrypt
from models.schemas import (
    SessionRequest,
    SessionResponse,
    EncryptRequest,
    EncryptResponse,
    DecryptRequest,
    DecryptResponse,
)
from store.memory_store import save_key, get_key, count_keys


app = FastAPI(title="Qchat BB84 Service", version="1.0.0")


@app.post("/bb84/session", response_model=SessionResponse)
async def create_session(req: SessionRequest):
    """Run a BB84 session and create a shared key for two participants.

    In this simulation, we just derive one symmetric key and return a keyId
    that Node.js will use when encrypting/decrypting messages.
    """
    ok, rate, key_bytes = run_bb84_session(
        num_qubits=req.num_qubits, max_error_rate=req.max_error_rate
    )
    if not ok or key_bytes is None:
        raise HTTPException(status_code=500, detail=f"BB84 failed, errorRate={rate}")

    key_id = save_key(key_bytes)
    return SessionResponse(keyId=key_id, errorRate=rate)


@app.post("/bb84/encrypt", response_model=EncryptResponse)
async def encrypt_message(req: EncryptRequest):
    key = get_key(req.keyId)
    if key is None:
        raise HTTPException(status_code=400, detail="Unknown keyId")

    iv_b64, ct_b64, tag_b64 = aes_encrypt(key, req.plaintext)
    return EncryptResponse(
        keyId=req.keyId,
        iv=iv_b64,
        ciphertext=ct_b64,
        tag=tag_b64,
    )


@app.post("/bb84/decrypt", response_model=DecryptResponse)
async def decrypt_message(req: DecryptRequest):
    key = get_key(req.keyId)
    if key is None:
        raise HTTPException(status_code=400, detail="Unknown keyId")

    try:
        plaintext = aes_decrypt(key, req.iv, req.ciphertext, req.tag)
    except Exception as e:  # auth tag failure, corrupted data, etc.
        raise HTTPException(status_code=400, detail=f"Decryption failed: {e}")

    return DecryptResponse(keyId=req.keyId, plaintext=plaintext)


@app.get("/health")
async def health_check():
    return {"status": "ok", "keys": count_keys()}