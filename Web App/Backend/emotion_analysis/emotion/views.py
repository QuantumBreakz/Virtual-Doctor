# emotion/views.py
import cv2
import numpy as np
import time
import json
import os
from django.http import StreamingHttpResponse
from django.shortcuts import render
from .model_loader import model, face_cascade, label_map

# Constants
PROBABILITY_THRESHOLD = 40.0
JSON_FILE_PATH = os.path.join(os.path.dirname(__file__), 'emotion_results.json')

# Initialize JSON file
if not os.path.exists(JSON_FILE_PATH):
    with open(JSON_FILE_PATH, "w") as file:
        json.dump([], file)

# Global variables for tracking
previous_emotion = None
emotion_start_time = None
total_detections = 0
consistent_detections = 0

def save_to_json(emotion, timestamp):
    global consistent_detections
    consistent_detections += 1
    with open(JSON_FILE_PATH, "r") as file:
        data = json.load(file)
    if not any(entry['emotion'] == emotion and entry['timestamp'] == timestamp for entry in data):
        data.append({"emotion": emotion, "timestamp": timestamp})
    with open(JSON_FILE_PATH, "w") as file:
        json.dump(data, file, indent=4)

def generate_frames():
    cap = cv2.VideoCapture(0)  # Webcam feed
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray_frame, scaleFactor=1.3, minNeighbors=5)

        global previous_emotion, emotion_start_time, total_detections
        for (x, y, w, h) in faces:
            roi_gray = gray_frame[y:y+h, x:x+w]
            roi_gray = cv2.resize(roi_gray, (48, 48))
            roi_gray = roi_gray / 255.0
            roi_gray = np.expand_dims(roi_gray, axis=-1)
            roi_gray = np.expand_dims(roi_gray, axis=0)

            predictions = model.predict(roi_gray)
            max_index = np.argmax(predictions)
            emotion_label = label_map[max_index]
            emotion_probability = np.max(predictions) * 100

            if emotion_probability < PROBABILITY_THRESHOLD:
                emotion_label = "Uncertain"

            cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 3)
            cv2.putText(frame, f"{emotion_label} ({emotion_probability:.2f}%)", 
                        (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

            current_time = time.time()
            if emotion_label == previous_emotion:
                if emotion_start_time is None:
                    emotion_start_time = current_time
                elif current_time - emotion_start_time >= 5:
                    timestamp = time.strftime('%Y-%m-%d %H:%M:%S')
                    save_to_json(emotion_label, timestamp)
                    emotion_start_time = None
            else:
                previous_emotion = emotion_label
                emotion_start_time = None

            total_detections += 1

        # Add title with gradient
        title_color_1 = (255, 0, 0)
        title_color_2 = (0, 0, 255)
        for i in range(frame.shape[1]):
            ratio = i / frame.shape[1]
            color = tuple(int(title_color_1[j] * (1 - ratio) + title_color_2[j] * ratio) for j in range(3))
            cv2.line(frame, (i, 0), (i, 50), color, 1)
        cv2.putText(frame, "Virtual Doctor - Emotion Detection", (10, 35), 
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)

        # Add stats box
        overlay = frame.copy()
        cv2.rectangle(overlay, (10, 60), (300, 150), (0, 0, 0), -1)
        frame = cv2.addWeighted(overlay, 0.6, frame, 0.4, 0)
        cv2.putText(frame, f"Total Detections: {total_detections}", (20, 90), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
        cv2.putText(frame, f"Consistent Detections: {consistent_detections}", (20, 120), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)

        # Add watermark
        cv2.putText(frame, "Virtual Doctor", 
                    (frame.shape[1]//2 - 100, frame.shape[0] - 20), 
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)

        # Encode frame as JPEG
        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

    cap.release()

def video_feed(request):
    return StreamingHttpResponse(generate_frames(), content_type='multipart/x-mixed-replace; boundary=frame')

def index(request):
    return render(request, 'emotion/index.html')