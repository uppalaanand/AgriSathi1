import React, { useState, useRef, useEffect } from "react";

export default function AgentChatbot() {
  const [messages, setMessages] = useState([
    { type: "bot", text: "👋 Hi! I'm Agri-Helper. Please upload a photo of the diseased plant to start." },
  ]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [translateTelugu, setTranslateTelugu] = useState(false);
  const [speakEnabled, setSpeakEnabled] = useState(true);
  const chatEndRef = useRef(null);
  const [context, setContext] = useState([]); // 🧠 to maintain chat history

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (err) => reject(err);
    });

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setText(transcript);
      handleSend(transcript);
    };
    recognition.start();
  };

  const translateText = async (text) => {
    if (!translateTelugu) return text;
    try {
      const res = await fetch(
        "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=te&dt=t&q=" +
          encodeURIComponent(text)
      );
      const data = await res.json();
      return data[0].map((t) => t[0]).join("");
    } catch {
      return text + " (⚠️ translation failed)";
    }
  };

  const speakText = (text) => {
    if (!speakEnabled) {
      window.speechSynthesis.cancel();
      return;
    }
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = translateTelugu ? "te-IN" : "en-US";
    utterance.rate = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (customMessage) => {
    const messageToSend = customMessage ?? text;
    if (!messageToSend && !file) return;

    const newMsg = { type: "user", text: messageToSend, file };
    setMessages((prev) => [...prev, newMsg]);
    setText("");
    setFile(null);
    setLoading(true);

    try {
      let payload = { message: messageToSend, context };
      if (file) {
        const b64 = await toBase64(file);
        payload.imageBase64 = b64;
      }

      const res = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      let reply = data.reply || "No response from agent";
      reply = reply.replace(/\n/g, "\n").trim();
      reply = await translateText(reply);

      const botMsg = { type: "bot", text: reply };
      setMessages((prev) => [...prev, botMsg]);

      // 🧠 Maintain conversation history for next request
      setContext((prev) => [
        ...prev,
        { role: "user", parts: [{ text: messageToSend }] },
        { role: "model", parts: [{ text: reply }] },
      ]);

      speakText(reply);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "⚠️ Error: Unable to get response from Gemini agent." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleVoice = () => {
    if (speakEnabled) window.speechSynthesis.cancel();
    setSpeakEnabled(!speakEnabled);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gradient-to-b from-green-50 to-white border rounded-2xl shadow-xl flex flex-col h-[650px]">
      <h2 className="text-2xl font-bold mb-3 text-center text-green-700">
        🌾 Agri-Helper AI Agent
      </h2>

      <div className="flex justify-between items-center mb-3">
        <button
          onClick={() => setTranslateTelugu(!translateTelugu)}
          className={`text-sm px-3 py-1 rounded-full transition ${
            translateTelugu ? "bg-green-600 text-white" : "bg-gray-200"
          }`}
        >
          🌐 {translateTelugu ? "Telugu Mode ON" : "Translate to Telugu"}
        </button>

        <button
          onClick={toggleVoice}
          className={`text-sm px-3 py-1 rounded-full transition ${
            speakEnabled ? "bg-green-600 text-white" : "bg-gray-200"
          }`}
        >
          🔊 {speakEnabled ? "Voice ON" : "Voice OFF"}
        </button>
      </div>

      {listening && (
        <div className="text-center text-red-500 text-sm animate-pulse mb-1">
          🎙 Listening...
        </div>
      )}

      <div className="flex-1 overflow-y-auto mb-4 space-y-3 p-3 bg-gray-50 rounded-lg border">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl max-w-[80%] whitespace-pre-wrap ${
              msg.type === "user"
                ? "bg-green-500 text-white self-end ml-auto"
                : "bg-white border text-gray-800 self-start"
            }`}
          >
            {msg.file && (
              <img
                src={URL.createObjectURL(msg.file)}
                alt="upload"
                className="mb-2 rounded-lg max-w-full"
              />
            )}
            {msg.text.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={handleVoiceInput}
          className={`p-2 rounded-full ${
            listening ? "bg-red-500 text-white" : "bg-gray-200 hover:bg-gray-300"
          }`}
          title="Speak to Gemini"
        >
          🎤
        </button>

        <input
          type="text"
          placeholder="Type your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <label
          htmlFor="file-upload"
          className="cursor-pointer bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-full"
          title="Upload image"
        >
          🖼
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          onClick={() => handleSend()}
          disabled={loading}
          className={`px-4 py-2 rounded-full text-white ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
