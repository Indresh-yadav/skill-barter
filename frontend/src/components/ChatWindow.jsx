import React, { useState, useEffect, useRef } from "react";

const ChatWindow = ({ messages, sendMessage, sendFile }) => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setCurrentUserId(storedUserId);
  }, []);

  const handleSend = () => {
    if (text.trim() || file) {
      sendMessage(text, file);
      setText("");
      setFile(null);
    }
  };

  return (
    <div className="border p-4 rounded bg-gray-100 h-[80vh] flex flex-col justify-between">
      <div className="overflow-y-auto mb-4">
        {messages.map((msg, index) => {
          const isSender = msg.sender?._id === currentUserId;
          return (
            <div key={index} className={`flex ${isSender ? "justify-end" : "justify-start"} mb-2`}>
              <div className={`max-w-[60%] p-2 rounded-lg text-white ${isSender ? "bg-blue-500" : "bg-green-500"}`}>
                <div className="text-xs text-gray-200">{isSender ? "You" : msg.sender?.name || "Unknown"}</div>
                {msg.text && <div>{msg.text}</div>}
                {msg.fileUrl && (
                  <div>
                    {msg.fileUrl.match(/\.(jpeg|jpg|png|gif)$/) ? (
                      <img src={msg.fileUrl} alt="Attachment" className="w-40 h-40 object-cover mt-1" />
                    ) : msg.fileUrl.match(/\.(mp4|webm|ogg)$/) ? (
                      <video controls src={msg.fileUrl} className="w-40 h-40 mt-1"></video>
                    ) : (
                      <a href={msg.fileUrl} className="text-yellow-300 underline" target="_blank" rel="noopener noreferrer">
                        View File
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center">
        <input
          type="text"
          className="flex-1 border rounded p-2"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button className="ml-2 bg-gray-300 px-2 py-1 rounded" onClick={() => fileInputRef.current.click()}>
          📎
        </button>
        <button className="ml-2 bg-blue-500 text-white px-3 py-1 rounded" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
