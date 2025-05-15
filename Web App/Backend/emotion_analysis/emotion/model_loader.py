import os
import cv2
from tensorflow.keras.models import load_model

# Define paths
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models', 'emotion_detection_model.h5')
CASCADE_PATH = os.path.join(os.path.dirname(__file__), 'models', 'haarcascade_frontalface_default.xml')

# Load model and cascade
model = load_model(MODEL_PATH)
face_cascade = cv2.CascadeClassifier(CASCADE_PATH)

# Label map
label_map = {
    0: 'Angry', 1: 'Disgust', 2: 'Fear', 3: 'Happy', 4: 'Sad',
    5: 'Surprise', 6: 'Neutral', 7: 'Confused', 8: 'Tired',
    9: 'Bored', 10: 'Excited', 11: 'Content'
}