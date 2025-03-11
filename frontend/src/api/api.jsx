import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

// Auth APIs
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);

// Skill APIs
export const fetchUserSkills = (userId) => API.get(`/skills/user/${userId}`);
export const fetchMatchedSkills = (userId, skill) => API.get(`/skills/match/${userId}?skill=${skill}`);
export const addNewSkill = (skillData, token) => API.post("/skills", skillData, { headers: { Authorization: `Bearer ${token}` } });
export const deleteSkillFromDatabase = (skillId, token) => API.delete(`/skills/${skillId}`, { headers: { Authorization: `Bearer ${token}` } });
export const getSkillByName = (skillName) => API.get(`/skills/name/${skillName}`);

// Booking APIs
export const createBooking = (data, token) => API.post("/bookings/create", data, { headers: { Authorization: `Bearer ${token}` } });
export const fetchBookings = (token) => API.get("/bookings", { headers: { Authorization: `Bearer ${token}` } });
export const checkExisting = (data) => API.post("/bookings/check-existing", data);
export const updateBookingStatus = (bookingId, status, token) => API.put(`/bookings/${bookingId}`, { status }, { headers: { Authorization: `Bearer ${token}` } });

// Chat APIs
export const startChat = (userId, token) => API.post("/chat/start", { userId }, { headers: { Authorization: `Bearer ${token}` }});
export const sendMessage = (chatId, text, token) => API.post(`/chat/${chatId}`, { text }, { headers: { Authorization: `Bearer ${token}` }});
export const getMessages = (chatId, token) => API.get(`/chat/${chatId}`, { headers: { Authorization: `Bearer ${token}` }});
export const getChats = (token) => API.get("/chat", { headers: { Authorization: `Bearer ${token}` }});

export default API;
