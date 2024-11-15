import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'user' && password === 'password') {
      alert('Login successful!');
      navigate('/dashboard'); // Redirect to the Dashboard
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f2e6d9]">
      <h1 className="text-3xl font-bold mb-8 text-center text-[#6b4f4f]">Loan Management System</h1>
      <div className="bg-[#fff7f0] p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#6b4f4f]">Enter as Admin</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-[#6b4f4f] text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#a67a6b]"
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-[#6b4f4f] text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-[#a67a6b]"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#a67a6b] text-white py-2 px-4 rounded-lg hover:bg-[#8b5e54] transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
