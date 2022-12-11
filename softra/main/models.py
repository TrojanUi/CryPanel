from django.db import models
import datetime
# Create your models here.


class shablons(models.Model):
    img = models.TextField('Ссылка на картинку')
    name = models.TextField('Название')
    massa = models.TextField('Вес файла с MB',default='142 MB')
    kolvo_download = models.IntegerField('Количество людей, установивших приложение')
    typical = models.TextField('Тип приложения(Например "Graphic editor")')
    linkToDownload = models.TextField('Ссылка на скачивание')
    created = models.DateTimeField(default = datetime.datetime.now())

