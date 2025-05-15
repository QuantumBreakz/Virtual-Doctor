from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import numpy as np
import librosa
import soundfile as sf
import os
from django.conf import settings
import tensorflow as tf
import speech_recognition as sr
from pydub import AudioSegment
import tempfile

# Load audio processing model
AUDIO_MODEL_PATH = 'models/audio_model.h5'

def load_audio_model():
    """Load the audio processing model"""
    return tf.keras.models.load_model(AUDIO_MODEL_PATH)

@api_view(['POST'])
def process_audio(request):
    """
    Process audio file for analysis
    """
    try:
        audio_file = request.FILES.get('audio')
        
        if not audio_file:
            return Response(
                {'error': 'Audio file is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_file:
            for chunk in audio_file.chunks():
                temp_file.write(chunk)
            temp_path = temp_file.name

        # Load and process audio
        y, sr = librosa.load(temp_path)
        
        # Extract features
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        spectral_center = librosa.feature.spectral_centroid(y=y, sr=sr)
        chroma = librosa.feature.chroma_stft(y=y, sr=sr)
        
        # Clean up temporary file
        os.unlink(temp_path)
        
        return Response({
            'features': {
                'mfccs': mfccs.tolist(),
                'spectral_center': spectral_center.tolist(),
                'chroma': chroma.tolist()
            },
            'duration': librosa.get_duration(y=y, sr=sr),
            'sample_rate': sr
        })

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def transcribe_audio(request):
    """
    Transcribe audio to text
    """
    try:
        audio_file = request.FILES.get('audio')
        
        if not audio_file:
            return Response(
                {'error': 'Audio file is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_file:
            for chunk in audio_file.chunks():
                temp_file.write(chunk)
            temp_path = temp_file.name

        # Initialize recognizer
        recognizer = sr.Recognizer()
        
        # Load audio file
        with sr.AudioFile(temp_path) as source:
            audio_data = recognizer.record(source)
            
            # Perform transcription
            text = recognizer.recognize_google(audio_data)
        
        # Clean up temporary file
        os.unlink(temp_path)
        
        return Response({
            'transcription': text,
            'confidence': 0.95  # Placeholder for actual confidence score
        })

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def analyze_audio(request):
    """
    Analyze audio for various characteristics
    """
    try:
        audio_file = request.FILES.get('audio')
        
        if not audio_file:
            return Response(
                {'error': 'Audio file is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_file:
            for chunk in audio_file.chunks():
                temp_file.write(chunk)
            temp_path = temp_file.name

        # Load audio
        y, sr = librosa.load(temp_path)
        
        # Extract features
        tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
        onset_env = librosa.onset.onset_strength(y=y, sr=sr)
        pitch, _ = librosa.piptrack(y=y, sr=sr)
        
        # Calculate statistics
        pitch_mean = np.mean(pitch)
        onset_mean = np.mean(onset_env)
        
        # Clean up temporary file
        os.unlink(temp_path)
        
        return Response({
            'analysis': {
                'tempo': float(tempo),
                'pitch_mean': float(pitch_mean),
                'onset_mean': float(onset_mean),
                'duration': float(librosa.get_duration(y=y, sr=sr))
            }
        })

    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        ) 