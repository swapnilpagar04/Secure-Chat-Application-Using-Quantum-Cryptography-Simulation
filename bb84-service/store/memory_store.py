# Simple in-memory key store: keyId -> key bytes

import time
import secrets
from typing import Dict, Optional


KEY_STORE: Dict[str, bytes] = {}


def save_key(key_bytes: bytes) -> str:
    """Save key bytes and return a new keyId."""
    key_id = f"k_{int(time.time())}_{secrets.token_hex(8)}"
    KEY_STORE[key_id] = key_bytes
    return key_id


def get_key(key_id: str) -> Optional[bytes]:
    return KEY_STORE.get(key_id)


def count_keys() -> int:
    return len(KEY_STORE)