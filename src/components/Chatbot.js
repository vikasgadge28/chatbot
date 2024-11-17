/** @format */

import React, { useState } from "react";
import axios from 'axios';

const Chatbot = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const generateAnswers = async () => {
    if (!question.trim()) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: question },
    ]);

    const newQus = question;
    setQuestion("");
    setLoading(true);
    setTyping(true);

    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyCNNeMep2KxK2Yz_dZ8WoJYdNPjbzG1RGE`,
        method: "post",
        data: {
          contents: [{ parts: [{ text: newQus }] }],
        },
      });

      const newAnswer = response.data.candidates[0].content.parts[0].text;

      // Simulate typing effect
      setTimeout(() => {
        setTyping(false);
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "assistant", content: newAnswer },
        ]);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error generating answers:", error);
      setTyping(false);
      setLoading(false);
    }
  };

  // Function to format responses with headings and bullet points
  const formatMessage = (message) => {
    return message.split("**").map((part, index) => {
      if (index % 2 === 1) {
        // This is the heading (between the ** markers)
        return <span className="font-semibold text-lg">{part}</span>;
      }

      // Replace `*` with a bullet point and break the message into new lines
      const formattedText = part.split("*").map((text, idx) => {
        if (text.trim()) {
          return (
            <div key={idx} className="flex items-start space-x-2 mt-1">
              {/* Bullet point */}
              <span className="text-blue-500">•</span>
              {/* Text next to the bullet */}
              <span>{text.trim()}</span>
            </div>
          );
        }
        return null;
      });

      return formattedText;
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-lg p-6">
        {/* Header */}
        <header className="flex items-center justify-center border-b-2 border-gray-200 pb-3">
          <h1 className="text-xl font-semibold text-gray-700">
            Chatbot Assistant
          </h1>
        </header>

        {/* Chat Area */}
        <div className="mt-4 h-96 overflow-y-auto space-y-3 px-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}>
              <div
                className={`max-w-xs px-4 py-2 rounded-lg shadow-md text-sm ${
                  msg.role === "user" ?
                    "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
                }`}>
                {formatMessage(msg.content)}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex items-center space-x-2 animate-pulse">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="mt-4 flex items-center space-x-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && question.trim()) generateAnswers();
            }}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition-all"
          />
          <button
            onClick={generateAnswers}
            disabled={!question.trim()}
            className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white transition-all">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-6 h-6">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.752 11.168l-9.192-5.218A1.44 1.44 0 003.04 7.15v9.7c0 .808.774 1.354 1.52 1.15l9.192-5.217a1.44 1.44 0 000-2.484z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
