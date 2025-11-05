import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import "./Chatbot.css";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Detect current page automatically
  const pageName = window.location.pathname.replace("/", "") || "Home";

  // Initialize greeting message
  useEffect(() => {
    setMessages([
      {
        from: "bot",
        text: `👋 Hi! You’re currently on the **${pageName}** page. How can I help you today?`,
      },
    ]);
  }, [pageName]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Send message to backend
  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { from: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/chat1`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, pageName }),
      });

      const data = await response.json();
      const aiResponse = data?.reply || "🤖 Sorry, no response.";

      setMessages((prev) => [...prev, { from: "bot", text: aiResponse }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "⚠️ Could not connect to Gemini. Try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      {/* Floating Toggle Button */}
      <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
        💬
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-box">
          <div className="chatbot-header">
            🤖 Smart Assistant
            <span className="chatbot-close" onClick={() => setIsOpen(false)}>
              ✖
            </span>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.from}`}>
                {msg.from === "bot" ? (
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                ) : (
                  msg.text
                )}
              </div>
            ))}

            {loading && <div className="chat-message bot">⏳ Thinking...</div>}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Ask me something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend} disabled={loading}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
