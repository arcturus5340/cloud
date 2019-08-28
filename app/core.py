import os, shutil

import re
from django.conf import settings
from django.core.files.base import ContentFile

import app.signals
from app.settings import DIRECTORY, STORAGE
from app.utils import sizeof_fmt
import app.models

import hashlib


class Filemanager(object):
    def __init__(self, path=None):
        self.update_path(path)

    def update_path(self, path):
        if path is None or len(path) == 0:
            self.path = ''
            self.abspath = DIRECTORY
        else:
            self.path = self.validate_path(path)
            self.abspath = os.path.join(DIRECTORY, self.path)
        self.location = os.path.join(settings.MEDIA_ROOT, self.abspath)
        self.url = os.path.join(settings.MEDIA_URL, self.abspath)


    def validate_path(self, path):
        # replace backslash with slash
        path = path.replace('\\', '/')
        # remove leading and trailing slashes
        path = '/'.join([i for i in path.split('/') if i])

        return path

    def get_breadcrumbs(self):
        breadcrumbs = [{
            'label': 'Home',
            'path': '',
        }]

        parts = [e for e in self.path.split('/') if e]

        path = ''
        for part in parts:
            path = os.path.join(path, part)
            breadcrumbs.append({
                'label': part,
                'path': path,
            })

        return breadcrumbs

    def patch_context_data(self, context):
        context.update({
            'path': self.path,
            'breadcrumbs': self.get_breadcrumbs(),
        })

    def file_details(self):
        filename = self.path.rsplit('/', 1)[-1]
        return {
            'directory': os.path.dirname(self.path),
            'filepath': self.path,
            'filename': filename,
            'filesize': sizeof_fmt(STORAGE.size(self.location)),
            'filedate': STORAGE.get_modified_time(self.location),
            'fileurl': self.url,
            'link':  app.models.Files.objects.get(location=os.path.join(self.path, filename)).link,
            'blocked': app.models.Files.objects.get(location=os.path.join(self.path, filename)).blocked,
            'url_access': app.models.Files.objects.get(location=os.path.join(self.path, filename)).url_access,
            'allowed_urls': app.models.Files.objects.get(location=os.path.join(self.path, filename)).allowed_urls,
        }

    def directory_list(self):
        listing = []

        directories, files = STORAGE.listdir(self.location)

        def _helper(name, filetype):
            return {
                'filepath': os.path.join(self.path, name),
                'filetype': filetype,
                'filename': name,
                'filedate': STORAGE.get_modified_time(os.path.join(self.path, name)),
                'filesize': sizeof_fmt(STORAGE.size(os.path.join(self.path, name))),
                'fileurl' : os.path.join(settings.MEDIA_URL, self.abspath, name),
                'link': app.models.Files.objects.get(location=os.path.join(self.path, name)).link,
                'blocked': app.models.Files.objects.get(location=os.path.join(self.path, name)).blocked,
                'url_access': app.models.Files.objects.get(location=os.path.join(self.path, name)).url_access,
                'allowed_urls': app.models.Files.objects.get(location=os.path.join(self.path, name)).allowed_urls,
            }

        for directoryname in directories:
            listing.append(_helper(directoryname, 'Directory'))

        for filename in files:
            listing.append(_helper(filename, 'File'))

        return listing


    def public_directory_list(self, location, link):

        def _helper(name, filetype):
            return {
                'filepath': os.path.join(location, name),
                'filetype': filetype,
                'filename': name,
                'filedate': STORAGE.get_modified_time(os.path.join(location, name)),
                'filesize': sizeof_fmt(STORAGE.size(os.path.join(location, name))),
                'fileurl': os.path.join(app.settings.MEDIA_URL, location, name),
                'link': link,
                'blocked': app.models.Files.objects.get(link='sharewood.cloud/public/{}'.format(link)).blocked,
                'url_access': app.models.Files.objects.get(link='sharewood.cloud/public/{}'.format(link)).url_access,
                'allowed_urls': app.models.Files.objects.get(link='sharewood.cloud/public/{}'.format(link)).allowed_urls,
            }

        listing = []

        if os.path.isfile(os.path.join(app.settings.MEDIA_ROOT, location)):

            location, filename = location.split('/')[:-1], location.split('/')[-1]
            if location:
                location = os.path.join(*location)
            else:
                location = ''
            listing.append(_helper(filename, 'File'))
            print(listing)
            return listing

        directories, files = STORAGE.listdir(location)

        for directoryname in directories:
            listing.append(_helper(directoryname, 'Directory'))

        for filename in files:
            listing.append(_helper(filename, 'File'))

        return listing


    def upload_file(self, rel_path, filedata):
        filename = STORAGE.get_valid_name(filedata.name)
        filepath = os.path.join(self.path, rel_path)

        app.signals.filemanager_pre_upload.send(sender=self.__class__, filename=filename, path=self.path, filepath=filepath)
        STORAGE.save(filepath, filedata)
        if not app.models.Files.objects.filter(location=filepath).exists():
            app.models.Files.objects.create(location=filepath,
                                            link='sharewood.cloud/public/{}'.format(hashlib.sha256(filepath.encode('utf-8')).hexdigest()),
                                            blocked=1,
                                            url_access=0)
        app.signals.filemanager_post_upload.send(sender=self.__class__, filename=filename, path=self.path, filepath=filepath)
        return filename

    def create_directory(self, name):
        name = STORAGE.get_valid_name(name)
        tmpfile = os.path.join(name, '.tmp')

        path = os.path.join(self.path, tmpfile)
        STORAGE.save(path, ContentFile(''))
        STORAGE.delete(path)

    def rename(self, src, dst):
        os.rename(os.path.join(self.location, src), os.path.join(self.location, dst))

    def replace(self, src, dst):
        # TODO: os.path() don't work for this sample
        os.replace(os.path.join(settings.MEDIA_ROOT, 'uploads/', src), '/'.join([settings.MEDIA_ROOT, DIRECTORY, dst, src.split('/')[-1]]))

    def remove(self, name):
        app.models.Files.objects.get(location=name).delete()
        if os.path.isdir(os.path.join(settings.MEDIA_ROOT, "uploads/", name)):
            shutil.rmtree(os.path.join(settings.MEDIA_ROOT, "uploads/", name))
        else:
            os.remove(os.path.join(settings.MEDIA_ROOT, "uploads/", name))

    def search(self, name):
        startpath = os.path.join(settings.MEDIA_ROOT, self.abspath)
        q = []
        for root, dirs, files in os.walk(startpath):
            self.update_path(root.replace(startpath, ''))

            for file in self.directory_list():
                if re.search(name, file['filename'], re.I):
                    q.append(file)
                try:
                    if file['filetype'] == 'File':
                        with open('media/uploads/' + file['filepath']) as f:
                            content = f.read()
                            if name in content:
                                q.append(file)
                except:
                    pass

        return q

    def block(self, filepath):
        file = app.models.Files.objects.get(location=filepath)
        file.blocked = 1
        file.save()

    def unblock(self, filepath):
        file = app.models.Files.objects.get(location=filepath)
        file.blocked = 0
        file.save()

    def access_url(self, filepath):
        file = app.models.Files.objects.get(location=filepath)
        file.url_access = 1
        file.save()

    def unaccess_url(self, filepath):
        file = app.models.Files.objects.get(location=filepath)
        file.url_unaccess = 0
        file.save()

    def save_url(self, filepath, urls):
        file = app.models.Files.objects.get(location=filepath)
        new_urls = ""
        for url in urls:
            if new_urls == "":
                new_urls = url
            else:
                new_urls += ', {}'.format(url)
        file.allowed_urls = new_urls;
        file.save()