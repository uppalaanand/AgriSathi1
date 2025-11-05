import React, { useState, useEffect } from 'react'
import API from '../api'
import { Loader2, ExternalLink } from 'lucide-react'

export default function Schemes() {
  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSchemes()
  }, [])

  async function fetchSchemes() {
    try {
      const resp = await API.get('/utils/schemes')
      console.log('Schemes fetched:', resp.data)
      setSchemes(resp.data.schemes || [])
    } catch (err) {
      console.error(err)
      alert('Failed to fetch schemes')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-10 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-green-700 to-blue-600 text-transparent bg-clip-text">
            🌾 Government Schemes for Farmers
          </h1>
          <p className="text-gray-600 mt-3 text-lg max-w-2xl mx-auto">
            Access the latest government initiatives, subsidies, and financial support for farmers — all in one place.
          </p>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex justify-center items-center py-16 text-green-700 text-lg">
            <Loader2 className="animate-spin mr-2" size={24} />
            Fetching the latest schemes...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {schemes.length > 0 ? (
              schemes.map((s) => (
                <a
                  key={s.id}
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative bg-white/90 backdrop-blur-sm border border-green-100 rounded-2xl p-6 shadow-md hover:shadow-xl hover:border-green-300 transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Decorative gradient bar */}
                  <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-green-600 to-blue-500 rounded-t-2xl"></div>

                  <h3 className="mt-3 text-xl font-bold text-green-800 group-hover:text-green-700 transition-colors duration-200">
                    {s.title}
                  </h3>

                  <p className="text-gray-600 text-sm mt-3 leading-relaxed line-clamp-3">
                    {s.description || 'No description available.'}
                  </p>

                  <p className="text-sm text-gray-500 mt-4">
                    <span className="font-medium text-gray-700">Regions:</span>{' '}
                    {s.states?.length ? s.states.join(', ') : 'All India'}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-green-700 font-medium text-sm group-hover:underline">
                    <ExternalLink size={16} />
                    <span>Visit Official Site</span>
                  </div>
                </a>
              ))
            ) : (
              <div className="text-gray-500 col-span-full text-center py-12 bg-white/70 rounded-2xl border border-dashed border-gray-300 shadow-sm">
                No schemes available currently. Please check again later 🌱
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
