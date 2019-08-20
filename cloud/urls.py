"""cloud URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
import django.urls
import django.views.static
import django.conf
import app.views

urlpatterns = [
    django.urls.path('login/', app.views.login),
    django.urls.re_path(r'^media/(?P<path>.*)$', django.views.static.serve, {
        'document_root': django.conf.settings.MEDIA_ROOT,
    }),
]

from django.conf.urls import url
from django.views.decorators.csrf import csrf_exempt

from app.views import (BrowserView, DetailView, UploadView,
                               UploadFileView, DirectoryCreateView, RenameView,
                               DeleteView, ReplaceView, BlockView, UnblockView,
                               AccessUrlView, UnaccessUrlView, SaveUrlView)

urlpatterns.extend([
    url(r'^$', BrowserView.as_view(), name='browser'),
    url(r'^detail/$', DetailView.as_view(), name='detail'),
    url(r'^upload/$', UploadView.as_view(), name='upload'),
    url(r'^upload/file/$', csrf_exempt(UploadFileView.as_view()), name='upload-file'),
    url(r'^create/directory/$', DirectoryCreateView.as_view(), name='create-directory'),
    url(r'^rename/$', RenameView.as_view(), name='rename'),
    url(r'^delete/$', DeleteView.as_view(), name='delete'),
    url(r'^replace/$', ReplaceView.as_view(), name='replace'),
    url(r'^block/$', BlockView.as_view(), name='block'),
    url(r'^unblock/$', UnblockView.as_view(), name='unblock'),
    url(r'^access_to_url/$', AccessUrlView.as_view(), name='acess-to-url'),
    url(r'^unaccess_to_url/$', UnaccessUrlView.as_view(), name='unacess-to-url'),
    url(r'^save-urls/$', SaveUrlView.as_view(), name='save-urls'),
])