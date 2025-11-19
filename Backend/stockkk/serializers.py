from rest_framework import serializers
from .models import *


class ItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = Items
        fields = ["add", "name", "stock", "expiry_date", "created_at"]

    def validate_name(self, value):
        if Items.objects.filter(name__iexact=value).exists():
            raise serializers.ValidationError(
                "Name already exists (case-insensitive)."
            )
        return value