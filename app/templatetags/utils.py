from django import template

register = template.Library()


@register.simple_tag
def get_files_number(num):
    if 11 <= num <= 14:
        return '{} ФАЙЛОВ'.format(num)
    temp = num % 10
    if temp == 0 or (5 <= temp <= 9):
        return '{} ФАЙЛОВ'.format(num)
    if temp == 1:
        return '{} ФАЙЛ'.format(num)
    if temp >= 2 and temp <= 4:
        return '{} ФАЙЛА'.format(num)

    return 'WTF?!'


@register.simple_tag
def get_dirs_number(num):
    if 11 <= num <= 14:
        return '{} ПАПОК'.format(num)
    temp = num % 10
    if temp == 0 or (5 <= temp <= 9):
        return '{} ПАПОК'.format(num)
    if temp == 1:
        return '{} ПАПКА'.format(num)
    if temp >= 2 and num <= 4:
        return '{} ПАПКИ'.format(num)

    return 'WTF?!'


