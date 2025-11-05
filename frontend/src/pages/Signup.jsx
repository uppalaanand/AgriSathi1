
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
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URI}/api/signup`, {
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
