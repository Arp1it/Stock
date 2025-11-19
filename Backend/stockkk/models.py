from django.db import models
from django.db.models import UniqueConstraint
from django.db.models.functions import Lower

# Create your models here.
class Items(models.Model):
    add = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    stock = models.IntegerField(default=0)
    expiry_date = models.DateField()
    created_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name}-{self.stock}"
    
    class Meta:
        constraints = [
            UniqueConstraint(
                Lower("name"),
                name="unique_item_name_case_insensitive",
                violation_error_message="Name must be unique (case-insensitive)."
            )
        ]