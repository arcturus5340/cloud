from django import template

register = template.Library()


@register.simple_tag
def get_el_number(dnum, fnum):
    result = ''
    temp = fnum % 10
    if 11 <= fnum <= 14:
        result = '{} ФАЙЛОВ'.format(fnum)
    elif 5 <= temp <= 9:
        result = '{} ФАЙЛОВ'.format(fnum)
    elif temp == 1:
        result = '{} ФАЙЛ'.format(fnum)
    elif 2 <= temp <= 4:
        result = '{} ФАЙЛА'.format(fnum)

    temp = dnum % 10
    if result and temp != 0: result += ', '

    if 11 <= dnum <= 14:
        result += '{} ПАПОК'.format(dnum)
    elif 5 <= temp <= 9:
        result += '{} ПАПОК'.format(dnum)
    elif temp == 1:
        result += '{} ПАПКА'.format(dnum)
    elif 2 <= temp <= 4:
        result += '{} ПАПКИ'.format(dnum)

    return result
