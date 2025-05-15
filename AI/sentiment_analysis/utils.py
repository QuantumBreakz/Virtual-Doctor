import re
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# Download required NLTK data
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')

def preprocess_text(text):
    """
    Preprocess text for sentiment analysis
    """
    # Convert to lowercase
    text = text.lower()
    
    # Remove special characters and digits
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    
    # Tokenize
    tokens = word_tokenize(text)
    
    # Remove stopwords
    stop_words = set(stopwords.words('english'))
    tokens = [token for token in tokens if token not in stop_words]
    
    # Lemmatize
    lemmatizer = WordNetLemmatizer()
    tokens = [lemmatizer.lemmatize(token) for token in tokens]
    
    return ' '.join(tokens)

def get_sentiment_confidence(prediction):
    """
    Calculate confidence score for sentiment prediction
    """
    score = float(prediction[0])
    if score > 0.5:
        return score
    return 1 - score

def get_sentiment_label(prediction, threshold=0.5):
    """
    Get sentiment label based on prediction score
    """
    score = float(prediction[0])
    if score > threshold:
        return 'positive'
    elif score < (1 - threshold):
        return 'negative'
    return 'neutral' 