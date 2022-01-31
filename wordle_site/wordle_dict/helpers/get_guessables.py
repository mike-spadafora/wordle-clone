import nltk

nltk.download('words')
from nltk.corpus import words

# def word_fetcher():
#     #generate guessable words
#     for word in words.words("en-basic"):
#         if len(word) == 5:
#             print(word.lower()) 
        
        

    #generate guessable words
for word in words.words("en-basic"):
    if len(word) == 5:
        print(word.lower())
