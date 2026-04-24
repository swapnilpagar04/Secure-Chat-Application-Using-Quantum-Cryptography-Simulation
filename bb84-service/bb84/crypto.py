# AES-256-GCM encryption helpers used with BB84-derived keys

import base64
from Crypto.Cipher import AES
import os
from typing import Tuple


def aes_encrypt(key: bytes, plaintext: str) -> Tuple[str, str, str]:
    """Encrypt plaintext with AES-256-GCM.

    Returns (iv_b64, ciphertext_b64, tag_b64).
    """
    iv = os.urandom(12)  # 96-bit IV
    cipher = AES.new(key, AES.MODE_GCM, nonce=iv)
    ciphertext_bytes, tag = cipher.encrypt_and_digest(plaintext.encode("utf-8"))

    iv_b64 = base64.b64encode(iv).decode("utf-8")
    ct_b64 = base64.b64encode(ciphertext_bytes).decode("utf-8")
    tag_b64 = base64.b64encode(tag).decode("utf-8")
    return iv_b64, ct_b64, tag_b64


def aes_decrypt(key: bytes, iv_b64: str, ct_b64: str, tag_b64: str) -> str:
    """Decrypt AES-256-GCM ciphertext.

    Raises if authentication fails.
    """
    iv = base64.b64decode(iv_b64)
    ciphertext_bytes = base64.b64decode(ct_b64)
    tag = base64.b64decode(tag_b64)

    cipher = AES.new(key, AES.MODE_GCM, nonce=iv)
    plaintext_bytes = cipher.decrypt_and_verify(ciphertext_bytes, tag)
    return plaintext_bytes.decode("utf-8")