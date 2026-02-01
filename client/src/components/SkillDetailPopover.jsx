import React, { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

const SkillDetailPopover = ({ skill, onClose, onAdd }) => {
  const [description, setDescription] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [pictures, setPictures] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await onAdd({ description, portfolio, pictures });
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[90%] md:w-[50%]">
        <h2 className="text-xl font-bold mb-4">Add details for {skill.label}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-semibold">Description</label>
            <textarea
              className="w-full p-2 border rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="I'm a native speaker..."
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold">Portfolio</label>
            <input
              type="url"
              className="w-full p-2 border rounded"
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
              placeholder="Link"
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold">Pictures</label>
            <input
              type="file"
              className="w-full p-2"
              onChange={(e) => setPictures(e.target.files[0])}
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  Loading
                  <CircularProgress
                    style={{ height: "20px", width: "20px", color: "#fff" }}
                    className="ml-2"
                  />
                </div>
              ) : (
                "Add My Skill"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default React.memo(SkillDetailPopover);
