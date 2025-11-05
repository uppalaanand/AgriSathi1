// export default ChatInput;
import React, { useState } from 'react';
import './ChatInput.css';

const ChatInput = ({ onSend }) => {
  const [input, setInput] = useState('');
  const [image, setImage] = useState(null);

  // Convert uploaded image to Base64
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = () => {
    if (!input.trim() && !image) return;

    if (image) {
      onSend({ text: input.trim(), image }); // send object if image exists
    } else {
      onSend(input.trim()); // else send text only
    }

    setInput('');
    setImage(null); // reset image after sending
  };

  return (
    <div className="p-4 flex flex-col gap-2 border-t border-gray-300 bg-gray-100">
      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="Type your farming question here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        {/* Upload Button */}
        <label className="cursor-pointer bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition">
          📷
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        <button
          onClick={handleSend}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          ➤
        </button>
      </div>

      {/* Image Preview */}
      {image && (
        <div className="relative mt-2">
          <img
            src={image}
            alt="preview"
            className="rounded-lg max-h-40 object-cover border border-gray-300"
          />
          <button
            onClick={() => setImage(null)}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatInput;

