-- Seed some common plant diseases
insert into public.diseases (name, scientific_name, description, symptoms, causes, treatment, prevention, affected_plants, severity, image_url)
values
  (
    'Powdery Mildew',
    'Erysiphales',
    'A fungal disease that appears as white powdery spots on leaves and stems.',
    ARRAY['White powdery coating on leaves', 'Distorted leaf growth', 'Yellowing leaves', 'Premature leaf drop'],
    ARRAY['High humidity', 'Poor air circulation', 'Overcrowding of plants'],
    'Remove affected leaves, apply fungicide, improve air circulation, and reduce humidity.',
    'Ensure proper spacing between plants, maintain good air circulation, avoid overhead watering.',
    ARRAY['Roses', 'Cucumbers', 'Squash', 'Tomatoes'],
    'moderate',
    '/placeholder.svg?height=400&width=600'
  ),
  (
    'Root Rot',
    'Pythium spp.',
    'A disease caused by waterlogged soil that damages plant roots.',
    ARRAY['Wilting despite wet soil', 'Yellow or brown leaves', 'Soft, mushy roots', 'Stunted growth'],
    ARRAY['Overwatering', 'Poor drainage', 'Contaminated soil'],
    'Remove affected plants, improve drainage, reduce watering frequency, use fungicide if needed.',
    'Use well-draining soil, avoid overwatering, ensure pots have drainage holes.',
    ARRAY['Most houseplants', 'Succulents', 'Vegetables'],
    'severe',
    '/placeholder.svg?height=400&width=600'
  ),
  (
    'Leaf Spot',
    'Various fungi and bacteria',
    'Circular spots on leaves caused by fungal or bacterial infection.',
    ARRAY['Brown or black spots on leaves', 'Yellow halos around spots', 'Leaf drop', 'Reduced vigor'],
    ARRAY['Wet foliage', 'Poor air circulation', 'Infected plant debris'],
    'Remove infected leaves, apply appropriate fungicide or bactericide, improve air circulation.',
    'Water at soil level, remove plant debris, ensure good spacing between plants.',
    ARRAY['Tomatoes', 'Roses', 'Fruit trees', 'Ornamentals'],
    'moderate',
    '/placeholder.svg?height=400&width=600'
  ),
  (
    'Blight',
    'Phytophthora infestans',
    'A rapidly spreading disease that causes plant tissue to die.',
    ARRAY['Dark lesions on leaves and stems', 'Rapid wilting', 'White fungal growth', 'Fruit rot'],
    ARRAY['Cool, wet weather', 'High humidity', 'Infected plant material'],
    'Remove and destroy infected plants, apply copper-based fungicide, improve air circulation.',
    'Use resistant varieties, avoid overhead watering, practice crop rotation.',
    ARRAY['Tomatoes', 'Potatoes', 'Peppers'],
    'severe',
    '/placeholder.svg?height=400&width=600'
  ),
  (
    'Aphid Infestation',
    'Aphidoidea',
    'Small sap-sucking insects that damage plants and spread diseases.',
    ARRAY['Clusters of small insects on stems', 'Curled or distorted leaves', 'Sticky honeydew on leaves', 'Stunted growth'],
    ARRAY['Warm weather', 'New plant growth', 'Lack of natural predators'],
    'Spray with water, apply insecticidal soap, introduce beneficial insects like ladybugs.',
    'Encourage beneficial insects, use companion planting, inspect plants regularly.',
    ARRAY['Most plants', 'Vegetables', 'Ornamentals'],
    'mild',
    '/placeholder.svg?height=400&width=600'
  )
on conflict (name) do nothing;
