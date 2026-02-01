import React from "react";
import { useSelector, useDispatch } from "react-redux";
import DefaultAvatar from "../assets/default-avatar.jpg"; // Path to default avatar image
import DefaultProjectImage from "../assets/default-project.jpg"; // Path to default project image
import { useNavigate } from "react-router-dom";
import { logoutThunk } from "../redux/slices/userSlice";
import { errorToast, successToast } from "../helper/toast";
import fetchData from "../helper/fetchData";
// import { ReactComponent as DeleteIcon } from '../assets/delete-icon.svg'; // Import your delete icon
import { getLoginDetailThunk } from "../redux/slices/userSlice";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInterests, skills, userSkills, fullName, id } = useSelector(
    (state) => state.user.data
  );
  const username = useSelector((state) => state.user.username) || "Ella Bennett";


  const handleLogout = () => {
    dispatch(logoutThunk());
  };

  return (
    <div className="user-profile h-[100vh] w-full bg-white px-[20px] md:px-[50px] lg:px-[100px]">
      <div className="text-center mt-8">
        <img
          src={DefaultAvatar}
          alt="User Avatar"
          className="w-24 h-24 rounded-full mx-auto"
        />
        <p className="text-2xl font-bold mt-4">{username}</p>

        <p className="text-gray-500">Toronto, CA</p>

        <button
          onClick={() => navigate("/newProject")}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-full"
        >
          Open a New Project
        </button>

        <button
          onClick={handleLogout}
          className="absolute top-8 right-8 bg-red-500 text-white px-4 py-2 rounded-full"
        >
          Logout
        </button>
      </div>

      {/* Stats Section */}
      <div className="bg-blue-100 rounded-xl flex justify-around items-center mt-8 p-4">
        <div className="text-center">
          <p className="text-xl font-bold">12</p>
          <p className="text-gray-500">Project</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold">233</p>
          <p className="text-gray-500">Like</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold">44</p>
          <p className="text-gray-500">Saved</p>
        </div>
      </div>

      {/* Interests and Skills */}
      <div className="mt-8">
        <p className="font-semibold text-xl">Areas of Interest</p>
        <div className="flex gap-2 mt-2 flex-wrap">
          {userInterests && userInterests.length > 0 ? (
            userInterests.map((interest, index) => (
              <span
                key={index}
                className="relative px-4 py-2 bg-gray-200 rounded-full flex items-center"
              >
                {interest.interestTitle || "Unknown"}
              </span>
            ))
          ) : (
            <p className="text-gray-500">No interests added yet.</p>
          )}
          <button
            onClick={() => navigate("/addInterests")}
            className="px-2 py-1 bg-gray-300 rounded-full"
          >
            +
          </button>
        </div>
        <p className="font-semibold text-xl mt-6">Skill Bank</p>
        <div className="flex gap-2 mt-2 flex-wrap">
          {userSkills && userSkills.length > 0 ? (
            userSkills.map((skill, index) => (
              <span key={index} className="px-4 py-2 bg-gray-200 rounded-full">
                {skill.skillTitle}
              </span>
            ))
          ) : (
            <p className="text-gray-500">No skills added yet.</p>
          )}
          <button
            onClick={() => navigate("/addskill")}
            className="px-2 py-1 bg-gray-300 rounded-full"
          >
            +
          </button>
        </div>
      </div>

      {/* Project Completed Section */}
      <div className="mt-8">
        <p className="font-semibold text-xl">Project Completed</p>
        <div className="flex items-center gap-4 mt-4">
          <img
            src={DefaultProjectImage}
            alt="Default Project"
            className="w-20 h-20 rounded-lg"
          />
          <div>
            <p className="font-semibold">
              Marketing and brand building for beverage company
            </p>
            <p className="text-gray-500">Jan 14th, 2024</p>
            <div className="flex gap-2 mt-2">
              <span className="px-4 py-1 bg-gray-200 rounded-full">
                Marketing
              </span>
              <span className="px-4 py-1 bg-gray-200 rounded-full">Design</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;