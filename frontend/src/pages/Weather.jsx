import React, { useState, useEffect } from 'react'
import API from '../api'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'
import { WiThermometer, WiHumidity, WiStrongWind } from 'react-icons/wi'

export default function WeatherPage() {
  const [city, setCity] = useState('Hyderabad')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [forecastData, setForecastData] = useState([])

  async function fetchWeather(q) {
    setLoading(true)
    try {
      const resp = await API.get('/utils/weather', { params: { q: q || city } })
      const data = resp.data
      setWeather(data)

      if (data.main) {
        const chartData = [
          { name: 'Temperature (°C)', value: data.main.temp, icon: <WiThermometer className="text-red-500" size={24}/> },
          { name: 'Humidity (%)', value: data.main.humidity, icon: <WiHumidity className="text-blue-500" size={24}/> },
          { name: 'Wind (m/s)', value: data.wind?.speed || 0, icon: <WiStrongWind className="text-green-500" size={24}/> }
        ]
        setForecastData(chartData)
      }
    } catch (err) {
      console.error(err)
      alert('Failed to fetch weather')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWeather(city)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-blue-50 py-10 px-6 md:px-12">
      <h2 className="text-4xl font-extrabold text-green-700 mb-10 text-center drop-shadow-md">
        🌤️ Weather Intelligence
      </h2>

      {/* Search Section */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
        <input
          value={city}
          onChange={e => setCity(e.target.value)}
          className="border-2 border-green-300 bg-white rounded-xl px-5 py-3 shadow focus:outline-none focus:ring-4 focus:ring-green-200 transition w-full sm:w-72 text-gray-700"
          placeholder="Enter city name..."
        />
        <button
          onClick={() => fetchWeather(city)}
          className={`${
            loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
          } text-white px-8 py-3 rounded-xl shadow-md font-semibold tracking-wide transition w-full sm:w-auto`}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Get Weather'}
        </button>
      </div>

      {weather && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {/* Main Weather Card */}
          <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 flex flex-col items-center text-center border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <img
              src={`http://openweathermap.org/img/wn/${weather.weather?.[0]?.icon}@4x.png`}
              alt={weather.weather?.[0]?.description}
              className="w-32 h-32 mb-2"
            />
            <h3 className="text-2xl font-bold text-green-700 mt-2">
              {weather.name}, {weather.sys?.country}
            </h3>
            <p className="text-lg mt-1 capitalize text-gray-600">
              {weather.weather?.[0]?.main} ({weather.weather?.[0]?.description})
            </p>
            <p className="text-5xl font-extrabold mt-3 text-green-800">
              {weather.main?.temp}°C
            </p>
            <p className="mt-2 text-gray-500">Feels like: {weather.main?.feels_like}°C</p>
          </div>

          {/* Detailed Info */}
          <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-2xl font-bold mb-4 text-green-700">
              Weather Details
            </h3>
            <div className="flex flex-col gap-3 text-gray-700">
              <div className="flex items-center gap-2">
                <WiThermometer className="text-red-500" size={24}/>
                Temperature: <span className="font-semibold">{weather.main?.temp}°C</span>
              </div>
              <div className="flex items-center gap-2">
                <WiThermometer className="text-orange-500" size={24}/>
                Feels Like: {weather.main?.feels_like}°C
              </div>
              <div className="flex items-center gap-2">
                <WiThermometer className="text-red-600" size={24}/>
                Min / Max: {weather.main?.temp_min} / {weather.main?.temp_max}°C
              </div>
              <div className="flex items-center gap-2">
                <WiHumidity className="text-blue-500" size={24}/>
                Humidity: {weather.main?.humidity}%
              </div>
              <div className="flex items-center gap-2">
                <WiStrongWind className="text-green-500" size={24}/>
                Wind: {weather.wind?.speed} m/s
              </div>
              <p>Pressure: {weather.main?.pressure} hPa</p>
              <p>
                Condition: {weather.weather?.[0]?.main} ({weather.weather?.[0]?.description})
              </p>
            </div>
          </div>

          {/* Graph Section */}
          <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-2xl font-bold mb-5 text-green-700">Weather Trends</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip contentStyle={{ borderRadius: '10px' }} />
                <Line type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
