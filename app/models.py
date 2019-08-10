import django.db.models


class Files(django.db.models.Model):
    location = django.db.models.TextField()
    link = django.db.models.TextField()
    blocked = django.db.models.IntegerField(default=0)
    url_access = django.db.models.IntegerField(default=0)
    allowed_urls = django.db.models.TextField(default='')