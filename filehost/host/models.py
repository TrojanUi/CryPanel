from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

issues={
    ('2gb','2gb'),
    ('4gb','4gb'),
    ('6gb','6gb'),
    ('10gb','10gb'),
    ('unlim','unlim')
}
class element(models.Model):
    file = models.FileField('Файл на сайте')
    def __str__(self):
        return 'жески файл'

class absUser(AbstractUser):
    tarif = models.CharField("Тариф пользователя", max_length=50,choices=issues)
    load_to = models.IntegerField('Сколько загрузили в БАЙТАХ')
        