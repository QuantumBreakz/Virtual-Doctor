# sentiment/views.py
import numpy as np
import re
from django.shortcuts import render
from .model_loader import model, tokenizer, sentiment_classes
from tensorflow.keras.preprocessing.sequence import pad_sequences

# Function to preprocess text
def preprocess_text(text):
    text = text.lower()
    text = re.sub(r'\d+', '', text)
    text = re.sub(r'[^\w\s]', '', text)
    return text

# View to handle sentiment analysis
def analyze_sentiment(request):
    if request.method == 'POST':
        input_text = request.POST.get('text', '')
        if input_text.strip():
            # Preprocess the input text
            processed_text = preprocess_text(input_text)

            # Tokenize and pad the input text
            # Note: The tokenizer here is not pre-trained unless fitted elsewhere.
            # For accurate results, it should match the training tokenizer's vocabulary.
            sequences = tokenizer.texts_to_sequences([processed_text])
            max_sequence_length = 100  # Match this to your model's training
            padded_sequences = pad_sequences(sequences, maxlen=max_sequence_length)

            # Predict sentiment
            prediction = model.predict(padded_sequences)
            predicted_class_index = np.argmax(prediction, axis=1)[0]
            sentiment = sentiment_classes[predicted_class_index]
            probabilities = prediction[0]

            # Prepare context for template
            context = {
                'input_text': input_text,
                'sentiment': sentiment,
                'probabilities': {label: f"{prob:.2f}" for label, prob in zip(sentiment_classes, probabilities)},
            }
            return render(request, 'sentiment/index.html', context)
        else:
            return render(request, 'sentiment/index.html', {'error': 'Please enter some text.'})
    return render(request, 'sentiment/index.html')