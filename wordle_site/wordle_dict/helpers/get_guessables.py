import nltk

nltk.download('words')
from nltk.corpus import wordnet, words

#generate guessable words
for word in words.words("en-basic"):
    if len(word) == 5:
        print(word.lower()) 
        
        
