from django.db import models

# Create your models here.
class Items(models.Model):
    add = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    stock = models.IntegerField(default=0)
    expiry_date = models.DateField()
    created_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name}-{self.stock}"