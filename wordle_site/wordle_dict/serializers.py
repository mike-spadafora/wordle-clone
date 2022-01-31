from rest_framework import serializers
from .models import wordle_dict

class WordleDictSerializer(serializers.ModelSerializer):
    class Meta:
        model = wordle_dict
        fields = ('word')