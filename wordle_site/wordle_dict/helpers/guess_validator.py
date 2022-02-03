import nltk
from nltk.corpus import wordnet
nltk.download('wordnet')

class guess_validator():
    
    def __init__(self):
        wn_lemmas = set(wordnet.all_lemma_names()) # should be all english words in wordnet
        self.filtered_list = {x for x in wn_lemmas if len(x) == 5} # all 5 letter english words in wordnet
        
    def validate(self, word):
        print("validating " + word)
        return (word in self.filtered_list)
