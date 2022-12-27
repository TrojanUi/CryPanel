# Generated by Django 3.2.6 on 2022-12-25 18:47

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import main.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('username', models.CharField(max_length=50, unique=True, verbose_name='username')),
                ('password', models.CharField(max_length=100, verbose_name='password')),
                ('role', models.CharField(default='user', max_length=50, verbose_name='role')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, verbose_name='created_at')),
                ('is_staff', models.BooleanField(default=False, verbose_name='is_staff')),
                ('is_superuser', models.BooleanField(default=False, verbose_name='is_superuser')),
                ('is_active', models.BooleanField(default=True, verbose_name='is_active')),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.Group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.Permission', verbose_name='user permissions')),
            ],
            options={
                'abstract': False,
            },
            managers=[
                ('objects', main.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Cloudflare',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.CharField(max_length=100, verbose_name='email')),
                ('token', models.CharField(max_length=200, verbose_name='token')),
                ('used', models.IntegerField(default=0, verbose_name='used')),
                ('cloud_id', models.CharField(max_length=200, verbose_name='cloud_id')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, verbose_name='created_at')),
            ],
        ),
        migrations.CreateModel(
            name='Design',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField()),
                ('img', models.ImageField(upload_to='static/img/designs')),
                ('type', models.TextField(choices=[('LOCO', 'LOCO')])),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, verbose_name='created_at')),
            ],
        ),
        migrations.CreateModel(
            name='Domain',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(verbose_name='Name of domain (search function)')),
                ('ns1', models.TextField()),
                ('ns2', models.TextField()),
                ('cloudId', models.TextField(blank=True, null=True)),
                ('status', models.TextField(default='Ожидание привязки')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, verbose_name='created_at')),
                ('cloud', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='main.cloudflare')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Link',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('path', models.TextField(default='/')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, verbose_name='created_at')),
                ('design', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='main.design')),
                ('domain', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='main.domain')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
