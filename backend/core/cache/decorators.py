from functools import wraps

from django.core.cache import cache


def cached(key_builder, timeout=300):
    def decorator(function):
        @wraps(function)
        def wrapper(*args, **kwargs):
            key = key_builder(*args, **kwargs)
            value = cache.get(key)
            if value is None:
                value = function(*args, **kwargs)
                cache.set(key, value, timeout)
            return value
        return wrapper
    return decorator
