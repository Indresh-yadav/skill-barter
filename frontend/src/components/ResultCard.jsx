import { useState, useEffect, useContext } from "react";
import { createBooking, fetchUserSkills, getSkillByName, checkExisting } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ResultCard = ({ skill }) => {
  const { token, user } = useContext(AuthContext);
  const [showApplyConfirmation, setShowApplyConfirmation] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [userSkills, setUserSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch user skills once component mounts or when user changes
  useEffect(() => {
    const fetchSkills = async () => {
      if (user?._id) {
        try {
          const res = await fetchUserSkills(user._id);
          setUserSkills(res.data);
        } catch (error) {
          console.error("Error fetching user skills:", error);
        }
      }
    };

    fetchSkills();
  }, [user]);

  const handleApply = async () => {
    try {
      setLoading(true);

      // Loop through all user skills to check compatibility
      const isMatch = userSkills.some(userSkill => {
        const requesterOfferedSkillName = userSkill.skillName?.toLowerCase().trim() || "";
        const requesterWantedSkill = userSkill.barterOption?.toLowerCase().trim() || "";
  
        const receiverOfferedSkill = skill.skillName?.toLowerCase().trim() || "";
        const receiverWantedSkill = skill.barterOption?.toLowerCase().trim() || "";
  
        const isRequesterOfferAccepted = requesterOfferedSkillName === receiverWantedSkill;
        const isRequesterWantAccepted = requesterWantedSkill === receiverOfferedSkill;
  
        return isRequesterOfferAccepted && isRequesterWantAccepted;
      });
  
      if (!isMatch) {
        setSuccessMessage("Skillset not compatible. Request cannot be sent.");
        setShowApplyConfirmation(false);
        setTimeout(() => setSuccessMessage(""), 3000);
        setLoading(false);
        return;
      }
  
      // Check if a similar booking request already exists
      const res = await getSkillByName(skill.skillName);

      const offeredSkill = userSkills.find(userSkill => 
        userSkill.skillName.toLowerCase().trim() === skill.barterOption.toLowerCase().trim()
      );

      if (!offeredSkill) {
        setSuccessMessage("You don't have the required skill to offer.");
        setShowApplyConfirmation(false);
        setTimeout(() => setSuccessMessage(""), 3000);
        setLoading(false);
        return;
      }

      const offeredSkillObjectId = offeredSkill._id;
  
      const bookingData = {
        receiver: skill.userId._id,
        skill: skill._id,
        offeredSkill: offeredSkillObjectId,
        date: new Date(),
      };

      const existingRequest = await checkExisting({
        requester: user._id,
        receiver: skill.userId._id,
        skill: skill._id,
        offeredSkill: offeredSkillObjectId,
        date: new Date()
      });
      
      if (existingRequest.data.exists) {
        setSuccessMessage("Request already sent for this skill.");
        setShowApplyConfirmation(false);
        setTimeout(() => setSuccessMessage(""), 2000);
        setLoading(false);
        return;
      }
  
      await createBooking(bookingData, token);
      setSuccessMessage("Application submitted successfully!");
      setShowApplyConfirmation(false);
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/bookings");
      }, 1000);
    } catch (error) {
      console.error("Error applying for skill:", error);
      setSuccessMessage("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const isSkillOwner = user?._id === skill.userId?._id;

  return (
    <div className="border-2 border-transparent p-4 rounded shadow-md bg-white transition-transform transform hover:scale-105 hover:border-blue-500">
      <h3 className="text-xl font-bold">{skill.skillName}</h3>
      <p>Category: <b>{skill.category}</b></p>
      <p>Experience Level: <b>{skill.experienceLevel}</b></p>
      <p>Location: <b>{skill.location}</b></p>
      <p>Barter Options: <b>{skill.barterOption}</b></p>
      <p>Name: <b>{skill.userId?.name || "Unknown"}</b></p>

      {successMessage && (
        <div className={`fixed top-4 right-4 ${successMessage.includes("not match") ? "bg-red-500" : "bg-green-500"} text-white p-3 rounded shadow-lg transition-opacity duration-500`}>
          {successMessage}
        </div>
      )}

      {!isSkillOwner && (
        <button
          className="mt-4 p-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={() => setShowApplyConfirmation(true)}
          disabled={loading}
        >
          {loading ? "Applying..." : "Apply"}
        </button>
      )}

      {showApplyConfirmation && (
        <div className="fixed inset-0 bg-gray-300 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-bold">Apply for this skill?</h2>
            <div className="flex justify-between mt-4">
              <button
                onClick={handleApply}
                className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
                disabled={loading}
              >
                Yes, Apply
              </button>
              <button
                onClick={() => setShowApplyConfirmation(false)}
                className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                disabled={loading}
              >
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultCard;
