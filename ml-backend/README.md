# Plant Disease Detection ML Backend

This is a Flask backend for plant disease detection using a trained ML model.

## Setup

1. **Install dependencies:**
   \`\`\`bash
   cd ml-backend
   pip install -r requirements.txt
   \`\`\`

2. **Add your trained model:**
   - Place your trained model file in `ml-backend/models/plant_disease_model.h5`
   - Update `DISEASE_CLASSES` in `app.py` to match your model's output classes
   - Adjust image preprocessing in `preprocess_image()` to match your model's requirements

3. **Run the server:**
   \`\`\`bash
   python app.py
   \`\`\`
   
   The server will run on `http://localhost:5000`

## Training Your Model

If you don't have a trained model yet, here's a basic guide:

1. **Collect dataset:** Use PlantVillage dataset or create your own
2. **Train model:** Use TensorFlow/Keras to train a CNN model
3. **Save model:** Save as `.h5` file
4. **Update classes:** Update `DISEASE_CLASSES` in `app.py`

Example training script structure:
\`\`\`python
import tensorflow as tf
from tensorflow.keras import layers, models

# Build model
model = models.Sequential([
    layers.Conv2D(32, (3, 3), activation='relu', input_shape=(224, 224, 3)),
    layers.MaxPooling2D((2, 2)),
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.Flatten(),
    layers.Dense(64, activation='relu'),
    layers.Dense(len(DISEASE_CLASSES), activation='softmax')
])

# Compile and train
model.compile(optimizer='adam',
              loss='categorical_crossentropy',
              metrics=['accuracy'])

# Train with your dataset
# model.fit(train_data, epochs=10)

# Save model
model.save('models/plant_disease_model.h5')
\`\`\`

## Deployment

For production, deploy this Flask backend to:
- **Vercel** (using Python runtime)
- **Railway**
- **Render**
- **AWS Lambda**
- **Google Cloud Run**

Make sure to set the `FLASK_BACKEND_URL` environment variable in your Next.js app to point to your deployed backend.

## API Endpoints

### GET /health
Health check endpoint
\`\`\`bash
curl http://localhost:5000/health
\`\`\`

### POST /predict
Predict plant disease from image
\`\`\`bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{"image": "base64_encoded_image_data"}'
\`\`\`

Response:
\`\`\`json
{
  "disease": "Powdery Mildew",
  "confidence": 0.87,
  "severity": "severe",
  "all_predictions": {}
}
