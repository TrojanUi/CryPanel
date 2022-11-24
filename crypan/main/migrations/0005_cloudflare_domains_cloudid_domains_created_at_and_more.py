# Generated by Django 4.0.2 on 2022-11-24 11:46

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0004_custom_loco'),
    ]

    operations = [
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
        migrations.AddField(
            model_name='domains',
            name='cloudId',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='domains',
            name='created_at',
            field=models.DateTimeField(default=django.utils.timezone.now, verbose_name='created_at'),
        ),
        migrations.AddField(
            model_name='domains',
            name='ns1',
            field=models.TextField(default=''),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='domains',
            name='ns2',
            field=models.TextField(default=''),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='domains',
            name='status',
            field=models.TextField(default='Waiting for connection'),
        ),
        migrations.AlterField(
            model_name='domains',
            name='variant',
            field=models.CharField(choices=[('loco', 'loco')], max_length=30, verbose_name='Choice of shablons'),
        ),
        migrations.AddField(
            model_name='domains',
            name='cloud',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='main.cloudflare'),
        ),
    ]