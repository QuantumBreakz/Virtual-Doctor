import librosa
import numpy as np
from scipy.signal import butter, filtfilt
import soundfile as sf

def extract_audio_features(y, sr):
    """
    Extract comprehensive audio features
    """
    features = {}
    
    # Basic features
    features['duration'] = librosa.get_duration(y=y, sr=sr)
    features['tempo'], _ = librosa.beat.beat_track(y=y, sr=sr)
    
    # Spectral features
    features['spectral_centroid'] = librosa.feature.spectral_centroid(y=y, sr=sr)
    features['spectral_bandwidth'] = librosa.feature.spectral_bandwidth(y=y, sr=sr)
    features['spectral_rolloff'] = librosa.feature.spectral_rolloff(y=y, sr=sr)
    
    # MFCCs
    features['mfccs'] = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    
    # Chroma features
    features['chroma'] = librosa.feature.chroma_stft(y=y, sr=sr)
    
    # Zero crossing rate
    features['zero_crossing_rate'] = librosa.feature.zero_crossing_rate(y)
    
    # RMS energy
    features['rms'] = librosa.feature.rms(y=y)
    
    return features

def apply_bandpass_filter(y, sr, lowcut=20, highcut=20000):
    """
    Apply bandpass filter to audio signal
    """
    nyquist = sr / 2
    low = lowcut / nyquist
    high = highcut / nyquist
    b, a = butter(4, [low, high], btype='band')
    return filtfilt(b, a, y)

def normalize_audio(y):
    """
    Normalize audio signal
    """
    return librosa.util.normalize(y)

def detect_silence(y, sr, threshold=0.01, min_duration=0.1):
    """
    Detect silence periods in audio
    """
    # Calculate energy
    energy = librosa.feature.rms(y=y)[0]
    
    # Find silent regions
    silent_regions = energy < threshold
    
    # Convert to time
    frame_length = len(y) / len(energy)
    silent_durations = []
    
    start = None
    for i, is_silent in enumerate(silent_regions):
        if is_silent and start is None:
            start = i * frame_length / sr
        elif not is_silent and start is not None:
            duration = (i * frame_length / sr) - start
            if duration >= min_duration:
                silent_durations.append((start, duration))
            start = None
    
    return silent_durations

def segment_audio(y, sr, segment_length=3.0):
    """
    Segment audio into fixed-length chunks
    """
    segment_samples = int(segment_length * sr)
    segments = []
    
    for i in range(0, len(y), segment_samples):
        segment = y[i:i + segment_samples]
        if len(segment) == segment_samples:
            segments.append(segment)
    
    return segments

def save_audio_segment(y, sr, filename, start_time, end_time):
    """
    Save a segment of audio to file
    """
    start_sample = int(start_time * sr)
    end_sample = int(end_time * sr)
    segment = y[start_sample:end_sample]
    sf.write(filename, segment, sr) 