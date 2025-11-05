// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import API from '../api';

// export default function Signup(){
//   const [form, setForm] = useState({ name:'', email:'', phone:'', password:'' });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async e => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     try{
//       // ✅ Changed from '/signup' to '/auth/register'
//       const res = await API.post('/auth/signup', form);
      
//       if (res.data.token) {
//         localStorage.setItem('token', res.data.token);
//         alert('Account created successfully!');
//         navigate('/');
//         window.location.reload(); // Refresh to update navbar
//       }
//     }catch(err){
//       console.error('Signup error:', err);
//       const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Signup failed. Please try again.';
//       setError(errorMsg);
//       alert(errorMsg);
//     }finally{ 
//       setLoading(false); 
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
//       <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
//         <h2 className="text-3xl font-bold mb-2 text-green-800">Create Account</h2>
//         <p className="text-gray-600 mb-6">Join Agrisathi to connect with buyers and get AI-powered farming insights</p>
        
//         {error && (
//           <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//             <p className="text-red-700 text-sm">{error}</p>
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
//             <input 
//               name="name" 
//               placeholder="Enter your full name" 
//               value={form.name} 
//               onChange={handleChange} 
//               className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//             <input 
//               name="email" 
//               type="email"
//               placeholder="your.email@example.com" 
//               value={form.email} 
//               onChange={handleChange} 
//               className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
//             <input 
//               name="phone" 
//               placeholder="+91 9876543210" 
//               value={form.phone} 
//               onChange={handleChange} 
//               className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
//               required
//             />
//           </div>
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//             <input 
//               name="password" 
//               type="password" 
//               placeholder="Minimum 6 characters" 
//               value={form.password} 
//               onChange={handleChange} 
//               className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
//               required
//               minLength={6}
//             />
//           </div>
//           <button 
//             disabled={loading} 
//             className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-semibold text-lg shadow-md transition disabled:opacity-50"
//           >
//             {loading ? 'Creating Account...' : 'Create Account'}
//           </button>
//         </form>
//         <p className="mt-6 text-center text-gray-600">
//           Already have an account? <Link to="/join" className="text-blue-600 hover:text-blue-700 font-semibold">Login here</Link>
//         </p>
//       </div>
//     </div>
//   );
// }



import React, { useState } from "react";
import axios from "axios";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [primaryCrop, setPrimaryCrop] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:4000/api/signup", {
        name,
        email,
        password,
        primaryCrop, // <-- added this field
      });

      // Save token and user data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Redirect to profile
      window.location.href = "/profile";
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed. Try again.");
    }
  };

  return (
    <div className="bg-green-50 min-h-screen">
      <div className="flex justify-center items-center h-[85vh]">
        <form
          onSubmit={handleSignup}
          className="bg-white p-8 rounded-2xl shadow-md w-[350px]"
        >
          <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>
          {error && <p className="text-red-600 mb-2">{error}</p>}

          <input
            type="text"
            placeholder="Name"
            className="border w-full p-2 mb-4 rounded-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="border w-full p-2 mb-4 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="border w-full p-2 mb-4 rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Primary Crop"
            className="border w-full p-2 mb-4 rounded-md"
            value={primaryCrop}
            onChange={(e) => setPrimaryCrop(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            Sign Up
          </button>

          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <a href="/signin" className="text-green-700 hover:underline">
              Sign In
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
