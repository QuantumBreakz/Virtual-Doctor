import cv2
import numpy as np
import time
import json
import os
from tensorflow.keras.models import load_model

# Load the trained model and Haar Cascade
model = load_model("emotion_detection_model.h5")
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Updated label map with wider range of emotions
label_map = {
    0: 'Angry',
    1: 'Disgust',
    2: 'Fear',
    3: 'Happy',
    4: 'Sad',
    5: 'Surprise',
    6: 'Neutral',
    7: 'Confused',
    8: 'Tired',
    9: 'Bored',
    10: 'Excited',
    11: 'Content'
}

# Emotion probability threshold
PROBABILITY_THRESHOLD = 40.0  # Percentage

# Initialize variables for emotion tracking
previous_emotion = None
emotion_start_time = None
results = []
total_detections = 0
consistent_detections = 0

# JSON file for saving results
json_file_path = "emotion_results.json"

# Create JSON file if it doesn't exist
if not os.path.exists(json_file_path):
    with open(json_file_path, "w") as file:
        json.dump([], file)

# Function to save data to JSON
def save_to_json(emotion, timestamp):
    global consistent_detections
    consistent_detections += 1
    with open(json_file_path, "r") as file:
        data = json.load(file)

    # Check for duplicate entries
    if not any(entry['emotion'] == emotion and entry['timestamp'] == timestamp for entry in data):
        data.append({"emotion": emotion, "timestamp": timestamp})

    with open(json_file_path, "w") as file:
        json.dump(data, file, indent=4)

# Start webcam feed
cap = cv2.VideoCapture(0)  # Use 0 for the primary webcam

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Convert frame to grayscale
    gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Detect faces
    faces = face_cascade.detectMultiScale(gray_frame, scaleFactor=1.3, minNeighbors=5)

    for (x, y, w, h) in faces:
        # Extract face ROI
        roi_gray = gray_frame[y:y+h, x:x+w]
        roi_gray = cv2.resize(roi_gray, (48, 48))  # Resize to 48x48
        roi_gray = roi_gray / 255.0  # Normalize pixel values
        roi_gray = np.expand_dims(roi_gray, axis=-1)  # Add channel dimension
        roi_gray = np.expand_dims(roi_gray, axis=0)  # Add batch dimension

        # Predict emotion
        predictions = model.predict(roi_gray)
        max_index = np.argmax(predictions)
        emotion_label = label_map[max_index]
        emotion_probability = np.max(predictions) * 100

        # Check if probability is above the threshold
        if emotion_probability < PROBABILITY_THRESHOLD:
            emotion_label = "Uncertain"

        # Draw a rectangle and label around the face
        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 3)
        cv2.putText(frame, f"{emotion_label} ({emotion_probability:.2f}%)", 
                    (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

        # Track consistent emotion
        current_time = time.time()
        if emotion_label == previous_emotion:
            if emotion_start_time is None:
                emotion_start_time = current_time
            elif current_time - emotion_start_time >= 5:  # Emotion is consistent for 5 seconds
                timestamp = time.strftime('%Y-%m-%d %H:%M:%S')
                save_to_json(emotion_label, timestamp)
                emotion_start_time = None  # Reset the timer
        else:
            previous_emotion = emotion_label
            emotion_start_time = None

        total_detections += 1

    # Add a title with a gradient effect
    title_color_1 = (255, 0, 0)
    title_color_2 = (0, 0, 255)
    for i in range(frame.shape[1]):
        ratio = i / frame.shape[1]
        color = tuple(int(title_color_1[j] * (1 - ratio) + title_color_2[j] * ratio) for j in range(3))
        cv2.line(frame, (i, 0), (i, 50), color, 1)

    cv2.putText(frame, "Virtual Doctor - Emotion Detection", (10, 35), 
                cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)

    # Add a semi-transparent stats box
    overlay = frame.copy()
    cv2.rectangle(overlay, (10, 60), (300, 150), (0, 0, 0), -1)
    alpha = 0.6
    frame = cv2.addWeighted(overlay, alpha, frame, 1 - alpha, 0)

    # Display live statistics
    cv2.putText(frame, f"Total Detections: {total_detections}", (20, 90), 
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
    cv2.putText(frame, f"Consistent Detections: {consistent_detections}", (20, 120), 
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)

    # Add a central watermark
    cv2.putText(frame, "Virtual Doctor", 
                (frame.shape[1]//2 - 100, frame.shape[0] - 20), 
                cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)

    # Display the frame
    cv2.imshow("Live Emotion Detection", frame)

    # Exit on pressing 'q'
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release resources
cap.release()
cv2.destroyAllWindows()

