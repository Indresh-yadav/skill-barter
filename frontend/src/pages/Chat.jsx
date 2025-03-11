import React, { useState, useEffect, useContext } from "react";
import { getChats } from "../api/api";
import { io } from "socket.io-client";
const [chatsToStart, setChatsToStart] = useState([]);


const socket = io("http://localhost:5000"); // Ensure the backend runs on this port


const Chat = () => {
  const [startedChats, setStartedChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    getChats(localStorage.getItem("token"))
      .then((res) => {
        console.log("Chats Response:", res.data);
        
        // Ensure data exists before setting state
        setStartedChats(res.data?.startedChats || []);
        setChatsToStart(res.data?.chatsToStart || []);
      })
      .catch((err) => {
        console.error("Error fetching chats:", err);
        setStartedChats([]); // Prevents crashing
        setChatsToStart([]);
      });
  }, []);
  

  useEffect(() => {
    socket.on("newMessage", (message) => {
      if (message.chatId === selectedChat) {
        setMessages((prev) => [...prev, message]);
      }
    });
    return () => socket.off("newMessage");
  }, [selectedChat]);

  const joinRoom = (chatId) => {
    setSelectedChat(chatId);
    socket.emit("joinRoom", chatId);
    axios.get(`/api/chat/${chatId}`).then((res) => {
      setMessages(res.data.messages);
      setSelectedCourse(res.data.course);
    });
  };

  const sendChatMessage = (text, file) => {
    const formData = new FormData();
    formData.append("text", text);
    if (file) formData.append("file", file);

    axios.post(`/api/chat/${selectedChat}/send`, formData).then((res) => {
      setMessages((prev) => [...prev, res.data]);
      socket.emit("sendMessage", res.data);
    });
  };

  return (
    <div className="p-10 flex">
      <div className="w-1/3">
        {startedChats.map((chat) => (
          <div key={chat._id} onClick={() => joinRoom(chat._id)} className="border p-2 mb-2 cursor-pointer">
            {chat.participants.map((p) => p.name).join(" & ")}
          </div>
        ))}
      </div>
      <div className="w-2/3">
        {selectedCourse && <h2 className="text-lg font-bold">{selectedCourse.title}</h2>}
        {selectedChat && <ChatWindow messages={messages} sendMessage={sendChatMessage} />}
      </div>
    </div>
  );
};

export default Chat;
