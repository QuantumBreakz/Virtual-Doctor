from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
import tensorflow as tf
import numpy as np
import cv2
import os

# Load the model
model_path = os.path.join(os.path.dirname(__file__), 'models/emotion_model.h5')
model = tf.keras.models.load_model(model_path)

# Emotion labels
EMOTIONS = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral']

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def detect_emotion(request):
    """
    Detect emotion from a single image.
    """
    try:
        image = request.FILES.get('image')
        if not image:
            return Response(
                {'error': 'Image is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Read and preprocess image
        img = cv2.imdecode(np.frombuffer(image.read(), np.uint8), cv2.IMREAD_COLOR)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        img = cv2.resize(img, (48, 48))
        img = img.reshape(1, 48, 48, 1)
        img = img / 255.0

        # Get prediction
        prediction = model.predict(img)
        emotion_idx = np.argmax(prediction[0])
        emotion = EMOTIONS[emotion_idx]
        confidence = float(prediction[0][emotion_idx])

        return Response({
            'emotion': emotion,
            'confidence': confidence,
            'all_emotions': {
                emo: float(conf) for emo, conf in zip(EMOTIONS, prediction[0])
            }
        })

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def batch_detect_emotion(request):
    """
    Detect emotions from multiple images.
    """
    try:
        images = request.FILES.getlist('images')
        if not images:
            return Response(
                {'error': 'Images are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        results = []
        for image in images:
            # Read and preprocess image
            img = cv2.imdecode(np.frombuffer(image.read(), np.uint8), cv2.IMREAD_COLOR)
            img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            img = cv2.resize(img, (48, 48))
            img = img.reshape(1, 48, 48, 1)
            img = img / 255.0

            # Get prediction
            prediction = model.predict(img)
            emotion_idx = np.argmax(prediction[0])
            emotion = EMOTIONS[emotion_idx]
            confidence = float(prediction[0][emotion_idx])

            results.append({
                'image_name': image.name,
                'emotion': emotion,
                'confidence': confidence,
                'all_emotions': {
                    emo: float(conf) for emo, conf in zip(EMOTIONS, prediction[0])
                }
            })

        return Response({
            'results': results
        })

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        ) 