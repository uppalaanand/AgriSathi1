import React, { useState } from "react";

export default function CropPlanner() {
  const [crop, setCrop] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const GEMINI_API_KEY = "AIzaSyDlNYAinO0b7eZ3CbyaUVok4wQk6w-m-4g"; // <-- replace with your actual Gemini API key

  // Fallback random crop plan
  const fallbackPlans = {
    wheat: `🌾 **Fallback Wheat Plan**
1️⃣ Prepare land with 2–3 plowings.
2️⃣ Use certified wheat seeds.
3️⃣ Irrigate at 20, 40, 70, and 100 days.
4️⃣ Apply urea and DAP fertilizers.
5️⃣ Watch for rust and aphids.
6️⃣ Harvest after grains turn golden.`,

    rice: `🌾 **Fallback Rice Plan**
1️⃣ Level the field and flood before transplanting.
2️⃣ Use high-yielding varieties like IR-64.
3️⃣ Maintain 2–3 cm water depth.
4️⃣ Apply nitrogen in 3 splits.
5️⃣ Use pre-emergent herbicides for weeds.
6️⃣ Harvest when 80% grains turn golden.`,

    maize: `🌽 **Fallback Maize Plan**
1️⃣ Plow 2–3 times, ensure good drainage.
2️⃣ Apply NPK (120:60:40).
3️⃣ Irrigate every 10–12 days.
4️⃣ Watch for fall armyworms.
5️⃣ Harvest when husks dry and grains harden.`,
  };

  const getCropPlan = async () => {
    if (!crop.trim()) {
      setError("Please enter a crop name.");
      return;
    }

    setLoading(true);
    setError("");
    setPlan("");

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `Provide a complete farming plan for ${crop}. Include land preparation, seed selection, irrigation, pest management, and harvesting steps in detail.`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      console.log("Gemini raw response:", data);

      let textResponse =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        fallbackPlans[crop.toLowerCase()] ||
        "⚠️ Unable to get detailed plan. Please try again.";

      setPlan(textResponse);
    } catch (err) {
      console.error("Gemini API failed:", err);
      setPlan(
        fallbackPlans[crop.toLowerCase()] ||
          "⚠️ Network or API error. Showing fallback plan."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-6 mt-10 border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-green-700 text-center">
        🌿 AI Crop Planner
      </h2>

      <input
        type="text"
        value={crop}
        onChange={(e) => setCrop(e.target.value)}
        placeholder="Enter crop name (e.g., Wheat, Rice, Maize)"
        className="w-full border border-gray-300 rounded-md p-3 mb-4 focus:ring-2 focus:ring-green-500 focus:outline-none"
      />

      <button
        onClick={getCropPlan}
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition-all"
      >
        {loading ? "Analyzing Crop Plan..." : "Get Crop Plan"}
      </button>

      {error && <p className="text-red-600 mt-3 text-center">{error}</p>}

      {plan && (
        <div className="mt-6 p-4 border border-green-200 bg-green-50 rounded-lg whitespace-pre-wrap text-gray-800">
          <h3 className="font-semibold text-green-700 mb-2">
            🌾 Crop Plan for {crop}
          </h3>
          <p>{plan}</p>
        </div>
      )}
    </div>
  );
}
