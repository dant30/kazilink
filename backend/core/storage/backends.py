from django.core.files.storage import FileSystemStorage


class PrivateFileStorage(FileSystemStorage):
    def get_valid_name(self, name):
        return super().get_valid_name(name)
