// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';

// const links = [
//   { to: '/', label: 'Home' },
//   { to: '/weather', label: 'Weather' },
//   { to: '/price', label: 'Crop Plan' },
//   { to: 'http://127.0.0.1:5500/0.FARMER_bot/index.html', label: 'Disease Detection' },
//   { to: '/recommendations', label: 'Recommendations' },
//   { to: '/marketplace', label: 'Marketplace' },
//   { to: '/schemes', label: 'Schemes' },
//   { to: '/profile', label: 'Profile' }
// ]

// export default function Navbar({ user, isAuthenticated, onLogout }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     if (window.confirm('Are you sure you want to logout?')) {
//       onLogout();
//     }
//   };

//   return (
//     <nav className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <Link to="/" className="flex items-center space-x-2">
//             <span className="text-2xl">🌾</span>
//             <span className="text-2xl font-bold">AgriSathi</span>
//           </Link>

//           {/* Desktop Menu */}
//           <div className="hidden md:flex items-center space-x-6">
//             <Link to="/" className="hover:text-green-200 transition">Home</Link>
//             <Link to="http://127.0.0.1:5500/0.FARMER_bot/index.html" className="hover:text-green-200 transition">Disease Detection</Link>
//             <Link to="/price" className="hover:text-green-200 transition">Crop Plan</Link>
//             <Link to="/weather" className="hover:text-green-200 transition">Weather</Link>
//             <Link to="/recommendations" className="hover:text-green-200 transition">Recommendations</Link>
//             <Link to="/marketplace" className="hover:text-green-200 transition">Marketplace</Link>
//             <Link to="/schemes" className="hover:text-green-200 transition">Schemes</Link>

//             {/* Auth Section */}
//             {isAuthenticated && user ? (
//               <div className="flex items-center gap-4">
//                 <Link 
//                   to="/profile" 
//                   className="flex items-center gap-2 bg-green-800 hover:bg-green-900 px-4 py-2 rounded-lg transition"
//                 >
//                   <FaUser />
//                   <span>{user.name}</span>
//                 </Link>
//                 <button
//                   onClick={handleLogout}
//                   className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
//                 >
//                   <FaSignOutAlt />
//                   <span>Logout</span>
//                 </button>
//               </div>
//             ) : (
//               <Link 
//                 to="/join" 
//                 className="bg-white text-green-700 hover:bg-green-50 px-6 py-2 rounded-full font-semibold transition shadow-md"
//               >
//                 Login
//               </Link>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             onClick={() => setIsOpen(!isOpen)}
//             className="md:hidden text-2xl focus:outline-none"
//           >
//             {isOpen ? <FaTimes /> : <FaBars />}
//           </button>
//         </div>

//         {/* Mobile Menu */}
//         {isOpen && (
//           <div className="md:hidden pb-4 space-y-2">
//             <Link to="/" className="block hover:bg-green-700 px-4 py-2 rounded transition" onClick={() => setIsOpen(false)}>
//               Home
//             </Link>
//             <Link to="http://127.0.0.1:5500/0.FARMER_bot/index.html" className="block hover:bg-green-700 px-4 py-2 rounded transition" onClick={() => setIsOpen(false)}>
//               Disease Detection
//             </Link>
//             <Link to="/price" className="block hover:bg-green-700 px-4 py-2 rounded transition" onClick={() => setIsOpen(false)}>
//               Crop Plan
//             </Link>
//             <Link to="/weather" className="block hover:bg-green-700 px-4 py-2 rounded transition" onClick={() => setIsOpen(false)}>
//               Weather
//             </Link>
//             <Link to="/recommendations" className="block hover:bg-green-700 px-4 py-2 rounded transition" onClick={() => setIsOpen(false)}>
//               Recommendations
//             </Link>
//             <Link to="/marketplace" className="block hover:bg-green-700 px-4 py-2 rounded transition" onClick={() => setIsOpen(false)}>
//               Marketplace
//             </Link>
//             <Link to="/schemes" className="block hover:bg-green-700 px-4 py-2 rounded transition" onClick={() => setIsOpen(false)}>
//               Schemes
//             </Link>

//             {isAuthenticated && user ? (
//               <>
//                 <Link 
//                   to="/profile" 
//                   className="block bg-green-800 hover:bg-green-900 px-4 py-2 rounded transition"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   👤 {user.name}
//                 </Link>
//                 <button
//                   onClick={() => {
//                     setIsOpen(false);
//                     handleLogout();
//                   }}
//                   className="w-full text-left bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
//                 >
//                   🚪 Logout
//                 </button>
//               </>
//             ) : (
//               <Link 
//                 to="/join" 
//                 className="block bg-white text-green-700 hover:bg-green-50 px-4 py-2 rounded font-semibold transition text-center"
//                 onClick={() => setIsOpen(false)}
//               >
//                 Login
//               </Link>
//             )}
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// }

//original
// import React, { useState, useEffect } from "react";
// import { NavLink, useLocation, useNavigate } from "react-router-dom";

// const links = [
//   { to: "/", label: "Home" },
//   { to: "/weather", label: "Weather" },
//   { to: "/price", label: "Crop Plan" },
//   { to: "/disease", label: "Disease Detection" },
//   { to: "/recommendations", label: "Recommendations" },
//   { to: "/marketplace", label: "Marketplace" },
//   { to: "/schemes", label: "Schemes" },
// ];

// export default function Navbar() {
//   const [location, setLocation] = useState("Detecting location...");
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();
//   const currentRoute = useLocation();

//   // Detect if user is logged in
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) setUser(JSON.parse(storedUser));
//     else setUser(null);
//   }, [currentRoute]);

//   // Example location detection
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setLocation(
//             `Lat: ${position.coords.latitude.toFixed(2)}, Lon: ${position.coords.longitude.toFixed(2)}`
//           );
//         },
//         () => setLocation("Location unavailable")
//       );
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//     navigate("/signin");
//   };

//   return (
//     <nav className="bg-green-600 shadow-md">
//       <div className="container mx-auto grid grid-cols-3 items-center px-8 py-4">
        
//         {/* LEFT - Logo */}
//         <div className="flex items-center space-x-3">
//           <span className="text-3xl">🌾</span>
//           <div>
//             <div className="font-bold text-xl text-white">Agrisathi</div>
//             <div className="text-xs text-green-100">AI for farmers</div>
//           </div>
//         </div>

//         {/* CENTER - Navigation Links */}
//         <div className="hidden md:flex justify-center space-x-6">
//           {links.map((l) => (
//             <NavLink
//               key={l.to}
//               to={l.to}
//               className={({ isActive }) =>
//                 "px-3 py-2 rounded-md font-medium transition " +
//                 (isActive
//                   ? "bg-green-500 text-green-900 shadow-inner"
//                   : "text-white hover:bg-green-500")
//               }
//             >
//               {l.label}
//             </NavLink>
//           ))}
//         </div>

//         {/* RIGHT - Auth/Profile Buttons */}
//         <div className="hidden md:flex justify-end items-center space-x-4">
//           {!user ? (
//             <>
//               <NavLink
//                 to="/signin"
//                 className="px-4 py-2 rounded bg-white text-green-700 font-semibold hover:bg-green-100 transition"
//               >
//                 Sign In
//               </NavLink>
//               <NavLink
//                 to="/signup"
//                 className="px-4 py-2 rounded bg-green-100 text-green-900 font-semibold hover:bg-white transition"
//               >
//                 Sign Up
//               </NavLink>
//             </>
//           ) : (
//             <>
//               <NavLink
//                 to="/profile"
//                 className="px-4 py-2 rounded bg-green-50 text-green-700 font-semibold hover:bg-green-200 transition"
//               >
//                 {user.name || "Profile"}
//               </NavLink>
//               <button
//                 onClick={handleLogout}
//                 className="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition"
//               >
//                 Logout
//               </button>
//             </>
//           )}
//         </div>

//         {/* MOBILE MENU */}
//         <div className="md:hidden flex justify-end">
//           <MobileMenu user={user} handleLogout={handleLogout} />
//         </div>
//       </div>
//     </nav>
//   );
// }

// function MobileMenu({ user, handleLogout }) {
//   const [open, setOpen] = useState(false);

//   return (
//     <div>
//       <button
//         onClick={() => setOpen((o) => !o)}
//         className="p-2 bg-green-500 text-white rounded"
//       >
//         ☰
//       </button>
//       {open && (
//         <div className="absolute right-4 mt-2 w-48 bg-white border rounded shadow">
//           {links.map((l) => (
//             <NavLink
//               key={l.to}
//               to={l.to}
//               onClick={() => setOpen(false)}
//               className="block px-4 py-2 hover:bg-gray-50"
//             >
//               {l.label}
//             </NavLink>
//           ))}
//           {!user ? (
//             <NavLink
//               to="/signin"
//               onClick={() => setOpen(false)}
//               className="block px-4 py-2 bg-green-600 text-white hover:bg-green-700"
//             >
//               Sign In
//             </NavLink>
//           ) : (
//             <>
//               <NavLink
//                 to="/profile"
//                 onClick={() => setOpen(false)}
//                 className="block px-4 py-2 hover:bg-gray-50 text-green-700"
//               >
//                 {user.name || "Profile"}
//               </NavLink>
//               <button
//                 onClick={() => {
//                   handleLogout();
//                   setOpen(false);
//                 }}
//                 className="block w-full text-left px-4 py-2 bg-red-600 text-white hover:bg-red-700"
//               >
//                 Logout
//               </button>
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/weather", label: "Weather" },
  { to: "/price", label: "Crop Plan" },
  { to: "/disease", label: "Disease Detection" },
  { to: "/recommendations", label: "Recommendations" },
  { to: "/marketplace", label: "Marketplace" },
  { to: "/schemes", label: "Schemes" },
];

export default function Navbar() {
  const [location, setLocation] = useState("Detecting location...");
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const currentRoute = useLocation();

  // Detect if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setToken(token);
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [currentRoute]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(
            `Lat: ${position.coords.latitude.toFixed(
              2
            )}, Lon: ${position.coords.longitude.toFixed(2)}`
          );
        },
        () => {
          setLocation("Location unavailable");
        }
      );
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/signin");
  };

  return (
    <nav className="bg-green-600 shadow">
      <div className="container flex items-center justify-between p-4 mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-700 text-white flex items-center justify-center rounded">
            A
          </div>
          <div>
            <div className="font-bold text-lg text-white">AgriSathi</div>
            <div className="text-xs text-green-100">AI for Farmers</div>
          </div>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center space-x-3">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                "px-3 py-2 rounded-md font-medium transition " +
                (isActive
                  ? "bg-green-200 text-green-900 shadow-inner"
                  : "text-white hover:bg-green-500")
              }
            >
              {l.label}
            </NavLink>
          ))}

          {!user ? (
            <NavLink
              to="/signin"
              className="px-3 py-2 rounded bg-white text-green-700 font-semibold hover:bg-green-100 transition"
            >
              Sign In
            </NavLink>
          ) : (
            <>
              <NavLink
                to="/profile"
                className="px-3 py-2 rounded bg-green-100 text-green-900 font-medium hover:bg-green-200"
              >
                {token ? user.name : "Profile"}
              </NavLink>
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <MobileMenu user={user} handleLogout={handleLogout} />
        </div>
      </div>
    </nav>
  );
}

function MobileMenu({ user, handleLogout }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-2 bg-green-500 text-white rounded-md"
      >
        ☰
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow z-50">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                "block px-4 py-2 transition " +
                (isActive
                  ? "bg-green-200 text-green-900"
                  : "text-green-700 hover:bg-green-50")
              }
            >
              {l.label}
            </NavLink>
          ))}

          {!user ? (
            <NavLink
              to="/signin"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 bg-green-600 text-white hover:bg-green-700"
            >
              Sign In
            </NavLink>
          ) : (
            <>
              <NavLink
                to="/profile"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-green-700 hover:bg-green-50"
              >
                {user.name || "Profile"}
              </NavLink>
              <button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className="block w-full text-left px-4 py-2 bg-red-600 text-white hover:bg-red-700"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
