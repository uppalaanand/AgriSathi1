require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// --- Connect MongoDB ---
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// --------------------- User Schema ---------------------
// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   answers: {
//     crop: { type: String, required: true },
//     q1: { type: String },
//     q2: { type: String },
//     q3: { type: String },
//     q4: { type: String }
//   },
//   createdAt: { type: Date, default: Date.now }
// });

const userSchema = new mongoose.Schema(
  {
    // Basic user info
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Profile details
    phone: { type: String },
    location: { type: String },
    soilType: { type: String },
    primaryCrop: { type: String, required: true }, // ✅ mandatory
    landSize: { type: String },
    waterResource: { type: String },
    // Metadata
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true } // adds createdAt, updatedAt automatically
);

const User = mongoose.model('User', userSchema);

// --------------------- Auth Middleware ---------------------
const authMiddleware = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// --------------------- Auth Routes ---------------------

//SignUp
app.post('/api/signup', async (req, res) => {
  const { name, email, password, primaryCrop, phone, location, soilType, landSize, waterResource } = req.body;

  // ✅ check for mandatory fields
  if (!name || !email || !password || !primaryCrop) {
    return res.status(400).json({ error: "All mandatory fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      primaryCrop,
      phone,
      location,
      soilType,
      landSize,
      waterResource
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signup failed" });
  }
});

app.put('/api/profile/:id', async (req, res) => {
  try {
    const updates = req.body; // only the fields being updated
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});


// Signin
// app.post('/api/signin', async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) return res.status(400).json({ error: "Email and password required" });

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ error: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

//     const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
//     res.json({ token, user });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Signin failed" });
//   }
// });

app.post('/api/signin', async (req, res) => {
  const { email, password } = req.body;

  // ✅ Validate input
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // ✅ Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // ✅ Compare password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // ✅ Return user (excluding password)
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.json({ token, user: userWithoutPassword });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signin failed" });
  }
});

// Get profile (protected)
app.get('/api/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});


const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const PRICE_GEMINI_API_KEY = process.env.PRICE;

// --- Routes ---
const mlRoutes = require('./src/routes/ml');
const authRoutes = require('./src/routes/auth'); // if you have auth
const utilsRoutes = require('./src/routes/utils'); // weather, soil, etc.

app.use('/api/ml', mlRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/utils', utilsRoutes);



app.post("/api/chat", async (req, res) => {
  try {
    const { message, imageBase64, context } = req.body;

    let parts = [];
    if (message) parts.push({ text: message });
    if (imageBase64) {
      parts.push({
        inline_data: {
          mime_type: "image/jpeg",
          data: imageBase64,
        },
      });
    }

    // Core agent prompt
    const systemPrompt = `
You are "Agri-Helper," an expert AI assistant specializing in plant diseases and farming. 
Your only purpose is to help farmers. Do not discuss any other topics.

You must follow this exact flow in conversation order:
1️⃣ If user says hi or hello → respond politely and ask: "Please upload a photo of the diseased plant to start."
2️⃣ If photo uploaded but no location → say: "Thanks for the photo. To provide an accurate diagnosis, please tell me your location (city or region)."
3️⃣ If location given but no soil details → ask: "Got it! Please share your soil type (e.g., clay, loamy, sandy) or recent fertilizer use."
4️⃣ Once you have both photo + location + soil → provide a detailed analysis in this exact format:

*Disease:* [Name]
*Description:* [Short description]
*Cause:* [Likely cause]
*Solution:* [Step-by-step remedy in 3–5 lines]
give response yery shortly and concisely
If user sends extra message after full diagnosis, reply normally based on your expertise.
If context from previous messages exists, continue logically.
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: systemPrompt }],
            },
            ...(context || []),
            {
              role: "user",
              parts,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini error:", errText);
      return res.status(500).json({ reply: "Gemini API error" });
    }

    const data = await response.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini.";

    res.json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ reply: "Error connecting to Gemini agent." });
  }
});


app.post("/api/chat1", async (req, res) => {
  try {
    const { message, pageName } = req.body;

    const prompt = `
You are an AI assistant on a website.
The user is currently on the "${pageName}" page.
Answer their question helpfully.
Question: ${message}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I could not understand.";

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "⚠️ Gemini API error. Try again later." });
  }
});

app.post("/api/translate", async (req, res) => {
  try {
    const { text, targetLang } = req.body;

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
                  text: `Translate the following English text to ${targetLang} language:\n\n${text}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const translated =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || null;

    res.json({ translated });
  } catch (err) {
    console.error("Translation error:", err);
    res.status(500).json({ translated: null });
  }
});



const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

// --- Socket.io for chat (optional) ---
const io = require('socket.io')(server, { cors: { origin: '*' } });
io.on('connection', socket => {
  console.log('Socket connected:', socket.id);
  socket.on('join', room => socket.join(room));
  socket.on('message', msg => io.to(msg.room).emit('message', msg));
});