from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.
rights =[
    ('no_rights','no_rights'), #blocked user
    ('standart_user','standart_user'),# standart user buy/no buy sites
    ('administrator','administrator'),# variant - if site sell(no actual variant)
]
shablons = [
    ('steamfish','steamfish')
]
class Custom(AbstractUser):
    user_rights = models.CharField(max_length=30,choices=rights,default='standart_user')
    
class domains(models.Model):
    name_domain = models.TextField('Name of domain(search function)',blank=False)
    variant = models.CharField('Choice of shablons',max_length=30,choices=shablons)
    owner = models.ForeignKey(Custom,on_delete=models.CASCADE)
    downloads = models.IntegerField('number of downloaded programs',default=0)