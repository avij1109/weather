// src/pages/Login.tsx
import React from "react";
import { auth, provider, signInWithPopup } from "../firebase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/dashboard"); // redirect after login
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Sign In with Google</h1>
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
