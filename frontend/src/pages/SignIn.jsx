import React, { useState } from "react";
import axios from "axios";


const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URI}/api/signin`, { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.location.href = "/profile";
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials");
    }
  };

  return (
    <div className="bg-green-50 min-h-screen">
      <div className="flex justify-center items-center h-[80vh]">
        <form
          onSubmit={handleSignin}
          className="bg-white p-8 rounded-2xl shadow-md w-[350px]"
        >
          <h2 className="text-2xl font-semibold text-center mb-6">Sign In</h2>
          {error && <p className="text-red-600 mb-2">{error}</p>}
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
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
          >
            Sign In
          </button>
          <p className="text-sm text-center mt-4">
            Don't have an account?{" "}
            <a href="/signup" className="text-green-700 hover:underline">Sign Up</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signin;
