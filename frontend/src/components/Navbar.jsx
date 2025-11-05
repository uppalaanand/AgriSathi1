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
