import cv2
import numpy as np
from tensorflow.keras.preprocessing.image import img_to_array

def detect_faces(image):
    """
    Detect faces in an image using OpenCV's Haar Cascade
    """
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)
    return faces

def preprocess_face(image, face_coords):
    """
    Preprocess face image for emotion detection
    """
    x, y, w, h = face_coords
    face = image[y:y+h, x:x+w]
    face = cv2.resize(face, (48, 48))
    face = cv2.cvtColor(face, cv2.COLOR_BGR2GRAY)
    face = img_to_array(face)
    face = np.expand_dims(face, axis=0)
    face = face / 255.0
    return face

def get_emotion_confidence(predictions):
    """
    Calculate confidence scores for emotion predictions
    """
    return {emotion: float(score) for emotion, score in zip(EMOTIONS, predictions[0])}

def get_top_emotions(predictions, top_n=3):
    """
    Get top N emotions with their confidence scores
    """
    emotion_scores = list(zip(EMOTIONS, predictions[0]))
    emotion_scores.sort(key=lambda x: x[1], reverse=True)
    return emotion_scores[:top_n]

def draw_emotion_box(image, face_coords, emotion, confidence):
    """
    Draw bounding box and emotion label on image
    """
    x, y, w, h = face_coords
    cv2.rectangle(image, (x, y), (x+w, y+h), (0, 255, 0), 2)
    label = f"{emotion}: {confidence:.2f}"
    cv2.putText(image, label, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
    return image 