import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

import IntrestCard from "../components/IntrestCard";
import SkillDetailPopover from "../components/SkillDetailPopover";
import IlImg from "../assets/IL.png";

import { errorToast, successToast } from "../helper/toast";
import fetchData from "../helper/fetchData";
import { addSkill, removeSkill } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

const AddSkill = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Selectors for skills list and selected skills from the Redux store
  const skillList = useSelector((state) => state.user.data.allSkills);
  const selectedSkills = useSelector((state) => state.user.data.userSkills);
  const fullName = useSelector((state) => state.user.data.fullName);
  const [selectedSkill, setSelectedSkill] = useState(null);

  // Handle opening of popover and toggling skills
  const openPopover = async (skill) => {
    const isSkillSelected = selectedSkills.some(
      (elem) => elem.skillTitle === skill.skillTitle
    );

    if (isSkillSelected) {
      await handleRemoveSkill(skill.id);
      dispatch(removeSkill(skill));
    } else {
      setSelectedSkill(skill);
    }
  };

  const closePopover = () => setSelectedSkill(null);

  // Handle skill addition
  const handleAddSkill = async () => {
    const result = await fetchData(
      `${import.meta.env.VITE_API_URL}/user/addskill`,
      {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(selectedSkill),
        headers: { "content-type": "application/json" },
      }
    );

    if (result.status === "success") {
      dispatch(
        addSkill({ ...result.data, skillTitle: selectedSkill.skillTitle })
      );
      closePopover();
      successToast(result.message);
    } else {
      errorToast(result.message);
    }
  };

  // Handle skill removal
  const handleRemoveSkill = async (id) => {
    const result = await fetchData(
      `${import.meta.env.VITE_API_URL}/user/removeSkill`,
      {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ id }),
        headers: { "content-type": "application/json" },
      }
    );

    if (result.status === "success") {
      successToast(result.message);
    } else {
      errorToast(result.message);
    }
  };

  const handleNextBtn = async () => {
    if (selectedSkills.length <= 0) {
      return errorToast("please select at least one skill");
    }
    navigate("/userProfile");
  };

  return (
    <div className="h-[100vh] w-full bg-white px-[20px] md:px-[50px] lg:px-[100px]">
      <div className="mt-8">
        <p className="text-2xl font-bold">Hello {fullName}</p>
      </div>

      <div className="mt-5">
        <p className="font-semibold text-xl">Choose skills you know</p>
        <div className="mt-5 flex-wrap flex gap-x-8 gap-y-4">
          {skillList?.map((skill) => (
            <IntrestCard
              key={skill.id}
              data={skill}
              isActive={selectedSkills.some(
                (s) => s.skillTitle === skill.skillTitle
              )}
              setActive={() => openPopover(skill)}
            />
          ))}
        </div>

        <div className="mt-10">
          <img
            src={IlImg}
            alt="Add Skill Illustration"
            className="mt-2 md:h-[150px] md:w-[150px] object-contain"
          />
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => handleNextBtn(selectedSkills)}
            className="py-3 text-xl text-white bg-blue-400 hover:bg-blue-500 w-full sm:w-min sm:px-20 md:px-32 rounded-[15px] flex items-center justify-center"
          >
            Next <ArrowRightIcon className="ml-2" />
          </button>
        </div>
      </div>

      {/* Render popover if a skill is selected */}
      {selectedSkill && (
        <SkillDetailPopover
          skill={selectedSkill}
          onClose={closePopover}
          onAdd={handleAddSkill}
        />
      )}
    </div>
  );
};

export default React.memo(AddSkill);
