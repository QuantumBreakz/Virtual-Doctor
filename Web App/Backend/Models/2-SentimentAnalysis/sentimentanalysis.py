import numpy as np
import re
import cv2
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

# Function to preprocess text
def preprocess_text(text):
    text = text.lower()  # Convert to lowercase
    text = re.sub(r'\d+', '', text)  # Remove numbers
    text = re.sub(r'[^\w\s]', '', text)  # Remove punctuation
    return text

# Load the LSTM model
model = load_model('lstm_model_sentimentanalysis.h5', compile=False)

# Load the tokenizer (ensure it's the same one used during training)
tokenizer = Tokenizer(num_words=5000)

# Define sentiment classes
sentiment_classes = ['Negative', 'Neutral', 'Positive']

# Function to predict sentiment from input text
def predict_sentiment(input_text):
    # Preprocess the input text
    processed_text = preprocess_text(input_text)

    # Tokenize and pad the input text to match the model's input format
    sequences = tokenizer.texts_to_sequences([processed_text])
    max_sequence_length = 100  # Replace with the max sequence length used during training
    padded_sequences = pad_sequences(sequences, maxlen=max_sequence_length)

    # Make the prediction
    prediction = model.predict(padded_sequences)

    # Get the predicted class (index of the maximum probability)
    predicted_class_index = np.argmax(prediction, axis=1)[0]

    # Get the probability of each class
    probabilities = prediction[0]

    # Return the corresponding sentiment label and probabilities
    return sentiment_classes[predicted_class_index], probabilities

# Initialize OpenCV window for visualization
def visualize_sentiment_analysis():
    # Create a blank input text
    input_text = ""

    # OpenCV visualization
    cv2.namedWindow("Sentiment Analysis")
    font = cv2.FONT_HERSHEY_SIMPLEX

    while True:
        # Create a black frame
        frame = np.zeros((500, 800, 3), dtype=np.uint8)

        # Display instructions
        cv2.putText(frame, "Type your text and press 'Enter' to analyze sentiment.", 
                    (20, 40), font, 0.7, (255, 255, 255), 2)

        # Display the input text dynamically
        cv2.putText(frame, f"Input Text: {input_text}", (20, 100), font, 0.6, (0, 255, 255), 2)

        # Wait for key input from user
        key = cv2.waitKey(1) & 0xFF

        # Process key input
        if key == 13:  # Enter key
            if input_text.strip():  # If input text is not empty
                sentiment, probabilities = predict_sentiment(input_text)

                # Display sentiment result
                cv2.putText(frame, f"Predicted Sentiment: {sentiment}", (20, 200), font, 0.8, (0, 255, 0), 2)

                # Display probabilities for each sentiment
                y_offset = 250
                for i, label in enumerate(sentiment_classes):
                    color = (0, 255, 0) if sentiment_classes[i] == sentiment else (255, 255, 255)
                    cv2.putText(frame, f"{label}: {probabilities[i]:.2f}", 
                                (20, y_offset), font, 0.6, color, 2)
                    y_offset += 40

                # Wait for 3 seconds and reset input text
                cv2.imshow("Sentiment Analysis", frame)
                cv2.waitKey(3000)
                input_text = ""

        elif key == 8:  # Backspace key
            input_text = input_text[:-1]
        elif key >= 32 and key <= 126:  # ASCII characters
            input_text += chr(key)
        elif key == ord('q'):  # Quit on 'q' key
            break

        # Display the current frame
        cv2.imshow("Sentiment Analysis", frame)

    # Close OpenCV windows
    cv2.destroyAllWindows()

# Run the visualization
if __name__ == "__main__":
    visualize_sentiment_analysis()

