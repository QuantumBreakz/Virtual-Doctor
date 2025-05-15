import os
import pandas as pd
import numpy as np
from django.conf import settings
import logging
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.feature_extraction.text import TfidfVectorizer

logger = logging.getLogger(__name__)

class DataManager:
    _instance = None
    _data = {}
    _preprocessors = {}
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DataManager, cls).__new__(cls)
        return cls._instance
    
    def __init__(self):
        if not self._data:
            self._load_all_data()
            self._initialize_preprocessors()
    
    def _load_all_data(self):
        """Load all data files on startup"""
        try:
            # Load medicine data
            medicine_data_path = os.path.join(settings.BASE_DIR, 'models/medicine_prescription/medicine_data.csv')
            if os.path.exists(medicine_data_path):
                self._data['medicine'] = pd.read_csv(medicine_data_path)
            
            # Load drug interactions data
            interactions_path = os.path.join(settings.BASE_DIR, 'models/medicine_prescription/drug_interactions.csv')
            if os.path.exists(interactions_path):
                self._data['interactions'] = pd.read_csv(interactions_path)
            
            # Load sentiment training data
            sentiment_data_path = os.path.join(settings.BASE_DIR, 'models/sentiment_analysis/sentiment_data.csv')
            if os.path.exists(sentiment_data_path):
                self._data['sentiment'] = pd.read_csv(sentiment_data_path)
            
            # Load emotion training data
            emotion_data_path = os.path.join(settings.BASE_DIR, 'models/emotion_detection/emotion_data.csv')
            if os.path.exists(emotion_data_path):
                self._data['emotion'] = pd.read_csv(emotion_data_path)
                
        except Exception as e:
            logger.error(f"Error loading data: {str(e)}")
    
    def _initialize_preprocessors(self):
        """Initialize data preprocessors"""
        try:
            # Initialize TF-IDF vectorizer for text data
            self._preprocessors['tfidf'] = TfidfVectorizer(
                max_features=5000,
                stop_words='english',
                ngram_range=(1, 2)
            )
            
            # Initialize scaler for numerical data
            self._preprocessors['scaler'] = StandardScaler()
            
            # Initialize label encoder for categorical data
            self._preprocessors['label_encoder'] = LabelEncoder()
            
        except Exception as e:
            logger.error(f"Error initializing preprocessors: {str(e)}")
    
    def get_data(self, data_name):
        """Get a specific dataset by name"""
        return self._data.get(data_name)
    
    def preprocess_text(self, text_data):
        """Preprocess text data using TF-IDF"""
        try:
            return self._preprocessors['tfidf'].fit_transform(text_data)
        except Exception as e:
            logger.error(f"Error preprocessing text: {str(e)}")
            return None
    
    def preprocess_numerical(self, numerical_data):
        """Preprocess numerical data using StandardScaler"""
        try:
            return self._preprocessors['scaler'].fit_transform(numerical_data)
        except Exception as e:
            logger.error(f"Error preprocessing numerical data: {str(e)}")
            return None
    
    def encode_categorical(self, categorical_data):
        """Encode categorical data using LabelEncoder"""
        try:
            return self._preprocessors['label_encoder'].fit_transform(categorical_data)
        except Exception as e:
            logger.error(f"Error encoding categorical data: {str(e)}")
            return None
    
    def get_data_info(self, data_name):
        """Get information about a specific dataset"""
        data = self._data.get(data_name)
        if data is None:
            return None
        
        info = {
            'shape': data.shape,
            'columns': data.columns.tolist(),
            'dtypes': data.dtypes.to_dict(),
            'missing_values': data.isnull().sum().to_dict(),
            'unique_values': {col: data[col].nunique() for col in data.columns}
        }
        return info
    
    def update_data(self, data_name, new_data):
        """Update a specific dataset"""
        try:
            if isinstance(new_data, pd.DataFrame):
                self._data[data_name] = new_data
                # Save to CSV
                data_path = os.path.join(settings.BASE_DIR, f'models/{data_name}/{data_name}_data.csv')
                new_data.to_csv(data_path, index=False)
                return True
            return False
        except Exception as e:
            logger.error(f"Error updating data {data_name}: {str(e)}")
            return False 