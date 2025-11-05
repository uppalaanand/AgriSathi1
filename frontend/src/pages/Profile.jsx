// import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import API from '../api';

// export default function Profile() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [editing, setEditing] = useState(false);
//   const [error, setError] = useState(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     phone: '',
//     location: '',
//     soilType: '',
//     crop: '',
//     landSize: '',
//     waterResource: ''
//   });
//   const [saving, setSaving] = useState(false);
//   const navigate = useNavigate();

//   const fetchProfile = useCallback(async () => {
//     try {
//       const token = localStorage.getItem('token');
//       console.log('Token found:', !!token);
      
//       if (!token) {
//         console.log('No token found');
//         setError('Please login to view your profile');
//         setLoading(false);
//         return;
//       }

//       console.log('Fetching profile from /auth/profile endpoint');
//       const res = await API.get('/auth/profile');
      
//       console.log('Profile data received:', res.data);
//       setUser(res.data);
//       setFormData({
//         name: res.data.name || '',
//         phone: res.data.phone || '',
//         location: res.data.location || '',
//         soilType: res.data.soilType || '',
//         crop: res.data.crop || '',
//         landSize: res.data.landSize || '',
//         waterResource: res.data.waterResource || ''
//       });
//       setError(null);
//       setLoading(false);
//     } catch (err) {
//       console.error('Error fetching profile:', err);
//       console.error('Error response:', err.response);
      
//       if (err.response?.status === 401) {
//         console.log('Unauthorized - invalid or expired token');
//         localStorage.removeItem('token');
//         setError('Your session has expired. Please login again.');
//       } else {
//         setError(err.response?.data?.error || 'Failed to load profile. Please try again.');
//       }
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchProfile();
//   }, [fetchProfile]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       const res = await API.put('/auth/profile', formData);
      
//       setUser(res.data);
//       setEditing(false);
//       alert('Profile updated successfully!');
//     } catch (err) {
//       alert(err.response?.data?.error || 'Failed to update profile');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleCancel = () => {
//     setFormData({
//       name: user.name || '',
//       phone: user.phone || '',
//       location: user.location || '',
//       soilType: user.soilType || '',
//       crop: user.crop || '',
//       landSize: user.landSize || '',
//       waterResource: user.waterResource || ''
//     });
//     setEditing(false);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
//         <div className="bg-white p-8 rounded-2xl shadow-lg">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
//           <div className="text-xl text-gray-700">Loading profile...</div>
//         </div>
//       </div>
//     );
//   }

//   if (error || !user) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
//         <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
//           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <span className="text-3xl">⚠️</span>
//           </div>
//           <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Required</h2>
//           <p className="text-gray-700 mb-6">{error || 'Please login to view your profile'}</p>
//           <button 
//             onClick={() => navigate('/join')}
//             className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow-md transition"
//           >
//             Go to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-8 px-4">
//       <div className="max-w-4xl mx-auto">
//         {/* Profile Header */}
//         <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center gap-4">
//               <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
//                 {user.name?.charAt(0).toUpperCase() || 'U'}
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
//                 <p className="text-gray-600">{user.email}</p>
//                 <p className="text-sm text-gray-500">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
//               </div>
//             </div>
//             {!editing && (
//               <button
//                 onClick={() => setEditing(true)}
//                 className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow-md transition"
//               >
//                 ✏️ Edit Profile
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Profile Details */}
//         <div className="bg-white rounded-2xl shadow-lg p-8">
//           <h2 className="text-2xl font-bold text-gray-800 mb-6">
//             {editing ? '✏️ Edit Profile Information' : '👤 Profile Information'}
//           </h2>

//           {editing ? (
//             <form onSubmit={handleSubmit}>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Basic Info */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
//                   <input
//                     type="text"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                     required
//                   />
//                 </div>

//                 {/* Farming Info */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">📍 Location</label>
//                   <input
//                     type="text"
//                     name="location"
//                     value={formData.location}
//                     onChange={handleChange}
//                     placeholder="City, State"
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">🌱 Soil Type</label>
//                   <input
//                     type="text"
//                     name="soilType"
//                     value={formData.soilType}
//                     onChange={handleChange}
//                     placeholder="e.g., Clay, Loamy, Sandy"
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">🌾 Primary Crop</label>
//                   <input
//                     type="text"
//                     name="crop"
//                     value={formData.crop}
//                     onChange={handleChange}
//                     placeholder="e.g., Rice, Wheat, Cotton"
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">📏 Land Size (acres)</label>
//                   <input
//                     type="number"
//                     name="landSize"
//                     value={formData.landSize}
//                     onChange={handleChange}
//                     placeholder="Enter land size"
//                     step="0.1"
//                     min="0"
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                   />
//                 </div>

//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">💧 Water Resource Availability</label>
//                   <select
//                     name="waterResource"
//                     value={formData.waterResource}
//                     onChange={handleChange}
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                   >
//                     <option value="">Select water resource level</option>
//                     <option value="Low">Low - Limited water availability</option>
//                     <option value="Medium">Medium - Moderate water availability</option>
//                     <option value="Full">Full - Abundant water availability</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="flex gap-4 mt-8">
//                 <button
//                   type="submit"
//                   disabled={saving}
//                   className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow-md transition disabled:opacity-50"
//                 >
//                   {saving ? '⏳ Saving...' : '✅ Save Changes'}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleCancel}
//                   className="flex-1 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold shadow-md transition"
//                 >
//                   ❌ Cancel
//                 </button>
//               </div>
//             </form>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <InfoField label="👤 Name" value={user.name} />
//               <InfoField label="📧 Email" value={user.email} />
//               <InfoField label="📱 Phone" value={user.phone} />
//               <InfoField label="🎭 Role" value={user.role} />
//               <InfoField label="📍 Location" value={user.location || 'Not set'} />
//               <InfoField label="🌱 Soil Type" value={user.soilType || 'Not set'} />
//               <InfoField label="🌾 Primary Crop" value={user.crop || 'Not set'} />
//               <InfoField label="📏 Land Size" value={user.landSize ? `${user.landSize} acres` : 'Not set'} />
//               <InfoField 
//                 label="💧 Water Resource" 
//                 value={user.waterResource || 'Not set'}
//                 badge={user.waterResource}
//               />
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// function InfoField({ label, value, badge }) {
//   const getBadgeColor = (val) => {
//     if (val === 'Low') return 'bg-red-100 text-red-700 border border-red-200';
//     if (val === 'Medium') return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
//     if (val === 'Full') return 'bg-green-100 text-green-700 border border-green-200';
//     return 'bg-gray-100 text-gray-700 border border-gray-200';
//   };

//   return (
//     <div className="p-4 bg-gray-50 rounded-lg">
//       <label className="block text-sm font-medium text-gray-500 mb-1">{label}</label>
//       {badge && badge !== 'Not set' ? (
//         <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getBadgeColor(badge)}`}>
//           {value}
//         </span>
//       ) : (
//         <p className="text-gray-800 font-medium">{value || 'Not set'}</p>
//       )}
//     </div>
//   );
// }


// import React, { useEffect, useState } from "react";
// import API from "../api";
// // import "./Profile.css";

// export default function Profile() {
//   const [user, setUser] = useState({});
//   const [edit, setEdit] = useState(false);

//   useEffect(() => {
//     (async () => {
//       const { data } = await API.get("/users/profile");
//       setUser(data);
//     })();
//   }, []);

//   const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

//   const handleSave = async () => {
//     await API.put("/users/profile", user);
//     setEdit(false);
//   };

//   return (
//     <div className="profile-page">
//       <div className="profile-header">
//         <h2>{user.name}</h2>
//         <p>{user.email}</p>
//         <button onClick={() => setEdit(!edit)}>
//           {edit ? "Cancel" : "Edit Profile"}
//         </button>
//       </div>

//       <div className="profile-info">
//         {["phone", "location", "soilType", "primaryCrop", "landSize", "waterResource"].map((key) => (
//           <div className="profile-field" key={key}>
//             <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
//             {edit ? (
//               <input
//                 name={key}
//                 value={user[key] || ""}
//                 onChange={handleChange}
//               />
//             ) : (
//               <span>{user[key] || "Not set"}</span>
//             )}
//           </div>
//         ))}
//         {edit && <button className="save-btn" onClick={handleSave}>Save Changes</button>}
//       </div>
//     </div>
//   );
// }


//original1
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// export default function Profile() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [editing, setEditing] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     phone: '',
//     location: '',
//     soilType: '',
//     crop: '',
//     landSize: '',
//     waterResource: ''
//   });
//   const [saving, setSaving] = useState(false);
//   const navigate = useNavigate();

//   // ✅ Fetch profile using your backend link
//   useEffect(() => {
//     const fetchProfile = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         navigate('/signin');
//         return;
//       }

//       try {
//         const res = await axios.get('http://localhost:4000/api/profile', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = res.data;

//         setUser(data);
//         setFormData({
//           name: data.name || '',
//           phone: data.phone || '',
//           location: data.location || '',
//           soilType: data.answers?.soilType || '',
//           crop: data.answers?.crop || '',
//           landSize: data.answers?.landSize || '',
//           waterResource: data.answers?.waterResource || ''
//         });
//       } catch (err) {
//         console.error('Error fetching profile:', err);
//         localStorage.removeItem('token');
//         navigate('/signin');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProfile();
//   }, [navigate]);

//   const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     const token = localStorage.getItem('token');
//     try {
//       const res = await axios.put(`http://localhost:4000/api/profile/${user._id}`, formData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUser(res.data);
//       setEditing(false);
//       alert('Profile updated successfully!');
//     } catch (err) {
//       alert(err.response?.data?.error || 'Failed to update profile');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleCancel = () => {
//     setFormData({
//       name: user.name || '',
//       phone: user.phone || '',
//       location: user.location || '',
//       soilType: user.answers?.soilType || '',
//       crop: user.answers?.crop || '',
//       landSize: user.answers?.landSize || '',
//       waterResource: user.answers?.waterResource || ''
//     });
//     setEditing(false);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
//         <div className="bg-white p-8 rounded-2xl shadow-lg">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
//           <div className="text-xl text-gray-700">Loading profile...</div>
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
//         <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
//           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <span className="text-3xl">⚠️</span>
//           </div>
//           <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Required</h2>
//           <p className="text-gray-700 mb-6">Please login to view your profile</p>
//           <button
//             onClick={() => navigate('/signin')}
//             className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow-md transition"
//           >
//             Go to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-8 px-4">
//       <div className="max-w-4xl mx-auto">
//         {/* Profile Header */}
//         <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center gap-4">
//               <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
//                 {user.name?.charAt(0).toUpperCase() || 'U'}
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
//                 <p className="text-gray-600">{user.email}</p>
//                 <p className="text-sm text-gray-500">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
//               </div>
//             </div>
//             {!editing && (
//               <button
//                 onClick={() => setEditing(true)}
//                 className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow-md transition"
//               >
//                 ✏️ Edit Profile
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Profile Details */}
//         <div className="bg-white rounded-2xl shadow-lg p-8">
//           <h2 className="text-2xl font-bold text-gray-800 mb-6">
//             {editing ? '✏️ Edit Profile Information' : '👤 Profile Information'}
//           </h2>

//           {editing ? (
//             <form onSubmit={handleSubmit}>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Basic Info */}
//                 <FormField label="Name" name="name" value={formData.name} onChange={handleChange} required />
//                 <FormField label="Phone" name="phone" value={formData.phone} onChange={handleChange} required />
//                 <FormField label="Location" name="location" value={formData.location} onChange={handleChange} />
//                 <FormField label="Soil Type" name="soilType" value={formData.soilType} onChange={handleChange} />
//                 <FormField label="Primary Crop" name="crop" value={formData.crop} onChange={handleChange} />
//                 <FormField label="Land Size (acres)" name="landSize" type="number" value={formData.landSize} onChange={handleChange} />
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">💧 Water Resource</label>
//                   <select
//                     name="waterResource"
//                     value={formData.waterResource}
//                     onChange={handleChange}
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                   >
//                     <option value="">Select water resource level</option>
//                     <option value="Low">Low</option>
//                     <option value="Medium">Medium</option>
//                     <option value="Full">Full</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="flex gap-4 mt-8">
//                 <button
//                   type="submit"
//                   disabled={saving}
//                   className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow-md transition disabled:opacity-50"
//                 >
//                   {saving ? '⏳ Saving...' : '✅ Save Changes'}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleCancel}
//                   className="flex-1 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold shadow-md transition"
//                 >
//                   ❌ Cancel
//                 </button>
//               </div>
//             </form>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <InfoField label="👤 Name" value={user.name} />
//               <InfoField label="📧 Email" value={user.email} />
//               <InfoField label="📱 Phone" value={user.phone} />
//               <InfoField label="🎭 Role" value={user.role} />
//               <InfoField label="📍 Location" value={user.location || 'Not set'} />
//               <InfoField label="🌱 Soil Type" value={user.soilType || 'Not set'} />
//               <InfoField label="🌾 Primary Crop" value={user.primaryCrop || 'Not set'} />
//               <InfoField label="📏 Land Size" value={user.landSize ? `${user.landSize} acres` : 'Not set'} />
//               <InfoField label="💧 Water Resource" value={user.waterResource || 'Not set'} badge={user.waterResource} />
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// function InfoField({ label, value, badge }) {
//   const getBadgeColor = (val) => {
//     if (val === 'Low') return 'bg-red-100 text-red-700 border border-red-200';
//     if (val === 'Medium') return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
//     if (val === 'Full') return 'bg-green-100 text-green-700 border border-green-200';
//     return 'bg-gray-100 text-gray-700 border border-gray-200';
//   };

//   return (
//     <div className="p-4 bg-gray-50 rounded-lg">
//       <label className="block text-sm font-medium text-gray-500 mb-1">{label}</label>
//       {badge && badge !== 'Not set' ? (
//         <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getBadgeColor(badge)}`}>
//           {value}
//         </span>
//       ) : (
//         <p className="text-gray-800 font-medium">{value || 'Not set'}</p>
//       )}
//     </div>
//   );
// }

// function FormField({ label, name, value, onChange, required, type = 'text' }) {
//   return (
//     <div>
//       <label className="block text-sm font-medium text-gray-700 mb-2">{label}{required && ' *'}</label>
//       <input
//         type={type}
//         name={name}
//         value={value}
//         onChange={onChange}
//         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//         required={required}
//       />
//     </div>
//   );
// }



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    soilType: '',
    crop: '',
    landSize: '',
    waterResource: ''
  });
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  // ✅ Load from localStorage first for faster rendering
  useEffect(() => {
    const cachedUser = localStorage.getItem('user');
    if (cachedUser) {
      setUser(JSON.parse(cachedUser));
      setLoading(false);
    }
  }, []);

  // ✅ Fetch profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/signin');
        return;
      }

      try {
        const res = await axios.get('http://localhost:4000/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        setUser(data);
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          location: data.location || '',
          soilType: data.soilType || '',
          primaryCrop: data.primaryCrop || '',
          landSize: data.landSize || '',
          waterResource: data.waterResource || ''
        });
        // ✅ Update localStorage
        localStorage.setItem('user', JSON.stringify(data));
      } catch (err) {
        console.error('Error fetching profile:', err);
        localStorage.removeItem('token');
        navigate('/signin');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // ✅ Save profile + update localStorage
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem('token');
    try {
      const res = await axios.put(`http://localhost:4000/api/profile/${user._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data)); // ✅ Update localStorage
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      phone: user.phone || '',
      location: user.location || '',
      soilType: user.soilType || '',
      primaryCrop: user.primaryCrop || '',
      landSize: user.landSize || '',
      waterResource: user.waterResource || ''
    });
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <div className="text-xl text-gray-700">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Required</h2>
          <p className="text-gray-700 mb-6">Please login to view your profile</p>
          <button
            onClick={() => navigate('/signin')}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow-md transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow-md transition"
              >
                ✏️ Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {editing ? '✏️ Edit Profile Information' : '👤 Profile Information'}
          </h2>

          {editing ? (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Name" name="name" value={formData.name} onChange={handleChange} required />
                <FormField label="Phone" name="phone" value={formData.phone} onChange={handleChange} required />
                <FormField label="Location" name="location" value={formData.location} onChange={handleChange} />
                <FormField label="Soil Type" name="soilType" value={formData.soilType} onChange={handleChange} />
                <FormField label="Primary Crop" name="primaryCrop" value={formData.crop} onChange={handleChange} />
                <FormField label="Land Size (acres)" name="landSize" type="number" value={formData.landSize} onChange={handleChange} />
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">💧 Water Resource</label>
                  <select
                    name="waterResource"
                    value={formData.waterResource}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select water resource level</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="Full">Full</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow-md transition disabled:opacity-50"
                >
                  {saving ? '⏳ Saving...' : '✅ Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold shadow-md transition"
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoField label="👤 Name" value={user.name} />
              <InfoField label="📧 Email" value={user.email} />
              <InfoField label="📱 Phone" value={user.phone} />
              <InfoField label="🎭 Role" value={user.role} />
              <InfoField label="📍 Location" value={user.location || 'Not set'} />
              <InfoField label="🌱 Soil Type" value={user.soilType || 'Not set'} />
              <InfoField label="🌾 Primary Crop" value={user.primaryCrop || 'Not set'} />
              <InfoField label="📏 Land Size" value={user.landSize ? `${user.landSize} acres` : 'Not set'} />
              <InfoField label="💧 Water Resource" value={user.waterResource || 'Not set'} badge={user.waterResource} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoField({ label, value, badge }) {
  const getBadgeColor = (val) => {
    if (val === 'Low') return 'bg-red-100 text-red-700 border border-red-200';
    if (val === 'Medium') return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
    if (val === 'Full') return 'bg-green-100 text-green-700 border border-green-200';
    return 'bg-gray-100 text-gray-700 border border-gray-200';
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <label className="block text-sm font-medium text-gray-500 mb-1">{label}</label>
      {badge && badge !== 'Not set' ? (
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getBadgeColor(badge)}`}>
          {value}
        </span>
      ) : (
        <p className="text-gray-800 font-medium">{value || 'Not set'}</p>
      )}
    </div>
  );
}

function FormField({ label, name, value, onChange, required, type = 'text' }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && ' *'}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        required={required}
      />
    </div>
  );
}
