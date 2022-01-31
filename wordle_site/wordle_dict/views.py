from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import wordle_dict
from .serializers import WordleDictSerializer
from rest_framework import viewsets

# Create your views here.

class WordleDictView(viewsets.ModelViewSet):
    serializer_class = WordleDictSerializer
    queryset = wordle_dict.objects.all()
    
@api_view(['GET'])
def post_collection(request):
    if request.method == 'GET':
        return Response("hello")