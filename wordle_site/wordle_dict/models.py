from django.db import models

# Create your models here.
class wordle_dict(models.Model):
    word = models.CharField(max_length=5)

    def _str_(self):
        return self.word
