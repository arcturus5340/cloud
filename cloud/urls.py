import django.urls
import django.views.static
import django.conf
import app.views
import django.views.decorators.csrf
import app.views

urlpatterns = [
    django.urls.re_path(r'^media/(?P<path>.*)$', django.views.static.serve, {
        'document_root': django.conf.settings.MEDIA_ROOT,
    }),
    django.urls.path(r'', app.views.BrowserView.as_view(), name='browser'),
    django.urls.path(r'detail/', app.views.DetailView.as_view(), name='detail'),
    django.urls.path(r'upload/', app.views.UploadView.as_view(), name='upload'),
    django.urls.path(r'upload/file/', django.views.decorators.csrf.csrf_exempt(app.views.UploadFileView.as_view()), name='upload-file'),
    django.urls.path(r'create/directory/', app.views.DirectoryCreateView.as_view(), name='create-directory'),
    django.urls.path(r'rename/', app.views.RenameView.as_view(), name='rename'),
    django.urls.path(r'delete/', app.views.DeleteView.as_view(), name='delete'),
    django.urls.path(r'replace/', app.views.ReplaceView.as_view(), name='replace'),
    django.urls.path(r'block/', app.views.BlockView.as_view(), name='block'),
    django.urls.path(r'unblock/', app.views.UnblockView.as_view(), name='unblock'),
    django.urls.path(r'access_to_url/', app.views.AccessUrlView.as_view(), name='acess-to-url'),
    django.urls.path(r'unaccess_to_url/', app.views.UnaccessUrlView.as_view(), name='unacess-to-url'),
    django.urls.path(r'save-urls/', app.views.SaveUrlView.as_view(), name='save-urls'),
]