# sentiment/model_loader.py
import os
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.text import Tokenizer

# Define path
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models', 'lstm_model_sentimentanalysis.h5')

model = load_model(MODEL_PATH, compile=False)

model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

tokenizer = Tokenizer(num_words=5000) 

sentiment_classes = ['Negative', 'Neutral', 'Positive']
