from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import base64
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for Next.js frontend

# Load your trained model
# Replace this with your actual model path
MODEL_PATH = os.getenv('MODEL_PATH', 'models/plant_disease_model.h5')

# Disease classes - update this with your actual classes
DISEASE_CLASSES = [
    'Healthy',
    'Powdery Mildew',
    'Leaf Spot',
    'Root Rot',
    'Bacterial Blight',
    'Anthracnose',
    'Rust',
    'Mosaic Virus',
    'Wilt Disease',
    'Blossom End Rot'
]

# Load model (uncomment when you have a trained model)
# model = tf.keras.models.load_model(MODEL_PATH)

def preprocess_image(image_data):
    """
    Preprocess the image for model prediction
    Adjust this based on your model's requirements
    """
    # Decode base64 image
    image_bytes = base64.b64decode(image_data)
    image = Image.open(io.BytesIO(image_bytes))
    
    # Convert to RGB if necessary
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    # Resize to model input size (adjust as needed)
    image = image.resize((224, 224))
    
    # Convert to array and normalize
    img_array = np.array(image)
    img_array = img_array / 255.0  # Normalize to [0, 1]
    
    # Add batch dimension
    img_array = np.expand_dims(img_array, axis=0)
    
    return img_array

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'ML backend is running'})

@app.route('/predict', methods=['POST'])
def predict_disease():
    """
    Predict plant disease from image
    Expects JSON with 'image' field containing base64 encoded image
    """
    try:
        data = request.get_json()
        
        if 'image' not in data:
            return jsonify({'error': 'No image provided'}), 400
        
        # Preprocess image
        image_data = data['image']
        processed_image = preprocess_image(image_data)
        
        # Make prediction (uncomment when model is loaded)
        # predictions = model.predict(processed_image)
        # predicted_class_idx = np.argmax(predictions[0])
        # confidence = float(predictions[0][predicted_class_idx])
        # disease = DISEASE_CLASSES[predicted_class_idx]
        
        # DEMO MODE: Return mock prediction
        # Replace this with actual model prediction
        disease = 'Powdery Mildew'
        confidence = 0.87
        
        # Determine severity based on confidence
        if confidence > 0.8:
            severity = 'severe'
        elif confidence > 0.6:
            severity = 'moderate'
        else:
            severity = 'mild'
        
        return jsonify({
            'disease': disease,
            'confidence': confidence,
            'severity': severity,
            'all_predictions': {
                # Include top 3 predictions (uncomment when model is loaded)
                # DISEASE_CLASSES[i]: float(predictions[0][i])
                # for i in np.argsort(predictions[0])[-3:][::-1]
            }
        })
        
    except Exception as e:
        print(f"Error in prediction: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
