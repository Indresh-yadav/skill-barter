import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import SkillCard from "../components/SkillCard";
import { fetchUserSkills, addNewSkill } from "../api/api";
import { FaPlus } from "react-icons/fa";

const Dashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [skills, setSkills] = useState([]);
  const [showForm, setShowForm] = useState(false); 
  const [newSkill, setNewSkill] = useState({
    skillName: "",
    category: "",
    experienceLevel: "",
    barterOption: "",
    location: "",
  });

  // Fetch skills when the component mounts or when user changes
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        if (user?._id) {
          const res = await fetchUserSkills(user._id);
          setSkills(res.data);
        }
      } catch (err) {
        console.error("Error fetching user skills:", err);
      }
    };
    fetchSkills();
  }, [user]);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.skillName || !newSkill.category) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      await addNewSkill(newSkill, token); 
      setNewSkill({ skillName: "", category: "", experienceLevel: "", barterOption: "", location: "" });
      setShowForm(false);
      // Re-fetch the skills list
      const res = await fetchUserSkills(user._id);
      setSkills(res.data);
    } catch (error) {
      console.error("Error adding skill:", error);
    }
  };

  const handleDeleteSkill = (deletedSkillId) => {
    setSkills(skills.filter(skill => skill._id !== deletedSkillId));
  };

  // Check if the user is loaded before rendering skills
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="text-center p-10">
      <h1 className="text-4xl font-bold">Welcome, {user?.name}!</h1>
      <p className="mt-4 text-lg">Your Listed Skills:</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {skills.length > 0 ? (
          skills.map((skill) => 
            skill._id ? (
              <SkillCard key={skill._id} skill={skill} onDelete={handleDeleteSkill} />
            ) : null
          )
        ) : (
          <p>No skills listed yet.</p>
        )}

        {/* Add New Skill Card */}
        <div
          className="cursor-pointer flex flex-col items-center justify-center bg-gray-100 p-6 rounded-lg shadow-md hover:bg-gray-200 transition duration-300"
          onClick={() => setShowForm(true)}
        >
          <FaPlus className="text-4xl text-blue-500" />
          <p className="mt-2 text-lg text-gray-700">Add New Skill</p>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-300 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
            <h2 className="text-2xl font-bold">Add a New Skill</h2>
            <form onSubmit={handleAddSkill} className="mt-4 flex flex-col space-y-4">
              <input
                type="text"
                placeholder="Skill Name"
                className="p-2 border rounded"
                value={newSkill.skillName}
                onChange={(e) => setNewSkill({ ...newSkill, skillName: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Category"
                className="p-2 border rounded"
                value={newSkill.category}
                onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Experience Level"
                className="p-2 border rounded"
                value={newSkill.experienceLevel}
                onChange={(e) => setNewSkill({ ...newSkill, experienceLevel: e.target.value })}
              />
              <input
                type="text"
                placeholder="Barter Options"
                className="p-2 border rounded"
                value={newSkill.barterOption}
                onChange={(e) => setNewSkill({ ...newSkill, barterOption: e.target.value })}
              />
              <input
                type="text"
                placeholder="Location"
                className="p-2 border rounded"
                value={newSkill.location}
                onChange={(e) => setNewSkill({ ...newSkill, location: e.target.value })}
              />
              <div className="flex justify-between">
                <button type="submit" className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Add Skill
                </button>
                <button
                  type="button"
                  className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
