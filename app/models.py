import django.db.models

class Files(django.db.models.Model):
    location = django.db.models.TextField()
    link = django.db.models.TextField()
    blocked = django.db.models.IntegerField()