import { useState, useContext } from "react";
import { FaTrash } from "react-icons/fa";
import { deleteSkillFromDatabase } from "../api/api";
import { AuthContext } from "../context/AuthContext";

const SkillCard = ({ skill, onDelete }) => {
  const { token, user } = useContext(AuthContext);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteSkillFromDatabase(skill._id, token);
      onDelete(skill._id);
    } catch (error) {
      console.error("Error deleting skill:", error);
    }
  };

  const isSkillOwner = user?._id === skill.userId?._id;

  return (
    <div className="border-2 border-transparent p-4 rounded shadow-md bg-white transition-transform transform hover:scale-105 hover:border-green-500">
      <h3 className="text-xl font-bold">{skill.skillName}</h3>
      <p>Category: <b>{skill.category}</b></p>
      <p>Experience Level: <b>{skill.experienceLevel}</b></p>
      <p>Location: <b>{skill.location}</b></p>
      <p>Barter Options: <b>{skill.barterOption}</b></p>

      {isSkillOwner && (
        <div
          className="cursor-pointer text-red-500 mt-4 flex items-center"
          onClick={() => setShowConfirmation(true)}
        >
          <FaTrash className="mr-2" />
          <span>Delete</span>
        </div>
      )}

      {showConfirmation && (
        <div className="fixed inset-0 bg-gray-300 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-bold">Delete this skill?</h2>
            <div className="flex justify-between mt-4">
              <button
                onClick={handleDelete}
                className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowConfirmation(false)}
                className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
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

export default SkillCard;
