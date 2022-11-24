from django.db import models

# Create your models here.

class element(models.Model):
    file = models.FileField('Файл на сайте')
    def __str__(self):
        return 'жески файл'
        