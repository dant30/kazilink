import hashlib
import hmac
import secrets


def generate_secure_token(length=32):
    return secrets.token_urlsafe(length)


def hash_value(value, salt=None):
    salt = salt or secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac('sha256', str(value).encode('utf-8'), salt.encode('utf-8'), 120000)
    return f'{salt}${digest.hex()}'


def verify_secure_token(value, encoded):
    try:
        salt, expected = encoded.split('$', 1)
    except ValueError:
        return False
    actual = hashlib.pbkdf2_hmac('sha256', str(value).encode('utf-8'), salt.encode('utf-8'), 120000).hex()
    return hmac.compare_digest(actual, expected)
