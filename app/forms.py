import django.forms


class DirectoryCreateForm(django.forms.Form):
    directory_name = django.forms.CharField()


class RenameForm(django.forms.Form):
    input_name = django.forms.CharField()
    old_name = django.forms.CharField()


class ReplaceForm(django.forms.Form):
    input_path = django.forms.CharField()
    old_path = django.forms.CharField()
