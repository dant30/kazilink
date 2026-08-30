from django.core.files.storage import default_storage


def save_file(path, uploaded_file):
    return default_storage.save(path, uploaded_file)


def delete_file(path):
    if path and default_storage.exists(path):
        default_storage.delete(path)


def url_for(path):
    return default_storage.url(path) if path else None
