# Generated by Django 5.1.2 on 2025-06-18 15:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_rename_empresa_ofertas_empresauser'),
    ]

    operations = [
        migrations.AlterField(
            model_name='empresas',
            name='referenciaIMG_empresa',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='usuarios',
            name='referenciaIMG_oferente',
            field=models.TextField(blank=True, null=True),
        ),
    ]
