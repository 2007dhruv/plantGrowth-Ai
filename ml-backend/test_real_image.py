#!/usr/bin/env python3
"""
Test script using a real plant image from the original project
"""

import tensorflow as tf
import numpy as np
import json
import base64
import os

def test_with_real_image():
    """Test with the real apple image from the original project"""
    print("Testing with real plant image...")
    
    # Load model and classes
    model = tf.keras.models.load_model('models/plant_model.keras')
    
    with open('plant_disease.json', 'r') as file:
        plant_disease_data = json.load(file)
    disease_classes = [disease['name'] for disease in plant_disease_data]
    
    # Path to the real image
    real_image_path = "../../Plant-Disease-Recognition-System-main/uploadimages/temp_8f53f430b0554e05baec76dd87064ba5_apple.jpeg"
    
    if not os.path.exists(real_image_path):
        print(f"Image not found: {real_image_path}")
        return
    
    try:
        # Use the exact same preprocessing as the original project
        image = tf.keras.utils.load_img(real_image_path, target_size=(160, 160))
        feature = tf.keras.utils.img_to_array(image)
        feature = np.array([feature])
        
        print(f"Image shape: {feature.shape}")
        print(f"Image data type: {feature.dtype}")
        print(f"Image value range: {feature.min():.3f} to {feature.max():.3f}")
        
        # Make prediction
        predictions = model.predict(feature)
        predicted_class_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_class_idx])
        disease_name = disease_classes[predicted_class_idx]
        
        print(f"\nPrediction Results:")
        print(f"Predicted class index: {predicted_class_idx}")
        print(f"Predicted disease: {disease_name}")
        print(f"Confidence: {confidence:.4f}")
        
        # Show top 5 predictions
        top_5_indices = np.argsort(predictions[0])[-5:][::-1]
        print(f"\nTop 5 predictions:")
        for i, idx in enumerate(top_5_indices):
            print(f"  {i+1}. {disease_classes[idx]}: {predictions[0][idx]:.4f}")
        
        # Test base64 encoding/decoding
        print(f"\nTesting base64 encoding/decoding...")
        
        # Read image as bytes
        with open(real_image_path, 'rb') as f:
            image_bytes = f.read()
        
        # Encode to base64
        base64_image = base64.b64encode(image_bytes).decode('utf-8')
        print(f"Base64 length: {len(base64_image)}")
        
        # Decode and process
        decoded_bytes = base64.b64decode(base64_image)
        
        # Save to temporary file and process
        import tempfile
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpeg') as tmp_file:
            tmp_file.write(decoded_bytes)
            tmp_path = tmp_file.name
        
        try:
            # Process the decoded image
            decoded_image = tf.keras.utils.load_img(tmp_path, target_size=(160, 160))
            decoded_feature = tf.keras.utils.img_to_array(decoded_image)
            decoded_feature = np.array([decoded_feature])
            
            # Make prediction on decoded image
            decoded_predictions = model.predict(decoded_feature)
            decoded_predicted_class_idx = np.argmax(decoded_predictions[0])
            decoded_confidence = float(decoded_predictions[0][decoded_predicted_class_idx])
            decoded_disease_name = disease_classes[decoded_predicted_class_idx]
            
            print(f"\nDecoded Image Prediction:")
            print(f"Predicted disease: {decoded_disease_name}")
            print(f"Confidence: {decoded_confidence:.4f}")
            
            # Compare with original
            if predicted_class_idx == decoded_predicted_class_idx:
                print("SUCCESS: Base64 encoding/decoding preserves prediction!")
            else:
                print("WARNING: Base64 encoding/decoding changes prediction!")
                print(f"Original: {disease_name} ({confidence:.4f})")
                print(f"Decoded: {decoded_disease_name} ({decoded_confidence:.4f})")
        
        finally:
            # Clean up
            os.unlink(tmp_path)
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_with_real_image()
