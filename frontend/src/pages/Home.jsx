import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="text-center p-10">
      <h1 className="text-4xl font-bold">Welcome to Skill Barter Marketplace</h1>
      <p className="mt-4 text-lg">Exchange skills with people around you!</p>
      <div className="mt-6">
        <Link to="/register" className="px-6 py-2 bg-blue-500 text-white rounded">Get Started</Link>
      </div>
    </div>
  );
};

export default Home;
