# Deployment Guide

## Overview

This PlantGrowth AI application consists of two parts:
1. **Next.js Frontend** - Main application (deploy to Vercel)
2. **Flask ML Backend** - Disease detection model (deploy separately)

## Part 1: Deploy Next.js App to Vercel

1. **Push to GitHub** (if not already done)
2. **Click "Publish" button** in v0 to deploy to Vercel
3. **Add Environment Variables** in Vercel dashboard:
   - `GEMINI_API_KEY` - Your Google Gemini API key
   - `FLASK_BACKEND_URL` - URL of your deployed Flask backend (add after Part 2)
   - Supabase variables (auto-configured if using v0 integration)

## Part 2: Deploy Flask ML Backend

### Option A: Deploy to Render (Recommended)

1. **Create a new Web Service** on [Render](https://render.com)
2. **Connect your repository** or upload the `ml-backend` folder
3. **Configure:**
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python app.py`
   - Environment Variables:
     - `PORT` = 10000 (or Render's default)
     - `MODEL_PATH` = `models/plant_disease_model.h5`
4. **Deploy** and copy the service URL
5. **Update Vercel:** Add `FLASK_BACKEND_URL` environment variable with your Render URL

### Option B: Deploy to Railway

1. **Create new project** on [Railway](https://railway.app)
2. **Deploy from GitHub** or upload `ml-backend` folder
3. **Railway auto-detects** Python and installs dependencies
4. **Add environment variables** if needed
5. **Copy the public URL** and add to Vercel as `FLASK_BACKEND_URL`

### Option C: Deploy to Google Cloud Run

\`\`\`bash
cd ml-backend
gcloud run deploy plant-disease-ml \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
\`\`\`

### Option D: Local Development

For testing locally:
\`\`\`bash
cd ml-backend
pip install -r requirements.txt
python app.py
\`\`\`

Then set `FLASK_BACKEND_URL=http://localhost:5000` in your `.env.local`

## Training Your ML Model

If you don't have a trained model yet:

1. **Use PlantVillage dataset** or collect your own plant disease images
2. **Train a CNN model** using TensorFlow/Keras
3. **Save the model** as `plant_disease_model.h5`
4. **Upload to your Flask backend** deployment
5. **Update `DISEASE_CLASSES`** in `app.py` to match your model

Example datasets:
- [PlantVillage Dataset](https://www.kaggle.com/datasets/emmarex/plantdisease)
- [Plant Disease Recognition Dataset](https://www.kaggle.com/datasets/vipoooool/new-plant-diseases-dataset)

## Fallback Behavior

The app is designed to work even without the ML backend:
- If `FLASK_BACKEND_URL` is not set, it uses Gemini AI for disease detection
- If Flask backend fails, it automatically falls back to Gemini
- This ensures the app always works while you're setting up your ML model

## Testing

1. **Test Flask backend:**
   \`\`\`bash
   curl https://your-flask-backend.com/health
   \`\`\`

2. **Test prediction:**
   \`\`\`bash
   curl -X POST https://your-flask-backend.com/predict \
     -H "Content-Type: application/json" \
     -d '{"image": "base64_image_data"}'
   \`\`\`

3. **Test full flow:** Upload a plant image in the app's Plant Health page

## Monitoring

- **Vercel:** Check deployment logs in Vercel dashboard
- **Flask Backend:** Check logs in your hosting provider's dashboard
- **Errors:** Check browser console and Network tab for API errors
