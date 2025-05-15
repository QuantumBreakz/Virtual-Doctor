import tensorflow as tf
import os
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.text import Tokenizer

# Define path
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models', 'lstm_model_sentimentanalysis.h5')

# # Convert to SavedModel format
model = tf.keras.models.load_model(MODEL_PATH, compile=False)
# model.save('lstm_model_tf2')  # Saves in new format

# # Reload without errors
# model = tf.keras.models.load_model('lstm_model_tf2')





# # Load model without compiling
# model = load_model(MODEL_PATH, compile=False)

# # Load model without compiling
# model = load_model('lstm_model_sentimentanalysis.h5', compile=False)

# # Recompile it with correct settings
# model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# # Save the fixed model
# model.save('lstm_model_fixed.h5')

# # Now, load it normally
# model = load_model('lstm_model_fixed.h5')
