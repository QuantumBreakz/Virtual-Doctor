"""
Medicine Prescription System
Combines the best features of both implementations with enhanced functionality.
"""

import pandas as pd
import numpy as np
from typing import List, Dict, Tuple, Optional
import logging
from sklearn.model_selection import train_test_split
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import Dense, LSTM, Embedding, Dropout
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
import joblib
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MedicinePrescriptionSystem:
    def __init__(self):
        self.model = None
        self.tokenizer = Tokenizer()
        self.max_sequence_length = 100
        self.vocab_size = 0
        self.drug_mapping = None
        self.condition_mapping = None
        self.safety_checker = SafetyChecker()
        
    def preprocess_data(self, data_path: str):
        """Preprocess the dataset."""
        try:
            # Load data
            df = pd.read_csv(data_path)
            logger.info(f"Loaded dataset with shape: {df.shape}")
            
            # Clean and preprocess
            df['review'] = df['review'].fillna('')
            df['condition'] = df['condition'].fillna('Unknown')
            
            # Create mappings
            self.condition_mapping = {condition: idx for idx, condition in enumerate(df['condition'].unique())}
            self.drug_mapping = {drug: idx for idx, drug in enumerate(df['drugName'].unique())}
            
            # Tokenize reviews
            self.tokenizer.fit_on_texts(df['review'])
            self.vocab_size = len(self.tokenizer.word_index) + 1
            
            # Convert text to sequences
            sequences = self.tokenizer.texts_to_sequences(df['review'])
            X = pad_sequences(sequences, maxlen=self.max_sequence_length)
            
            # Create target variables
            y_drug = np.array([self.drug_mapping[drug] for drug in df['drugName']])
            y_condition = np.array([self.condition_mapping[condition] for condition in df['condition']])
            
            return X, y_drug, y_condition
            
        except Exception as e:
            logger.error(f"Error preprocessing data: {str(e)}")
            raise
    
    def build_model(self):
        """Build the neural network model."""
        try:
            model = Sequential([
                Embedding(self.vocab_size, 100, input_length=self.max_sequence_length),
                LSTM(128, return_sequences=True),
                Dropout(0.2),
                LSTM(64),
                Dropout(0.2),
                Dense(128, activation='relu'),
                Dropout(0.2),
                Dense(len(self.drug_mapping), activation='softmax')
            ])
            
            model.compile(
                optimizer='adam',
                loss='sparse_categorical_crossentropy',
                metrics=['accuracy']
            )
            
            self.model = model
            logger.info("Model built successfully")
            
        except Exception as e:
            logger.error(f"Error building model: {str(e)}")
            raise
    
    def train(self, data_path: str, epochs: int = 10, batch_size: int = 32):
        """Train the model."""
        try:
            # Preprocess data
            X, y_drug, y_condition = self.preprocess_data(data_path)
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y_drug, test_size=0.2, random_state=42
            )
            
            # Build model if not exists
            if self.model is None:
                self.build_model()
            
            # Callbacks
            callbacks = [
                EarlyStopping(monitor='val_loss', patience=3),
                ModelCheckpoint(
                    'best_model.h5',
                    monitor='val_accuracy',
                    save_best_only=True
                )
            ]
            
            # Train model
            history = self.model.fit(
                X_train, y_train,
                validation_data=(X_test, y_test),
                epochs=epochs,
                batch_size=batch_size,
                callbacks=callbacks
            )
            
            logger.info("Model training completed")
            return history
            
        except Exception as e:
            logger.error(f"Error during training: {str(e)}")
            raise
    
    def get_recommendations(self,
                          condition: str,
                          patient_info: Dict,
                          current_medications: List[str] = None,
                          top_k: int = 5) -> List[Dict]:
        """Get medicine recommendations for a condition."""
        try:
            # Preprocess input
            condition_processed = self.preprocess_text(condition)
            X = self.tokenizer.texts_to_sequences([condition_processed])
            X = pad_sequences(X, maxlen=self.max_sequence_length)
            
            # Get model predictions
            predictions = self.model.predict(X)
            top_indices = np.argsort(predictions[0])[-top_k:][::-1]
            
            # Map indices to drug names
            recommended_drugs = [
                list(self.drug_mapping.keys())[list(self.drug_mapping.values()).index(idx)]
                for idx in top_indices
            ]
            
            # Check safety
            interactions = self.safety_checker.check_drug_interactions(
                recommended_drugs,
                current_medications or []
            )
            
            contraindications = self.safety_checker.check_contraindications(
                recommended_drugs,
                patient_info
            )
            
            # Generate recommendations
            recommendations = []
            for drug, idx in zip(recommended_drugs, top_indices):
                confidence = float(predictions[0][idx])
                
                # Get safety summary
                safety_summary = self.safety_checker.get_safety_summary(
                    drug,
                    interactions.get(drug, []),
                    contraindications.get(drug, [])
                )
                
                recommendations.append({
                    'drug': drug,
                    'confidence_score': confidence,
                    'safety_summary': safety_summary
                })
            
            return recommendations
            
        except Exception as e:
            logger.error(f"Error getting recommendations: {str(e)}")
            raise
    
    def preprocess_text(self, text: str) -> str:
        """Preprocess input text."""
        # Add text preprocessing logic here
        return text.lower()
    
    def save_system(self, model_path: str):
        """Save the entire system state."""
        try:
            # Save model
            self.model.save(f"{model_path}/model.h5")
            
            # Save tokenizer and mappings
            joblib.dump(self.tokenizer, f"{model_path}/tokenizer.joblib")
            joblib.dump(self.drug_mapping, f"{model_path}/drug_mapping.joblib")
            joblib.dump(self.condition_mapping, f"{model_path}/condition_mapping.joblib")
            
            logger.info(f"System saved to {model_path}")
            
        except Exception as e:
            logger.error(f"Error saving system: {str(e)}")
            raise
    
    def load_system(self, model_path: str):
        """Load a saved system state."""
        try:
            # Load model
            self.model = load_model(f"{model_path}/model.h5")
            
            # Load tokenizer and mappings
            self.tokenizer = joblib.load(f"{model_path}/tokenizer.joblib")
            self.drug_mapping = joblib.load(f"{model_path}/drug_mapping.joblib")
            self.condition_mapping = joblib.load(f"{model_path}/condition_mapping.joblib")
            
            logger.info(f"System loaded from {model_path}")
            
        except Exception as e:
            logger.error(f"Error loading system: {str(e)}")
            raise

class SafetyChecker:
    """Safety checking system for medicine recommendations."""
    
    def __init__(self):
        self.interaction_cache = {}
        self.contraindication_cache = {}
    
    def check_drug_interactions(self, drugs: List[str], current_medications: List[str]) -> Dict:
        """Check for drug interactions."""
        interactions = {}
        # Add drug interaction checking logic here
        return interactions
    
    def check_contraindications(self, drugs: List[str], patient_info: Dict) -> Dict:
        """Check for contraindications."""
        contraindications = {}
        # Add contraindication checking logic here
        return contraindications
    
    def get_safety_summary(self, drug: str, interactions: List, contraindications: List) -> Dict:
        """Generate safety summary for a drug."""
        return {
            'interactions': interactions,
            'contraindications': contraindications,
            'safety_level': 'safe' if not (interactions or contraindications) else 'caution'
        } 