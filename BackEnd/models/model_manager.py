import os
import tensorflow as tf
import joblib
import numpy as np
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class ModelManager:
    _instance = None
    _models = {}
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelManager, cls).__new__(cls)
        return cls._instance
    
    def __init__(self):
        if not self._models:
            self._load_all_models()
    
    def _load_all_models(self):
        """Load all models on startup"""
        try:
            # Load sentiment analysis model
            sentiment_model_path = os.path.join(settings.BASE_DIR, 'models/sentiment_analysis/sentiment_model.h5')
            if os.path.exists(sentiment_model_path):
                self._models['sentiment'] = tf.keras.models.load_model(sentiment_model_path)
            
            # Load emotion detection model
            emotion_model_path = os.path.join(settings.BASE_DIR, 'models/emotion_detection/emotion_model.h5')
            if os.path.exists(emotion_model_path):
                self._models['emotion'] = tf.keras.models.load_model(emotion_model_path)
            
            # Load medicine recommendation model
            medicine_model_path = os.path.join(settings.BASE_DIR, 'models/medicine_prescription/medicine_model.joblib')
            if os.path.exists(medicine_model_path):
                self._models['medicine'] = joblib.load(medicine_model_path)
            
            # Load audio processing model
            audio_model_path = os.path.join(settings.BASE_DIR, 'models/audio_processing/audio_model.h5')
            if os.path.exists(audio_model_path):
                self._models['audio'] = tf.keras.models.load_model(audio_model_path)
                
        except Exception as e:
            logger.error(f"Error loading models: {str(e)}")
    
    def get_model(self, model_name):
        """Get a specific model by name"""
        return self._models.get(model_name)
    
    def reload_model(self, model_name):
        """Reload a specific model"""
        try:
            if model_name == 'sentiment':
                model_path = os.path.join(settings.BASE_DIR, 'models/sentiment_analysis/sentiment_model.h5')
                self._models['sentiment'] = tf.keras.models.load_model(model_path)
            elif model_name == 'emotion':
                model_path = os.path.join(settings.BASE_DIR, 'models/emotion_detection/emotion_model.h5')
                self._models['emotion'] = tf.keras.models.load_model(model_path)
            elif model_name == 'medicine':
                model_path = os.path.join(settings.BASE_DIR, 'models/medicine_prescription/medicine_model.joblib')
                self._models['medicine'] = joblib.load(model_path)
            elif model_name == 'audio':
                model_path = os.path.join(settings.BASE_DIR, 'models/audio_processing/audio_model.h5')
                self._models['audio'] = tf.keras.models.load_model(model_path)
            return True
        except Exception as e:
            logger.error(f"Error reloading model {model_name}: {str(e)}")
            return False
    
    def get_model_info(self, model_name):
        """Get information about a specific model"""
        model = self._models.get(model_name)
        if model is None:
            return None
        
        info = {
            'type': type(model).__name__,
            'input_shape': getattr(model, 'input_shape', None),
            'output_shape': getattr(model, 'output_shape', None),
            'layers': len(model.layers) if hasattr(model, 'layers') else None,
            'parameters': model.count_params() if hasattr(model, 'count_params') else None
        }
        return info 