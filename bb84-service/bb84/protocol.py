# BB84 quantum key distribution simulation

import os
from typing import Optional, Tuple


def random_bits(n: int) -> str:
    """Return a random bitstring of length n."""
    num_bytes = (n + 7) // 8
    raw = os.urandom(num_bytes)
    bits = "".join(f"{byte:08b}" for byte in raw)
    return bits[:n]


def alice_prepare(num_qubits: int) -> Tuple[str, str]:
    """Alice chooses random bits and random bases (0 = Z, 1 = X)."""
    bits = random_bits(num_qubits)
    bases = random_bits(num_qubits)
    return bits, bases


def bob_measure(alice_bits: str, alice_bases: str) -> Tuple[str, str]:
    """Bob chooses his own random bases and measures (idealized channel)."""
    n = len(alice_bits)
    bob_bases = random_bits(n)
    bob_bits_chars = []

    for i in range(n):
      	# Same basis -> Bob gets Alice's bit; different -> random
        if alice_bases[i] == bob_bases[i]:
            bob_bits_chars.append(alice_bits[i])
        else:
            bob_bits_chars.append(random_bits(1))

    return "".join(bob_bits_chars), bob_bases


def sift_key(
    alice_bits: str,
    alice_bases: str,
    bob_bits: str,
    bob_bases: str,
) -> Tuple[str, str]:
    """Keep only bits where Alice and Bob used the same basis."""
    alice_key = []
    bob_key = []

    for a_bit, a_base, b_bit, b_base in zip(alice_bits, alice_bases, bob_bits, bob_bases):
        if a_base == b_base:
            alice_key.append(a_bit)
            bob_key.append(b_bit)

    return "".join(alice_key), "".join(bob_key)


def error_rate(alice_key: str, bob_key: str) -> float:
    n = min(len(alice_key), len(bob_key))
    if n == 0:
        return 1.0
    errors = sum(1 for i in range(n) if alice_key[i] != bob_key[i])
    return errors / n


def bits_to_key_bytes(bits: str, key_bytes: int = 32) -> bytes:
    """Convert bit string to fixed-length bytes (for AES-256 key)."""
    needed_bits = key_bytes * 8
    if len(bits) < needed_bits:
        bits = bits.ljust(needed_bits, "0")
    else:
        bits = bits[:needed_bits]

    out = bytearray()
    for i in range(0, needed_bits, 8):
        byte_str = bits[i : i + 8]
        out.append(int(byte_str, 2))
    return bytes(out)


def run_bb84_session(
    num_qubits: int = 256,
    max_error_rate: float = 0.11,
) -> Tuple[bool, float, Optional[bytes]]:
    """Run a single BB84 session and return (ok, errorRate, keyBytes or None)."""
    alice_bits, alice_bases = alice_prepare(num_qubits)
    bob_bits, bob_bases = bob_measure(alice_bits, alice_bases)
    alice_key, bob_key = sift_key(alice_bits, alice_bases, bob_bits, bob_bases)

    rate = error_rate(alice_key, bob_key)
    if rate > max_error_rate:
        return False, rate, None

    key_bytes = bits_to_key_bytes(alice_key, 32)  # 256-bit key
    return True, rate, key_bytes