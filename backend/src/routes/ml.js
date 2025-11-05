const express = require('express');
const axios = require('axios');
const router = express.Router();

const ML_BASE = process.env.ML_BASE_URL || 'http://localhost:5000';

// --- Disease Prediction ---
router.post('/disease', async (req, res) => {
  try {
    const resp = await axios.post(`${ML_BASE}/predict_disease`, req.body, { timeout: 120000 });
    return res.json(resp.data);
  } catch (err) {
    console.error('⚠ Disease prediction failed:', err.message);
    return res.json({
      status: 'fallback',
      disease: 'Healthy',
      severity: 'None',
      advice: 'Looks healthy. Maintain irrigation and follow recommended schedule.'
    });
  }
});

// --- Price Forecast ---
router.get('/price-forecast', async (req, res) => {
  const { crop, market } = req.query;
  try {
    const resp = await axios.get(`${ML_BASE}/forecast_price`, { params: { crop, market } });
    return res.json(resp.data);
  } catch (err) {
    console.error('⚠ Price forecast failed:', err.message);
    return res.json({
      status: 'fallback',
      crop,
      market,
      forecast: [{ date: new Date().toISOString(), predicted_price: 1200 }],
      model: 'mock'
    });
  }
});

// --- Crop Recommendation ---
router.post('/recommend_crop', async (req, res) => {
  try {
    console.log('🌾 Sending recommendation to FastAPI:', req.body);
    const resp = await axios.post(`${ML_BASE}/ml/recommend_crop`, req.body);
    return res.json(resp.data);
  } catch (err) {
    console.error('⚠ Crop recommendation failed:', err.message);
    return res.json({
      status: 'fallback',
      recommended_crop: 'Green Gram',
      confidence: 0.5
    });
  }
});

const fallbackCrops = [
  { recommended_crop: "Wheat", reason: "Stable yield crop suitable for varied climates." },
  { recommended_crop: "Rice", reason: "Ideal for areas with abundant water resources." },
  { recommended_crop: "Maize", reason: "Thrives in well-drained soil with moderate rainfall." },
  { recommended_crop: "Millet", reason: "Excellent for dry regions with limited rainfall." },
  { recommended_crop: "Soybean", reason: "High-protein legume crop that enriches soil fertility." }
];

router.post("/recommend_crop_gemini", async (req, res) => {
  const { location, season, duration, soilType, waterResources, landSize, landUnit } = req.body;

  try {
    const prompt = `
You are an agricultural AI assistant. Based on the following details, recommend ONE ideal crop.
Details:
- Location: ${location}
- Season: ${season}
- Duration: ${duration}
- Soil Type: ${soilType}
- Water Resources: ${waterResources}
- Land Size: ${landSize} ${landUnit}

Respond strictly in JSON format:
{ "recommended_crop": "CropName", "reason": "Short reasoning" }
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();


    // ✅ FIX: Correctly extract Gemini's response text
    let geminiText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Clean markdown wrappers (```json ... ```)
    geminiText = geminiText
      .trim()
      .replace(/^```json/i, "")
      .replace(/^```/, "")
      .replace(/```$/, "")
      .trim();

    console.log("Gemini parsed text:", geminiText);

    let json;
    try {
      json = JSON.parse(geminiText);
      if (!json.recommended_crop) throw new Error("Missing field");
    } catch (err) {
      console.warn("Gemini parsing failed. Using fallback crop.", err.message);
      json = fallbackCrops[Math.floor(Math.random() * fallbackCrops.length)];
    }

    res.json(json);

  } catch (err) {
    console.error("Gemini fetch error:", err.message);
    const fallback = fallbackCrops[Math.floor(Math.random() * fallbackCrops.length)];
    res.json(fallback);
  }
});

const fallbackPlan = {
  crop: "Wheat",
  plan: `
1. Prepare the land and plow properly.
2. Sow wheat seeds in rows.
3. Water regularly and monitor moisture.
4. Apply fertilizers at recommended stages.
5. Keep an eye on pests and diseases.
6. Harvest when grains turn golden.
`
};

router.post("/get_crop_plan", async (req, res) => {
  const { crop } = req.body;

  if (!crop) return res.status(400).json({ error: "Crop name is required" });

  const prompt = `
You are an expert agricultural AI assistant. A farmer is growing ${crop}. 
Provide a complete step-by-step plan from preparation to harvesting. 
Include soil tips, water, fertilizer, pest control, and harvesting steps. 
give response in a 20 lines.
Respond strictly in JSON format:
{ "crop": "CropName", "plan": "Step-by-step plan here" }
`;

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    console.log("Gemini raw response:", JSON.stringify(data, null, 2));

    let geminiText = data?.candidates?.[0]?.content?.[0]?.text || "";
    geminiText = geminiText.trim().replace(/^```json/, "").replace(/```$/, "").trim();

    let json;
    try {
      json = JSON.parse(geminiText);
      if (!json.crop || !json.plan) throw new Error("Missing fields");
    } catch (err) {
      console.warn("Gemini parse failed, using fallback plan.");
      json = { ...fallbackPlan, crop };
    }

    res.json(json);

  } catch (err) {
    console.error("Gemini fetch error:", err.message);
    res.json({ ...fallbackPlan, crop }); // fallback
  }
});



module.exports = router;
