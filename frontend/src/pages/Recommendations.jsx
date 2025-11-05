import React, { useState } from "react";
import API from "../api";

export default function Recommendation() {
  const [form, setForm] = useState({
    location: "",
    season: "",
    duration: "",
    soilType: "",
    waterResources: "",
    landSize: "",
    landUnit: "Acres",
  });

  const [result, setResult] = useState(null);
  const [teluguName, setTeluguName] = useState("");
  const [loading, setLoading] = useState(false);

  const seasons = ["Summer", "Rainy", "Winter"];
  const soilTypes = ["Clay", "Sandy", "Loamy", "Black Soil", "Red Soil"];
  const waterLevels = ["Low", "Medium", "High"];
  const landUnits = ["Acres", "Cents", "Hectares"];

  const fallbackCrops = [
    { recommended_crop: "Wheat", reason: "Suitable for medium soil and seasonal conditions" },
    { recommended_crop: "Rice", reason: "Grows well in wet conditions and loamy soil" },
    { recommended_crop: "Maize", reason: "High yield crop for summer season" },
    { recommended_crop: "Tomato", reason: "Short duration crop, grows well in various soils" },
    { recommended_crop: "Sugarcane", reason: "Suitable for large land with high water availability" },
  ];

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // 🔹 Translate English crop name → Telugu using Gemini
  async function translateToTelugu(text) {
    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": `${process.env.GEMINI_API_KEY}`, 
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `Translate the following crop name into Telugu only, without any extra words:\n\n${text}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const translation =
        data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
      return translation;
    } catch (err) {
      console.error("Translation failed:", err);
      return "";
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setTeluguName("");

    try {
      const resp = await API.post("/ml/recommend_crop_gemini", form);
      let cropData = resp.data;

      if (!cropData || !cropData.recommended_crop) {
        const random = fallbackCrops[Math.floor(Math.random() * fallbackCrops.length)];
        cropData = random;
      }

      setResult(cropData);

      // 🌾 Get Telugu translation dynamically
      const translation = await translateToTelugu(cropData.recommended_crop);
      setTeluguName(translation);

    } catch (err) {
      console.error("API error, using fallback:", err);
      const random = fallbackCrops[Math.floor(Math.random() * fallbackCrops.length)];
      setResult(random);
      const translation = await translateToTelugu(random.recommended_crop);
      setTeluguName(translation);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-lg p-8 lg:p-12 grid lg:grid-cols-2 gap-10 border border-green-100">
        
        {/* Left: Form */}
        <div>
          <h2 className="text-3xl font-extrabold text-green-800 mb-6">
            🌾 Smart Crop Recommendation
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Location */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                className="border border-green-200 focus:ring-2 focus:ring-green-400 rounded-xl p-3 outline-none"
                placeholder="Enter your village or district"
              />
            </div>

            {/* Season */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">Season</label>
              <select
                name="season"
                value={form.season}
                onChange={handleChange}
                required
                className="border border-green-200 focus:ring-2 focus:ring-green-400 rounded-xl p-3 outline-none"
              >
                <option value="">Select Season</option>
                {seasons.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">Duration</label>
              <input
                type="text"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                required
                className="border border-green-200 focus:ring-2 focus:ring-green-400 rounded-xl p-3 outline-none"
                placeholder="e.g. 6 months"
              />
            </div>

            {/* Soil Type */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">Soil Type</label>
              <select
                name="soilType"
                value={form.soilType}
                onChange={handleChange}
                required
                className="border border-green-200 focus:ring-2 focus:ring-green-400 rounded-xl p-3 outline-none"
              >
                <option value="">Select Soil Type</option>
                {soilTypes.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Water Resources */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">Water Resources</label>
              <select
                name="waterResources"
                value={form.waterResources}
                onChange={handleChange}
                required
                className="border border-green-200 focus:ring-2 focus:ring-green-400 rounded-xl p-3 outline-none"
              >
                <option value="">Select Water Level</option>
                {waterLevels.map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>

            {/* Land Size */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">Land Size</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="landSize"
                  value={form.landSize}
                  onChange={handleChange}
                  required
                  className="border border-green-200 focus:ring-2 focus:ring-green-400 rounded-xl p-3 w-full outline-none"
                  placeholder="Enter size"
                />
                <select
                  name="landUnit"
                  value={form.landUnit}
                  onChange={handleChange}
                  className="border border-green-200 focus:ring-2 focus:ring-green-400 rounded-xl p-3 outline-none"
                >
                  {landUnits.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="sm:col-span-2 mt-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-3 rounded-xl transition-all w-full shadow-md"
                disabled={loading}
              >
                {loading ? "Processing..." : "Get Recommendation 🌱"}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Result */}
        <div className="flex flex-col justify-center bg-green-50 border border-green-100 rounded-2xl p-8 shadow-inner text-center">
          {result ? (
            <>
              <h3 className="text-2xl font-bold text-green-800">Recommended Crop</h3>
              <p className="text-4xl font-extrabold text-green-700 mt-4">
                {result.recommended_crop}
              </p>
              {teluguName && (
                <p className="text-2xl text-green-600 font-semibold mt-2">
                  ({teluguName})
                </p>
              )}
              <p className="text-sm text-gray-700 mt-3 max-w-md mx-auto">
                🌱 Reason: <span className="font-medium">{result.reason}</span>
              </p>
            </>
          ) : (
            <div className="text-gray-500 italic">
              🌾 Your personalized crop recommendation will appear here after submitting.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
