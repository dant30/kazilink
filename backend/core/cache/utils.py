from django.core.cache import cache


def cache_get_or_set(key, callback, timeout=300):
    value = cache.get(key)
    if value is None:
        value = callback()
        cache.set(key, value, timeout)
    return value


def invalidate(*keys):
    if keys:
        cache.delete_many(keys)
