from rest_framework import serializers
from .models import *


class ItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = Items
        fields = ["add", "name", "stock", "expiry_date", "created_at"]