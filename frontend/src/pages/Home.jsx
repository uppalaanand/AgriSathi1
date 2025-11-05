import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaLeaf, FaChartLine, FaCloudSun } from 'react-icons/fa'
import { GiFarmer } from 'react-icons/gi'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-50 flex flex-col">
      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-10 space-y-10">

        {/* Header */}
        <header className="bg-white p-10 md:p-10 rounded-2xl shadow-md flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-extrabold text-green-800 leading-tight">
              Welcome to Agrisathi
            </h1>
            <p className="mt-4 text-gray-700 text-lg md:text-xl">
              AI-powered platform connecting farmers with buyers and intelligent advisories.
            </p>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <GiFarmer size={120} className="text-green-400" />
          </div>
        </header>

        {/* Feature Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card
            title="Disease Detection"
            to="/disease"
            icon={<FaLeaf size={40} className="text-green-500" />}
          >
            Upload crop images and get instant diagnosis & treatment advice.
          </Card>

          <Card
            title="Crop Planner"
            to="/price"
            icon={<FaChartLine size={40} className="text-green-500" />}
          >
            View predicted mandi prices using historical data.
          </Card>

          <Card
            title="Weather"
            to="/weather"
            icon={<FaCloudSun size={40} className="text-green-500" />}
          >
            Live weather for your location to plan irrigation & activities.
          </Card>
        </section>

        {/* Quick Actions */}
        <section className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border-l-8 border-indigo-500">
          <h2 className="font-semibold text-2xl md:text-3xl text-indigo-700">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-4 mt-6">
            <Link
              to="/marketplace"
              className="px-6 py-3 bg-green-600 hover:bg-green-700 transition text-white rounded-lg shadow-md font-medium text-lg flex items-center gap-2"
            >
              <FaLeaf /> Go to Marketplace
            </Link>
            <Link
              to="/schemes"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-lg shadow-md font-medium text-lg flex items-center gap-2"
            >
              <FaChartLine /> View Schemes
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}

// Individual Card component
function Card({ title, children, to, icon }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg hover:scale-105 transition transform duration-300 border-l-4 border-green-500 flex flex-col justify-between">
      <div className="flex items-center gap-4">
        {icon}
        <h3 className="font-bold text-2xl text-gray-800">{title}</h3>
      </div>
      <p className="text-gray-700 mt-4 text-lg">{children}</p>
      <div className="mt-6">
        <Link
          to={to}
          className="text-white font-medium bg-green-600 px-5 py-3 rounded-lg shadow hover:bg-green-700 transition text-lg flex items-center justify-center"
        >
          Open →
        </Link>
      </div>
    </div>
  )
}
