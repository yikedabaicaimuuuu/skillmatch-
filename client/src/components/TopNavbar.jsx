import { Link } from "react-router-dom";
import React from "react";

const TopNavbar = () => {
  return (
    <div className="w-full bg-[#1A1A1A] text-white py-4 px-8 flex items-center justify-between">
      <div className="flex items-center space-x-8">
        <Link to="/" className="text-2xl font-bold">
          SkillMatch
        </Link>

        <nav className="flex space-x-6">
          <Link to="/" className="hover:text-blue-400 transition-colors">
            Home
          </Link>
          <Link
            to="/addintrest"
            className="hover:text-blue-400 transition-colors"
          >
            Add Interest
          </Link>
          <Link
            to="/addskill"
            className="hover:text-blue-400 transition-colors"
          >
            Add Skill
          </Link>
          <Link to="/profile" className="hover:text-blue-400 transition-colors">
            Profile
          </Link>
        </nav>
      </div>

      <div>
        <Link to="/login">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full transition-all duration-300">
            Log In
          </button>
        </Link>
      </div>
    </div>
  );
};

export default TopNavbar;
