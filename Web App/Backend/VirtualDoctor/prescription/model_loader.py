import os
import pickle
from tensorflow.keras.models import load_model

# Define file paths
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models', 'medicine_recommendation_model.h5')
TOKENIZER_PATH = os.path.join(os.path.dirname(__file__), 'models', 'tokenizer.pkl')
LABEL_ENCODER_PATH = os.path.join(os.path.dirname(__file__), 'models', 'label_encoder.pkl')

# Load the model and preprocessing objects
model = load_model(MODEL_PATH)
with open(TOKENIZER_PATH, 'rb') as f:
    tokenizer = pickle.load(f)
with open(LABEL_ENCODER_PATH, 'rb') as f:
    label_encoder = pickle.load(f)