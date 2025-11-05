import React, { useEffect, useState } from 'react';

// --- Hardcoded Data ---
const dummyItems = [
  {
    _id: 'l001',
    crop: 'Organic Wheat Grain',
    qty: '500 kg',
    price: 35000,
    image: "../images/wheet.jpg"
  },
  {
    _id: 'l002',
    crop: 'Fresh Tomatoes',
    qty: '150 kg',
    price: 9000,
    image: "../images/tomatoes.webp"
  },
  {
    _id: 'l003',
    crop: 'Basmati Rice (New Crop)',
    qty: '1000 kg',
    price: 65000,
    image: "../images/rice.jpeg"
  },
  {
    _id: 'l004',
    crop: 'Potatoes (A-Grade)',
    qty: '250 kg',
    price: 4500,
    image: "../images/potatos.jpeg"
  },
  {
    _id: 'l005',
    crop: 'Fresh Bananas (G9)',
    qty: '200 dozen',
    price: 8000,
    image: "../images/banana.jpeg"
  },
  {
    _id: 'l006',
    crop: 'Green Chillies',
    qty: '75 kg',
    price: 5250,
    image: "../images/chillis.jpeg"
  },
  {
    _id: 'l007',
    crop: 'Pure Cotton Bales',
    qty: '10 Bales',
    price: 120000,
    image: "../images/cotton.jpg"
  }
];
// ------------------------------

const handleBuyClick = (cropName) => {
  const encodedQuery = encodeURIComponent(`${cropName} for sale`);
  window.open(`https://www.google.com/search?q=${encodedQuery}&tbm=shop`, '_blank');
};

export default function Marketplace() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchItems() }, []);

  async function fetchItems() {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      setItems(dummyItems);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-10 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-green-600 to-blue-600 text-transparent bg-clip-text">
            🌾 Farmer’s Marketplace
          </h1>
          <p className="text-gray-600 mt-3 text-lg">
            Discover fresh, organic, and local farm produce at the best prices.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading && (
            <div className="col-span-full text-center text-blue-600 font-semibold text-xl py-12 animate-pulse">
              Loading listings...
            </div>
          )}

          {!loading && items.length === 0 && (
            <div className="col-span-full text-center text-gray-500 text-lg py-12">
              No listings yet. Check back soon 🌱
            </div>
          )}

          {!loading && items.map(item => (
            <div
              key={item._id}
              className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col"
            >
              {/* Image Section */}
              <button
                onClick={() => handleBuyClick(item.crop)}
                className="relative w-full h-56 overflow-hidden"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.crop}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
              </button>

              {/* Card Content */}
              <div className="p-5 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-green-700 transition-colors duration-200">
                    {item.crop}
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Quantity: <span className="font-semibold">{item.qty}</span>
                  </p>
                  <p className="text-gray-700 mt-1">
                    Price: <span className="font-semibold text-green-600">₹{item.price.toLocaleString('en-IN')}</span>
                  </p>
                </div>

                {/* Button (fixed visibility issue) */}
                <div className="mt-5">
                  <button
                    onClick={() => handleBuyClick(item.crop)}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-lg shadow-md hover:shadow-xl hover:from-blue-700 hover:to-green-700 transform hover:-translate-y-1 transition-all duration-300"
                  >
                    🛒 Find & Buy on Google
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
