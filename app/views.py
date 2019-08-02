from django.shortcuts import render, redirect
import django.urls
import filemanager.views
import django.urls

def login(request):
    return render(request, 'login.html')