from django.shortcuts import render
# from django.http import Response
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import ItemSerializer
from rest_framework.parsers import JSONParser, json
from datetime import date
from .models import *

# Create your views here.
@api_view(['GET'])
def getAllDetails(request):
    iiitt = Items.objects.all()
    serial = ItemSerializer(iiitt, many=True)
    return Response(serial.data)


@api_view(['POST'])
def addItem(request):
    data = JSONParser().parse(request)
    serializer = ItemSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(["PUT"])
def checkItem(request, name):
    try:
        snippet = Items.objects.get(name=name)
        print(snippet)
    except Items.DoesNotExist:
        return Response({"error": "Item does not exist"}, status=404)
    
    checkit = ItemSerializer(snippet)
    print(checkit)
    return Response(checkit.data, status=200)


@api_view(['PATCH'])
def updateItem(request, name):
    try:
        snippet = Items.objects.get(name=name)
    except Items.DoesNotExist:
        return Response(status=404)
    
    data = JSONParser().parse(request)
    serializer = ItemSerializer(snippet, data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)
        

def setReorder(request):
    return Response({"Hello": "Shinchan"})

def expiryorNot(request):
    return Response({"Hello": "Shinchan"})