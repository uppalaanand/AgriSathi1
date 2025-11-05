const express = require('express'), jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/login', async (req,res)=>{
  const { email, password } = req.body;
  // For production: use Firebase Authentication in frontend to sign in,
  // then verify ID token on backend using firebase-admin.
  // Here: simple mock login for demo:
  if(email && password){
    const user = { id: 'user_' + Date.now(), email, role: 'farmer' };
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn:'7d' });
    return res.json({ token, user });
  }
  return res.status(400).json({error:'Missing credentials'});
});


module.exports = router;
