import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ResultCard from "../components/ResultCard";
import { fetchMatchedSkills } from "../api/api";

const MatchSkills = () => {
  const [matchedSkills, setMatchedSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();

  const userId = searchParams.get("userId");
  const skillSearch = searchParams.get("skill");

  useEffect(() => {
    if (userId && skillSearch) {
      setLoading(true);
      setError(null);

      fetchMatchedSkills(userId, skillSearch)
        .then((res) => {
          setMatchedSkills(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching matched skills:", err);
          setError("Failed to fetch matched skills.");
          setLoading(false);
        });
    }
  }, [userId, skillSearch]);

  return (
    <div className="text-center p-10">
      <h1 className="text-4xl font-bold">Results for "{skillSearch}"</h1>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {loading && <p className="text-blue-500 mt-4">Loading matches...</p>}
      {!loading && !error && matchedSkills.length > 0 ? (
        <div className="grid grid-cols-3 gap-4 mt-6">
          {matchedSkills.map((skill) => (
            <ResultCard key={skill._id} skill={skill} />
          ))}
        </div>
      ) : (
        !loading &&
        !error && <p className="mt-4 text-gray-600">No matches found.</p>
      )}
    </div>
  );
};

export default MatchSkills;
