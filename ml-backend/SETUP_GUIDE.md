# Plant Disease Detection ML Backend Setup Guide

This guide will help you set up and run the ML backend for your Next.js plant disease detection application.

## What We've Done

✅ **Copied the trained model** from your Flask project to the Next.js ml-backend
✅ **Updated app.py** to use the actual trained model and disease classes
✅ **Added plant disease JSON** with detailed disease information
✅ **Updated requirements.txt** with necessary dependencies

## Files Structure

```
nextjs/ml-backend/
├── app.py                    # Main Flask application
├── requirements.txt          # Python dependencies
├── plant_disease.json       # Disease information database
├── models/
│   └── plant_model.keras    # Trained ML model
└── SETUP_GUIDE.md          # This guide
```

## Setup Instructions

### 1. Install Python Dependencies

```bash
cd nextjs/ml-backend
pip install -r requirements.txt
```

**Note:** If you encounter issues with TensorFlow installation, try:
```bash
pip install tensorflow --upgrade
```

### 2. Test the Model Loading

```bash
python -c "import tensorflow as tf; model = tf.keras.models.load_model('models/plant_model.keras'); print('Model loaded successfully!')"
```

### 3. Run the ML Backend Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

### 4. Test the API Endpoints

#### Health Check
```bash
curl http://localhost:5000/health
```

#### Disease Prediction
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{"image": "base64_encoded_image_data"}'
```

## Integration with Next.js Frontend

### 1. Update Next.js Environment Variables

Add to your `.env.local` file:
```
NEXT_PUBLIC_ML_BACKEND_URL=http://localhost:5000
```

### 2. Update API Routes

Your Next.js API routes should call the ML backend:

```typescript
// app/api/scan-plant-health/route.ts
export async function POST(request: Request) {
  const { image } = await request.json();
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_ML_BACKEND_URL}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image }),
  });
  
  const result = await response.json();
  return Response.json(result);
}
```

## Model Information

- **Input Size:** 160x160 pixels
- **Model Type:** Keras/TensorFlow
- **Classes:** 38 different plant diseases and healthy states
- **Supported Plants:** Apple, Blueberry, Cherry, Corn, Grape, Orange, Peach, Pepper, Potato, Raspberry, Soybean, Squash, Strawberry, Tomato

## API Response Format

```json
{
  "disease": "Tomato___Early_blight",
  "confidence": 0.87,
  "severity": "severe",
  "cause": "Fungus Alternaria solani.",
  "cure": "Apply fungicides and remove infected leaves.",
  "all_predictions": {
    "Tomato___Early_blight": 0.87,
    "Tomato___Late_blight": 0.08,
    "Tomato___healthy": 0.05
  }
}
```

## Deployment Options

### Local Development
- Run both Next.js and Flask servers simultaneously
- Next.js: `npm run dev` (port 3000)
- Flask: `python app.py` (port 5000)

### Production Deployment

#### Option 1: Separate Deployment
- Deploy Flask backend to Railway, Render, or AWS
- Update `NEXT_PUBLIC_ML_BACKEND_URL` to production URL

#### Option 2: Vercel Deployment
- Use Vercel's Python runtime for the Flask backend
- Deploy as serverless functions

## Troubleshooting

### Common Issues

1. **TensorFlow Installation Issues**
   ```bash
   pip install --upgrade pip
   pip install tensorflow
   ```

2. **Model Loading Errors**
   - Ensure `models/plant_model.keras` exists
   - Check file permissions

3. **CORS Issues**
   - Flask-CORS is already configured
   - Ensure frontend URL is allowed

4. **Memory Issues**
   - TensorFlow models can be memory-intensive
   - Consider using a server with adequate RAM

### Performance Tips

1. **Model Optimization**
   - Consider converting to TensorFlow Lite for mobile
   - Use model quantization for smaller size

2. **Caching**
   - Implement prediction caching for repeated images
   - Use Redis for session storage

## Next Steps

1. **Test the Integration**
   - Upload a plant image through your Next.js frontend
   - Verify the prediction results

2. **Enhance the UI**
   - Display disease information (cause, cure)
   - Show confidence levels and severity

3. **Add Features**
   - Image preprocessing in the frontend
   - Batch prediction support
   - Historical prediction tracking

## Support

If you encounter any issues:
1. Check the Flask server logs
2. Verify all dependencies are installed
3. Test the model loading independently
4. Check the API endpoints with curl/Postman

The integration is now complete and ready for testing!
