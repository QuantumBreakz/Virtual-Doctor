from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import joblib
import os

# Load medicine data
MEDICINE_DATA_PATH = 'data/medicine_data.csv'
INTERACTION_DATA_PATH = 'data/drug_interactions.csv'

def load_medicine_data():
    """Load and preprocess medicine data"""
    df = pd.read_csv(MEDICINE_DATA_PATH)
    return df

def load_interaction_data():
    """Load drug interaction data"""
    df = pd.read_csv(INTERACTION_DATA_PATH)
    return df

@api_view(['POST'])
def get_recommendations(request):
    """
    Get medicine recommendations based on symptoms and patient history
    """
    try:
        symptoms = request.data.get('symptoms', [])
        patient_history = request.data.get('patient_history', {})
        
        if not symptoms:
            return Response(
                {'error': 'Symptoms are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Load medicine data
        df = load_medicine_data()
        
        # Create symptom text for matching
        symptom_text = ' '.join(symptoms)
        
        # Vectorize symptoms and medicine descriptions
        vectorizer = TfidfVectorizer()
        vectors = vectorizer.fit_transform([symptom_text] + df['description'].tolist())
        
        # Calculate similarity scores
        similarity_scores = cosine_similarity(vectors[0:1], vectors[1:])
        
        # Get top recommendations
        top_indices = similarity_scores[0].argsort()[-5:][::-1]
        recommendations = df.iloc[top_indices].to_dict('records')
        
        # Add safety checks
        for rec in recommendations:
            rec['safety_score'] = calculate_safety_score(rec, patient_history)
        
        return Response({
            'recommendations': recommendations,
            'symptoms_analyzed': symptoms
        })

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def check_interactions(request):
    """
    Check for potential drug interactions
    """
    try:
        medicines = request.data.get('medicines', [])
        
        if not medicines:
            return Response(
                {'error': 'Medicine list is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Load interaction data
        df = load_interaction_data()
        
        interactions = []
        for med1 in medicines:
            for med2 in medicines:
                if med1 != med2:
                    # Check for interactions
                    interaction = df[
                        ((df['drug1'] == med1) & (df['drug2'] == med2)) |
                        ((df['drug1'] == med2) & (df['drug2'] == med1))
                    ]
                    
                    if not interaction.empty:
                        interactions.append({
                            'medicine1': med1,
                            'medicine2': med2,
                            'severity': interaction['severity'].iloc[0],
                            'description': interaction['description'].iloc[0]
                        })
        
        return Response({
            'interactions': interactions,
            'medicines_checked': medicines
        })

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def check_safety(request):
    """
    Check medicine safety based on patient history
    """
    try:
        medicine = request.data.get('medicine')
        patient_history = request.data.get('patient_history', {})
        
        if not medicine:
            return Response(
                {'error': 'Medicine is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Calculate safety score
        safety_score = calculate_safety_score(medicine, patient_history)
        
        # Get safety recommendations
        recommendations = get_safety_recommendations(medicine, patient_history)
        
        return Response({
            'medicine': medicine,
            'safety_score': safety_score,
            'recommendations': recommendations
        })

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

def calculate_safety_score(medicine, patient_history):
    """
    Calculate safety score for a medicine based on patient history
    """
    score = 1.0
    
    # Check for allergies
    if 'allergies' in patient_history:
        if medicine['name'] in patient_history['allergies']:
            score *= 0.0
    
    # Check for existing conditions
    if 'conditions' in patient_history:
        for condition in patient_history['conditions']:
            if condition in medicine.get('contraindications', []):
                score *= 0.5
    
    # Check for age restrictions
    if 'age' in patient_history:
        age = patient_history['age']
        if age < medicine.get('min_age', 0) or age > medicine.get('max_age', 100):
            score *= 0.7
    
    return round(score, 2)

def get_safety_recommendations(medicine, patient_history):
    """
    Get safety recommendations based on medicine and patient history
    """
    recommendations = []
    
    # Check for allergies
    if 'allergies' in patient_history:
        if medicine['name'] in patient_history['allergies']:
            recommendations.append({
                'type': 'allergy',
                'severity': 'high',
                'message': f'Patient is allergic to {medicine["name"]}'
            })
    
    # Check for existing conditions
    if 'conditions' in patient_history:
        for condition in patient_history['conditions']:
            if condition in medicine.get('contraindications', []):
                recommendations.append({
                    'type': 'contraindication',
                    'severity': 'medium',
                    'message': f'{medicine["name"]} is contraindicated for {condition}'
                })
    
    # Check for age restrictions
    if 'age' in patient_history:
        age = patient_history['age']
        if age < medicine.get('min_age', 0):
            recommendations.append({
                'type': 'age',
                'severity': 'medium',
                'message': f'Patient is too young for {medicine["name"]}'
            })
        elif age > medicine.get('max_age', 100):
            recommendations.append({
                'type': 'age',
                'severity': 'medium',
                'message': f'Patient is too old for {medicine["name"]}'
            })
    
    return recommendations 