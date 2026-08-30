from django.contrib.auth.hashers import check_password, make_password


def hash_password(password):
    return make_password(password)


def verify_password(password, password_hash):
    return check_password(password, password_hash)
