import { useState, useEffect, useContext } from "react";
import { fetchBookings, updateBookingStatus } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { io } from "socket.io-client";

const Bookings = () => {
  const [sentBookings, setSentBookings] = useState([]);
  const [pendingBookings, setPendingBookings] = useState([]);
  const { token, user } = useContext(AuthContext);
  const userId = user?._id;

  // Initialize socket
  useEffect(() => {
    const socket = io("http://localhost:5000");
    socket.emit("joinRoom", userId);

    socket.on("bookingStatusUpdate", ({ bookingId, status }) => {
      alert(`Your booking request was ${status}`);
    });

    return () => socket.disconnect();
  }, [userId]);

  useEffect(() => {
    const getBookings = async () => {
      try {
        const res = await fetchBookings(token);
        const allBookings = Array.isArray(res.data) ? res.data : [];

        const userSentBookings = allBookings.filter(
          (booking) => booking.requester._id === userId
        );

        const userPendingBookings = allBookings.filter(
          (booking) =>
            booking.receiver._id === userId && booking.status === "Pending"
        );

        setSentBookings(userSentBookings);
        setPendingBookings(userPendingBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setSentBookings([]);
        setPendingBookings([]);
      }
    };

    getBookings();
  }, [token, userId]);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus, token);
      setPendingBookings((prev) =>
        prev.filter((booking) => booking._id !== bookingId)
      );
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-4">Your Bookings</h2>

      <h3 className="text-xl font-semibold">Requests You Sent</h3>
      <ul>
        {sentBookings.length > 0 ? (
          sentBookings.map((booking) => (
            <li key={booking._id} className="p-4 my-4 border rounded shadow-md">
              <p className="font-bold">
                Skill Requested: {booking.skill?.skillName}
              </p>
              <p>Requested Experience Level: {booking.skill?.experienceLevel}</p>
              <p className="font-bold">
                Skill Offered: {booking.offeredSkill?.skillName}
              </p>
              <p>With: {booking.receiver.name}</p>
              <p>
                Status:{" "}
                <span
                  className={`font-semibold ${
                    booking.status === "Pending"
                      ? "text-yellow-500"
                      : booking.status === "Confirmed"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {booking.status}
                </span>
              </p>
            </li>
          ))
        ) : (
          <li>No sent bookings found.</li>
        )}
      </ul>

      <h3 className="text-xl font-semibold mt-6">Acceptance Pending</h3>
      <ul>
        {pendingBookings.length > 0 ? (
          pendingBookings.map((booking) => (
            <li key={booking._id} className="p-4 my-4 border rounded shadow-md">
              <p className="font-bold">
                Skill Requested: {booking.skill?.skillName}
              </p>
              <p>Requested by: {booking.requester.name}</p>
              <p className="font-bold">
                Skill Offered: {booking.offeredSkill?.skillName}
              </p>
              <p>
                Status:{" "}
                <span className="text-yellow-500 font-semibold">
                  Pending Acceptance
                </span>
              </p>
              <button
                onClick={() =>
                  handleStatusChange(booking._id, "Confirmed")
                }
                className="p-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
              >
                Accept
              </button>
              <button
                onClick={() =>
                  handleStatusChange(booking._id, "Canceled")
                }
                className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Decline
              </button>
            </li>
          ))
        ) : (
          <li>No pending bookings for acceptance.</li>
        )}
      </ul>
    </div>
  );
};

export default Bookings;
