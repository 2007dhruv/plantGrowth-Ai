from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import base64
import os
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for Next.js frontend

# Load your trained model
MODEL_PATH = os.getenv('MODEL_PATH', 'models/plant_model.keras')

# Load the actual disease classes from the JSON file
with open('plant_disease.json', 'r') as file:
    plant_disease_data = json.load(file)

# Extract disease names from the JSON data (this is what the model expects)
DISEASE_CLASSES = [disease['name'] for disease in plant_disease_data]

# Create a lookup dictionary for detailed disease info
disease_info_lookup = {disease['name']: disease for disease in plant_disease_data}

# Load the actual trained model
model = tf.keras.models.load_model(MODEL_PATH)

def preprocess_image(image_data):
    """
    Preprocess the image for model prediction
    Using the exact same method as the original Flask project
    """
    # Decode base64 image and save temporarily
    image_bytes = base64.b64decode(image_data)
    
    # Save to temporary file (TensorFlow load_img requires file path)
    import tempfile
    with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp_file:
        tmp_file.write(image_bytes)
        tmp_path = tmp_file.name
    
    try:
        # Use TensorFlow's load_img exactly like the original project
        image = tf.keras.utils.load_img(tmp_path, target_size=(160, 160))
        feature = tf.keras.utils.img_to_array(image)
        feature = np.array([feature])
        
        # Clean up temporary file
        import os
        os.unlink(tmp_path)
        
        return feature
    except Exception as e:
        # Clean up temporary file in case of error
        import os
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)
        raise e

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'ML backend is running'})

@app.route('/debug', methods=['GET'])
def debug_info():
    """Debug endpoint to check model and classes"""
    return jsonify({
        'model_loaded': model is not None,
        'model_input_shape': str(model.input_shape) if model else None,
        'model_output_shape': str(model.output_shape) if model else None,
        'num_classes': len(DISEASE_CLASSES),
        'classes': DISEASE_CLASSES[:5],  # Show first 5 classes
        'model_path': MODEL_PATH
    })

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
        
        # Make prediction using the actual model
        predictions = model.predict(processed_image)
        predicted_class_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_class_idx])
        disease_name = DISEASE_CLASSES[predicted_class_idx]
        
        # Debug logging
        print(f"Prediction shape: {predictions.shape}")
        print(f"Predicted class index: {predicted_class_idx}")
        print(f"Predicted disease: {disease_name}")
        print(f"Confidence: {confidence}")
        print(f"Top 3 predictions: {np.argsort(predictions[0])[-3:][::-1]}")
        
        # Get detailed disease information from JSON
        disease_info = disease_info_lookup[disease_name]
        
        # Determine severity based on confidence
        if confidence > 0.8:
            severity = 'severe'
        elif confidence > 0.6:
            severity = 'moderate'
        else:
            severity = 'mild'
        
        # Get top 3 predictions
        top_3_indices = np.argsort(predictions[0])[-3:][::-1]
        all_predictions = {
            DISEASE_CLASSES[i]: float(predictions[0][i]) 
            for i in top_3_indices
        }
        
        return jsonify({
            'disease': disease_name,
            'confidence': confidence,
            'severity': severity,
            'cause': disease_info['cause'],
            'cure': disease_info['cure'],
            'all_predictions': all_predictions
        })
        
    except Exception as e:
        print(f"Error in prediction: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
