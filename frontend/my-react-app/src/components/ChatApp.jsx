import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

const ChatApp = () => {
  const [name, setName] = useState("anonymous");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState(0);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    socket.on("clients-total", (data) => {
      setUsers(data);
    });

  
    socket.on("chat-message", (data) => {
      setMessages((prev) => [...prev, data]);
      console.log("Received from others:", data.message);
    });

    return () => {
      socket.off("connect");
      socket.off("clients-total");
      socket.off("chat-message");
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === "") return;

    const newMessage = {
      name,
      message,
      datetime: new Date().toLocaleTimeString(),
    };

    socket.emit("message", newMessage); // Send to server
    setMessages((prev) => [...prev, newMessage]); // Add to own chat list
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold text-blue-500 mb-6">iChat 💬</h1>

      <div className="w-full max-w-sm bg-white rounded-3xl shadow-lg flex flex-col border border-gray-300 overflow-hidden">
        {/* Name Input */}
        <div className="bg-gray-100 px-4 py-3 border-b border-gray-300">
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full bg-transparent text-gray-700 text-sm focus:outline-none"
            value={name}
            maxLength="20"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.name === name ? "justify-end" : "justify-start"
              } items-end`}
            >
              <div
                className={`${
                  msg.name === name
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                } rounded-2xl px-4 py-2 max-w-[70%] text-sm`}
              >
                {msg.message}
                <div className="text-[10px] mt-1 text-right opacity-70">
                  {msg.name} · {msg.datetime}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message input */}
        <form
          className="flex items-center border-t border-gray-200 bg-white p-2"
          onSubmit={sendMessage}
        >
          <input
            type="text"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 text-sm px-3 py-2 bg-gray-100 rounded-full focus:outline-none"
            placeholder="iMessage..."
          />
          <button
            type="submit"
            className="ml-2 text-blue-500 hover:text-blue-600 transition"
          >
            Send
          </button>
        </form>
      </div>

      <div className="text-xs mt-2 text-gray-600">
        Total clients: {users}
      </div>
    </div>
  );
};

export default ChatApp;
