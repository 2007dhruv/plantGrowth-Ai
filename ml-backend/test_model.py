#!/usr/bin/env python3
"""
Test script to debug the ML model predictions
"""

import tensorflow as tf
import numpy as np
import json
import os

def test_model_loading():
    """Test if the model loads correctly"""
    print("Testing model loading...")
    
    try:
        model = tf.keras.models.load_model('models/plant_model.keras')
        print("Model loaded successfully!")
        print(f"Model input shape: {model.input_shape}")
        print(f"Model output shape: {model.output_shape}")
        return model
    except Exception as e:
        print(f"Error loading model: {e}")
        return None

def test_disease_classes():
    """Test disease classes loading"""
    print("\nTesting disease classes...")
    
    try:
        with open('plant_disease.json', 'r') as file:
            plant_disease_data = json.load(file)
        
        disease_classes = [disease['name'] for disease in plant_disease_data]
        print(f"Loaded {len(disease_classes)} disease classes")
        print("First 5 classes:", disease_classes[:5])
        print("Last 5 classes:", disease_classes[-5:])
        
        # Check if "Background_without_leaves" is in the classes
        if "Background_without_leaves" in disease_classes:
            idx = disease_classes.index("Background_without_leaves")
            print(f"WARNING: 'Background_without_leaves' found at index {idx}")
        
        return disease_classes
    except Exception as e:
        print(f"Error loading disease classes: {e}")
        return None

def test_prediction_with_dummy_data(model, disease_classes):
    """Test prediction with dummy data"""
    print("\nTesting prediction with dummy data...")
    
    try:
        # Create dummy image data (160x160x3)
        dummy_image = np.random.random((1, 160, 160, 3)).astype(np.float32)
        
        # Make prediction
        predictions = model.predict(dummy_image)
        predicted_class_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_class_idx])
        disease_name = disease_classes[predicted_class_idx]
        
        print(f"Prediction successful!")
        print(f"Predicted class index: {predicted_class_idx}")
        print(f"Predicted disease: {disease_name}")
        print(f"Confidence: {confidence:.4f}")
        
        # Show top 5 predictions
        top_5_indices = np.argsort(predictions[0])[-5:][::-1]
        print("\nTop 5 predictions:")
        for i, idx in enumerate(top_5_indices):
            print(f"  {i+1}. {disease_classes[idx]}: {predictions[0][idx]:.4f}")
        
        return True
    except Exception as e:
        print(f"Error in prediction: {e}")
        return False

def main():
    print("ML Model Debug Test")
    print("=" * 50)
    
    # Test model loading
    model = test_model_loading()
    if not model:
        return
    
    # Test disease classes
    disease_classes = test_disease_classes()
    if not disease_classes:
        return
    
    # Test prediction
    test_prediction_with_dummy_data(model, disease_classes)
    
    print("\n" + "=" * 50)
    print("Debug test completed!")

if __name__ == "__main__":
    main()
