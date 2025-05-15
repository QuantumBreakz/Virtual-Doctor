from django.shortcuts import render
from .model_loader import model, tokenizer, label_encoder
import numpy as np
from tensorflow.keras.preprocessing.sequence import pad_sequences

def recommend_medicine(request):
    if request.method == 'POST':
        user_condition = request.POST.get('condition')
        if user_condition:
            # Preprocess the input (adjust max_sequence_length to match your model's training)
            user_condition_seq = tokenizer.texts_to_sequences([user_condition])
            max_sequence_length = 100  # Match this to your model's input length
            user_condition_padded = pad_sequences(user_condition_seq, maxlen=max_sequence_length, padding='post')
            
            # Make prediction
            predicted = model.predict(user_condition_padded)
            predicted_label = np.argmax(predicted, axis=1)[0]
            predicted_medicine = label_encoder.inverse_transform([predicted_label])[0]
            
            return render(request, 'recommendation.html', {'medicine': predicted_medicine})
        else:
            return render(request, 'input.html', {'error': 'Please enter a condition.'})
    else:
        return render(request, 'input.html')