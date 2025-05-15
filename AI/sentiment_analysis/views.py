from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
import tensorflow as tf
import numpy as np
import json
import os

# Load the model
model_path = os.path.join(os.path.dirname(__file__), 'models/sentiment_model.h5')
model = tf.keras.models.load_model(model_path)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def analyze_sentiment(request):
    """
    Analyze sentiment of a single text input.
    """
    try:
        text = request.data.get('text')
        if not text:
            return Response(
                {'error': 'Text input is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Preprocess text
        # Add preprocessing logic here

        # Get prediction
        prediction = model.predict([text])
        sentiment = 'positive' if prediction[0] > 0.5 else 'negative'
        confidence = float(prediction[0] if sentiment == 'positive' else 1 - prediction[0])

        return Response({
            'sentiment': sentiment,
            'confidence': confidence,
            'raw_score': float(prediction[0])
        })

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def batch_analyze_sentiment(request):
    """
    Analyze sentiment of multiple texts.
    """
    try:
        texts = request.data.get('texts')
        if not texts or not isinstance(texts, list):
            return Response(
                {'error': 'List of texts is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        results = []
        for text in texts:
            # Preprocess text
            # Add preprocessing logic here

            # Get prediction
            prediction = model.predict([text])
            sentiment = 'positive' if prediction[0] > 0.5 else 'negative'
            confidence = float(prediction[0] if sentiment == 'positive' else 1 - prediction[0])

            results.append({
                'text': text,
                'sentiment': sentiment,
                'confidence': confidence,
                'raw_score': float(prediction[0])
            })

        return Response({
            'results': results
        })

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        ) 