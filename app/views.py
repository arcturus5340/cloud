import django.http
from django.shortcuts import render, redirect
import django.urls
import django.urls
import django.contrib.auth

import filemanager.views

import json


allowedIps = ['localhost', '127.0.0.1', '188.242.232.131']
def allow_by_ip(view_func):
    def authorize(request, *args, **kwargs):
        user_ip = request.META['REMOTE_ADDR']
        if user_ip in allowedIps:
            return view_func(request, *args, **kwargs)
        # TODO: 403 Error
        return django.http.HttpResponse('Invalid Ip Access!')
    return authorize


@allow_by_ip
def login(request):
    print(request.POST)
    if request.POST.get('login'):
        print(123)
        user_login = request.POST.get('username')
        user_password = request.POST.get('password')
        user = django.contrib.auth.authenticate(username=user_login, password=user_password)

        response_data = {}
        if user:
            django.contrib.auth.login(request, user)
            response_data['result'] = 'Success!'
        else:
            response_data['result'] = 'Failed!'
        return django.http.HttpResponse(json.dumps(response_data), content_type="application/json")

    return django.shortcuts.render(request, 'login.html')