import React, { useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "./SearchResults.css";
import { FiSearch, FiFilter } from "react-icons/fi";
import DefaultAvatar from "../assets/default-avatar.jpg";
import DefaultProjectImage from "../assets/default-project.jpg";
import AuthorAvatar from "../assets/author-avatar.jpg";
import RecentPosts from "../components/RecentPosts";
import { logoutThunk } from "../redux/slices/userSlice";
import AILoading from "../components/AILoading"; // Loading screen component
import AIResults from "../components/AIResults";
import { setSelectedProject } from "../redux/slices/userSlice";
import MatchingService from "../services/matching.service";



const SearchResults = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [filterCriteria, setFilterCriteria] = useState({
    types: [],
    options: "",
  });
  const [loadingAI, setLoadingAI] = useState(false); // Manage loading state for AI
  const [aiResults, setAIResults] = useState(null); // Store AI matching results
  // 从 Redux 中获取用户名
  const username = useSelector((state) => state.user.username);

  const handleLogout = () => {
    dispatch(logoutThunk());
    navigate("/login"); // Redirect to login page after logout
  };

  // AI Matching function - calls the real AI matching API
  const handleAIAssistance = async () => {
    setLoadingAI(true);
    setAIResults(null);

    try {
      const response = await MatchingService.getMatchedProjects({ limit: 10, minScore: 0.05 });

      if (response.status === "success" && response.data) {
        // Transform API response to match the expected format
        const transformedResults = response.data.map(project => ({
          id: project.id,
          title: project.title,
          date: new Date(project.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }),
          tags: Array.isArray(project.skills) ? project.skills : [],
          users: [{
            name: project.authorName || 'Unknown',
            avatar: AuthorAvatar,
            skills: project.matchDetails?.matchingSkills || []
          }],
          image: project.imageUrl || DefaultProjectImage,
          requiredPeople: project.members?.length > 0 ? 5 - project.members.length : 3,
          description: project.description,
          matchScore: project.matchScore,
          matchDetails: project.matchDetails
        }));

        setAIResults(transformedResults);
      } else {
        console.error("AI matching returned no data");
        setAIResults([]);
      }
    } catch (error) {
      console.error("AI matching error:", error);
      // Fallback to showing recent posts on error
      setAIResults([]);
    } finally {
      setLoadingAI(false);
    }
  };

  // mock data
  const allResults = [
    {
      id: 1,
      title: "Marketing and brand building for beverage company",
      date: "Jan 14th, 2024",
      tags: ["Coding", "Design"],
      users: [{ name: "Emma Watt", avatar: AuthorAvatar }],
      image: DefaultProjectImage,
      requiredPeople: 2,
    },
    // more data...
  ];

  // search
  const handleSearch = () => {
    if (searchQuery.trim()) {
      const results = allResults.filter((result) =>
        result.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredResults(results);
      setSearchPerformed(true);
      setAIResults(null);
    }
  };

  // apply search
  const applyFilter = () => {
    const results = allResults.filter((result) => {
      const matchesType = filterCriteria.types.length
        ? filterCriteria.types.some((type) => result.tags.includes(type))
        : true;
      const matchesOption = filterCriteria.options
        ? filterCriteria.options === "Relevant to my skills" &&
          result.tags.includes("Coding")
        : true;
      return matchesType && matchesOption;
    });
    setFilteredResults(results);
    setSearchPerformed(true);
    setFilterModalOpen(false);
  };

  // convert type
  const toggleType = (type) => {
    setFilterCriteria((prev) => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type],
    }));
  };

  // select option
  const selectOption = (option) => {
    setFilterCriteria((prev) => ({
      ...prev,
      options: option,
    }));
  };

  // 点击项目时跳转到项目详情页面
  const handleProjectClick = (project) => {
    if (project && project.id && project.title) {
      console.log("Project data:", project); // 确认 project 是完整的对象
      dispatch(setSelectedProject(project)); // 设置选中的项目
      navigate(`/project/${project.id}`); // 使用 project.id 进行导航
    } else {
      console.error("Invalid project data:", project);
    }
  };

  const handleNavigateToProfile = () => {
    navigate("/userprofile");
  };



  return (
    <div className="search-results">
      <header className="search-header">
        <div className="header-content">
          <img
            src={DefaultAvatar}
            alt="User Avatar"
            className="user-avatar-header"
          />
          <h2 className="header-title">
            Hello{" "}
            <span
              onClick={handleNavigateToProfile}
              style={{ cursor: "pointer", textDecoration: "underline" }}
              title="Go to profile"
            >
              {username}
            </span>{" "}
            👋
          </h2>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
        <div className="search-bar">
          <button className="ai-assistance" onClick={handleAIAssistance}>
            AI Assistance
          </button>
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <FiSearch
              className="search-icon"
              size={20}
              onClick={handleSearch}
            />
          </div>
          <FiFilter
            className="filter-icon"
            size={20}
            onClick={() => setFilterModalOpen(true)}
          />
        </div>
      </header>

      {/* Conditional rendering */}
      {loadingAI ? (
        <AILoading /> // Show loading screen if AI Assistance is running
      ) : aiResults ? (
        <AIResults results={aiResults} /> // Display AI-recommended projects if AI results are ready
      ) : searchPerformed ? (
        <div>
          <h3 className="results-title">Search results</h3>
          <div className="results-list">
            {filteredResults.length > 0 ? (
              filteredResults.map((result) => (
                <div
                  className="result-item"
                  key={result.id}
                  onClick={() => handleProjectClick(result)}
                >
                  <img
                    src={result.image || "https://via.placeholder.com/150"}
                    alt="Project thumbnail"
                    className="thumbnail"
                  />
                  <div className="result-content">
                    <h4
                      className="result-title"
                      title="Click into group"
                      onClick={() => handleProjectClick(result)}
                      style={{ cursor: 'pointer' }}
                    >
                      {result.title}
                    </h4>
                    <div className="result-details">
                      <img
                        src={result.users[0].avatar}
                        alt="Author Avatar"
                        className="user-avatar"
                      />
                      <p className="result-date">
                        {result.users[0].name} • {result.date}
                      </p>
                    </div>
                    <p className="required-people">
                      Needs {result.requiredPeople} people to start the project
                    </p>
                    <div className="tags">
                      {result.tags.map((tag) => (
                        <span className="tag" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No results found</p>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-8">
          <p className="font-semibold text-xl">Recent Posts</p>
          <RecentPosts />{" "}
          {/* Display RecentPosts if no search or AI results are displayed */}
        </div>
      )}

      {filterModalOpen && (
        <div className="filter-modal">
          <h4>Types of Projects</h4>
          <div className="project-types">
            {["English", "Coding", "Design", "Japanese"].map((type) => (
              <button
                className={`project-type ${
                  filterCriteria.types.includes(type) ? "selected" : ""
                }`}
                key={type}
                onClick={() => toggleType(type)}
              >
                {type}
              </button>
            ))}
          </div>
          <h4>Filter Options</h4>
          <div className="filter-options">
            {[
              "Groups of more than 2 people",
              "Relevant to my skills",
              "Relevant to my area of interests",
            ].map((option) => (
              <label key={option}>
                <input
                  type="radio"
                  name="filter"
                  checked={filterCriteria.options === option}
                  onChange={() => selectOption(option)}
                />
                {option}
              </label>
            ))}
          </div>
          <div className="distance-filter">
            <label>
              Within{" "}
              <input type="text" placeholder="10" className="distance-input" />{" "}
              miles of
            </label>
            <input
              type="text"
              placeholder="Post Code"
              className="postcode-input"
            />
            <input type="text" placeholder="Canada" className="country-input" />
          </div>
          <div className="filter-buttons">
            <button onClick={applyFilter} className="apply-filter-button">
              Apply Filter
            </button>
            <button
              onClick={() => setFilterModalOpen(false)}
              className="close-modal-button"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
