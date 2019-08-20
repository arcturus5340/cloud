import django.dispatch


filemanager_pre_upload = django.dispatch.Signal(providing_args=["filename", "path", "filepath"])
filemanager_post_upload = django.dispatch.Signal(providing_args=["filename", "path", "filepath"])
