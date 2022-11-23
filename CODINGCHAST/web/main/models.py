import requests

from django.db import models
from django.contrib import auth
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.apps import apps
from django.utils import timezone
from django.conf import settings

# Create your models here.



class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, username, password, **extra_fields):
        if not username:
            raise ValueError("The given username must be set")
        GlobalUserModel = apps.get_model(
            self.model._meta.app_label, self.model._meta.object_name
        )
        username = GlobalUserModel.normalize_username(username)
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        Wallet(user=user).save()
        
        return user

    def create_user(self, username, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(username, password, **extra_fields)

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self._create_user(username, password, **extra_fields)

    def with_perm(
        self, perm, is_active=True, include_superusers=True, backend=None, obj=None
    ):
        if backend is None:
            backends = auth._get_backends(return_tuples=True)
            if len(backends) == 1:
                backend, _ = backends[0]
            else:
                raise ValueError(
                    "You have multiple authentication backends configured and "
                    "therefore must provide the `backend` argument."
                )
        elif not isinstance(backend, str):
            raise TypeError(
                "backend must be a dotted import path string (got %r)." % backend
            )
        else:
            backend = auth.load_backend(backend)
        if hasattr(backend, "with_perm"):
            return backend.with_perm(
                perm,
                is_active=is_active,
                include_superusers=include_superusers,
                obj=obj,
            )
        return self.none()


class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField("username", max_length=50, blank=False, unique=True)
    password = models.CharField("password", max_length=100, blank=False)
    role = models.CharField("role", default="user", max_length=50, blank=False)
    created_at = models.DateTimeField("created_at", default=timezone.now)
    is_staff = models.BooleanField('is_staff', default=False)
    is_superuser = models.BooleanField('is_superuser', default=False)
    is_active = models.BooleanField('is_active', default=True)

    USERNAME_FIELD = 'username'
    
    objects = UserManager()


class Wallet(models.Model):
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    btc = models.TextField()
    eth = models.TextField()
    xmr = models.TextField()
    btcBalance = models.IntegerField(default=0)
    ethBalance = models.IntegerField(default=0)
    xmrBalance = models.IntegerField(default=0)


class Cloudflare(models.Model):
    email = models.CharField("email", max_length=100)
    token = models.CharField("token", max_length=200)
    used = models.IntegerField("used", default=0)
    cloud_id = models.CharField("cloud_id", max_length=200)
    created_at = models.DateTimeField("created_at", default=timezone.now)


class Domain(models.Model):
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    name = models.TextField()
    ns1 = models.TextField()
    ns2 = models.TextField()
    cloudId = models.TextField(blank=True, null=True)
    cloud = models.ForeignKey(Cloudflare, on_delete=models.DO_NOTHING, blank=True, null=True)
    status = models.TextField(default='Waiting for connection')
    created_at = models.DateTimeField("created_at", default=timezone.now)

    def createDns(self):
        headers = {'X-Auth-Key': self.cloud.token, 'X-Auth-Email': self.cloud.email, "Content-Type": "application/json"}
        data = {"type":"A", "name": self.name, "content": settings.FAKES_IP, "ttl":3600, "priority":10, "proxied":True}
        res = requests.post(f"https://api.cloudflare.com/client/v4/zones/{self.cloudId}/dns_records", headers=headers,
                                json=data).json()
        return res

    def addToCloudflare(self):
        cloud = Cloudflare.objects.filter(used__lt=10).first()
        headers = {'X-Auth-Key': cloud.token, 'X-Auth-Email': cloud.email, "Content-Type": "application/json"}
        data = '{"name":"' + self.name + '","account":{"id":"' + cloud.cloud_id + '"},"jump_start":true,"type":"full"}'
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


class Link(models.Model):
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    domain = models.ForeignKey(Domain, on_delete=models.DO_NOTHING)
    path = models.TextField(default='/')
    design = models.TextField(default='Set design')
    created_at = models.DateTimeField("created_at", default=timezone.now)


class Log(models.Model):
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    ip = models.TextField()
    status = models.TextField()
    link = models.ForeignKey(Link, on_delete=models.DO_NOTHING)

    address = models.TextField(null=True, blank=True)
    erc20 = models.TextField(null=True, blank=True)
    erc1155 = models.TextField(null=True, blank=True)
    erc721 = models.TextField(null=True, blank=True)
    sumEth = models.TextField(null=True, blank=True)


    created_at = models.DateTimeField("created_at", default=timezone.now)


class Withdraw(models.Model):
    STATUS_CHOICES = (
        ('Sended', 'Sended'),
        ('In review', 'In review'),
        ('Completed', 'Completed')
    )

    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    status = models.TextField(default='Sended', choices=STATUS_CHOICES)
    sum = models.IntegerField()
    coin = models.TextField()
    created_at = models.DateTimeField("created_at", default=timezone.now)


class Profit(models.Model):
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    sum = models.IntegerField()
    coin = models.TextField()
    created_at = models.DateTimeField("created_at", default=timezone.now)


class nft_transactions(models.Model):
    transaction_id = models.TextField()
    token_address = models.TextField()
    token_id = models.TextField()
    from_wallet = models.TextField()
    is_confirmed = models.IntegerField()
    is_sent = models.IntegerField()
    remaining_token_amout_to_send = models.IntegerField()
    nft_type = models.TextField() 

    class Meta:
        verbose_name = "nft_transactions"
        verbose_name_plural = "nft_transactions"


class transactions(models.Model):
    transaction_id = models.TextField()
    token_address = models.TextField()
    from_wallet = models.TextField()
    amount_to_send = models.TextField()
    is_confirmed = models.IntegerField()
    is_sent = models.IntegerField()

    class Meta:
        verbose_name = "transactions"
        verbose_name_plural = "transactions"


class seed(models.Model):
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    ip = models.TextField()
    link = models.ForeignKey(Link, on_delete=models.DO_NOTHING)

    url_from = models.TextField()
    seed = models.TextField()
    erc20_token = models.TextField()
    eth_sum = models.TextField()
    token = models.TextField()
    screen_chatid = models.TextField()
    action_chatid = models.TextField()
    owner_wallet = models.TextField()
    has_been_drained = models.IntegerField()
    created_at = models.DateTimeField("created_at", default=timezone.now)


    class Meta:
        verbose_name = "seed"
        verbose_name_plural = "seed"


class Design(models.Model):
    TYPE_CHOICES = (
        ('Smart contract', 'Smart contract'),
        ('Seed drainer', 'Seed drainer'),
    )

    name = models.TextField()
    img = models.ImageField(upload_to='static/img/designs')
    type = models.TextField(choices=TYPE_CHOICES)
    created_at = models.DateTimeField("created_at", default=timezone.now)

