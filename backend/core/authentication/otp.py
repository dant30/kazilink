import hashlib
import secrets


def generate_otp(length=6):
    if length < 4:
        raise ValueError('OTP length must be at least 4.')
    return ''.join(str(secrets.randbelow(10)) for _ in range(length))


def hash_otp(code):
    return hashlib.sha256(str(code).encode('utf-8')).hexdigest()


def verify_otp(code, expected_hash):
    return secrets.compare_digest(hash_otp(code), expected_hash)
