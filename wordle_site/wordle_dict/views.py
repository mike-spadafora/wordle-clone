from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .helpers.guess_validator import guess_validator
import random

# Create your views here.

@api_view(['GET'])
def get_guessable_word(request):
    if request.method == 'GET':
        word = get_random_word_from_file()
        return Response(word)
    
def get_random_word_from_file():
    lines = open('words.txt').read().splitlines()
    myline =random.choice(lines)
    return(myline)


@api_view(['POST'])
def validate_word(request):
    gv = guess_validator()
    
    if request.method == 'POST':
        word = gv.validate(request.POST.get('word'))
        return Response(word)