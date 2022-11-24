from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.
from django.utils import timezone
import requests
from django.conf import settings
rights =[
    ('no_rights','no_rights'), #blocked user
    ('standart_user','standart_user'),# standart user buy/no buy sites
    ('administrator','administrator'),# variant - if site sell(no actual variant)
]
shablons = [
    ('loco','loco') 
]
class Custom(AbstractUser):
    user_rights = models.CharField(max_length=30,choices=rights,default='standart_user')
    loco = models.BooleanField("Loco acces?",default=False)
    
class Cloudflare(models.Model):
    email = models.CharField("email", max_length=100)
    token = models.CharField("token", max_length=200)
    used = models.IntegerField("used", default=0)
    cloud_id = models.CharField("cloud_id", max_length=200)
    created_at = models.DateTimeField("created_at", default=timezone.now)
    
class domains(models.Model):
    name_domain = models.TextField('Name of domain(search function)',blank=False)
    variant = models.CharField('Choice of shablons',max_length=30,choices=shablons)
    owner = models.ForeignKey(Custom,on_delete=models.CASCADE)
    downloads = models.IntegerField('number of downloaded programs',default=0)
    ns1 = models.TextField()
    ns2 = models.TextField()
    cloudId = models.TextField(blank=True, null=True)
    cloud = models.ForeignKey(Cloudflare, on_delete=models.DO_NOTHING, blank=True, null=True)
    status = models.TextField(default='Waiting for connection')
    created_at = models.DateTimeField("created_at", default=timezone.now)
    
    def createDns(self):
        headers = {'X-Auth-Key': self.cloud.token, 'X-Auth-Email': self.cloud.email, "Content-Type": "application/json"}
        data = {"type":"A", "name": self.name_domain, "content": settings.FAKES_IP, "ttl":3600, "priority":10, "proxied":True}
        res = requests.post(f"https://api.cloudflare.com/client/v4/zones/{self.cloudId}/dns_records", headers=headers,
                                json=data).json()
        return res
    def addToCloudflare(self):
            cloud = Cloudflare.objects.filter(used__lt=10).first()
            headers = {'X-Auth-Key': cloud.token, 'X-Auth-Email': cloud.email, "Content-Type": "application/json"}
            data = '{"name":"' + self.name_domain + '","account":{"id":"' + cloud.cloud_id + '"},"jump_start":true,"type":"full"}'
            res = requests.post("https://api.cloudflare.com/client/v4/zones", headers=headers, data=data).json()
            if res["success"] is True:
                cloud.used += 1
                cloud.save()
                ns1 = res["result"]["name_servers"][0]
                ns2 = res["result"]["name_servers"][1]
                self.ns1 = ns1
                self.ns2 = ns2
                self.cloudId = res["result"]["id"]
                self.cloud = cloud
                self.cloud.used = self.cloud.used + 1
                self.save()
                self.createDns()
                return {
                    "success": True,
                    "message": "Domain created!"
                    }
            elif res["success"] is False:
                self.delete()
                for i in res["errors"]:
                    if i["code"] == 1105:
                        return {
                                "success": False,
                                "message": "Too many tries try later"
                            }
                    elif i["code"] == 1097:
                        return {"success": False,
                                    "message": "This web property cannot be added to Cloudflare at this time. If you are an Enterprise customer, please contact your Customer Success Manager. Otherwise, please email abusereply@cloudflare.com with the name of the web property and a detailed explanation of your association with this web property."}
                    elif i["code"] == 1049:
                        return {"success": False, "message": "Domain not registered"}
                    elif i["code"] == 1061:
                        return {"success": False, "message": "The domain is already in the CloudFlare database"}
                    elif i["code"] == 1105:
                        return {"success": False, "message": "Too many attempts."}
                    
                    
    def deleteFromCloudflare(self):
        self.delete()
        headers = {'X-Auth-Key': self.cloud.token, 'X-Auth-Email':self.cloud.email, "Content-Type": "application/json"}
        delete = requests.delete(f"https://api.cloudflare.com/client/v4/zones/{self.cloudId}",
                                     headers=headers).json()
        if delete["success"] is True:
            return {"success": True, "message": "Domain deleted"}
        else:
            return {"success": False, "message": "Unknown error"}


    def checkConnect(self):
        res = requests.put(f'https://api.cloudflare.com/client/v4/zones/{self.cloudId}/activation_check',
                           headers={'X-Auth-Key': self.cloud.token, 'X-Auth-Email': self.cloud.email,
                                    "Content-Type": "application/json"}).json()
        print(res)
        if res['success'] is True:
            if res['messages'][0]['message'] == "Zone verified!":
                self.status = "Connected"
                self.save()
                return {"status": True, "message": "The domain is successfully linked"}

            if int(len(res['messages'])) == 0:
                return {"status": False, "message": "The domain can be bound for 24 hours"}

        else:
            return {"status": False, "message": res['errors'][0]['message']}                