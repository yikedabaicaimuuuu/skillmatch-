import React from "react";
import "./AIResults.css"; // Add styles for results screen
import { useNavigate } from "react-router-dom";
import { setSelectedProject } from "../redux/slices/userSlice";
import { useDispatch } from "react-redux";

const AIResults = ({ results }) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();


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

  // Get match score color based on percentage
  const getMatchScoreColor = (score) => {
    if (score >= 70) return '#22c55e'; // green
    if (score >= 40) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  return (
    <div className="ai-results">
      <h3 className="results-title">AI Recommended Projects</h3>
      <p className="results-subtitle">Based on your skills and interests</p>
      <div className="results-list">
        {results.length === 0 ? (
          <div className="no-results">
            <p>No matching projects found. Try adding more skills to your profile!</p>
          </div>
        ) : (
          results.map((result) => (
            <div
              className="result-item"
              key={result.id}
              onClick={() => handleProjectClick(result)}
            >
              {/* Match Score Badge */}
              {result.matchScore !== undefined && (
                <div
                  className="match-score-badge"
                  style={{ backgroundColor: getMatchScoreColor(result.matchScore) }}
                >
                  {result.matchScore}% Match
                </div>
              )}
              <img
                src={result.image || "https://via.placeholder.com/150"}
                alt="Project thumbnail"
                className="thumbnail"
              />
              <div className="result-content">
                <h4
                  className="result-title"
                  title="Click to view project details"
                  onClick={() => handleProjectClick(result)}
                  style={{ cursor: 'pointer' }}
                >
                  {result.title}
                </h4>
                <div className="result-details">
                  <img src={result.users[0]?.avatar} alt="Author Avatar" className="user-avatar" />
                  <p className="result-date">
                    {result.users[0]?.name || 'Unknown'} • {result.date}
                  </p>
                </div>
                {result.description && (
                  <p className="result-description">
                    {result.description.length > 100
                      ? `${result.description.substring(0, 100)}...`
                      : result.description}
                  </p>
                )}
                <p className="required-people">Needs {result.requiredPeople} people to start the project</p>

                {/* Search Match Highlight */}
                {result.matchDetails?.searchRelevance > 0 && (
                  <div className="search-match-info">
                    <span className="search-label">Search match: </span>
                    <span className="search-score">{result.matchDetails.searchRelevance}%</span>
                    {result.matchDetails.searchKeywords && (
                      <span className="search-keywords">
                        ({result.matchDetails.searchKeywords.join(', ')})
                      </span>
                    )}
                  </div>
                )}

                {/* Matching Skills Highlight */}
                {result.matchDetails?.matchingSkills?.length > 0 && (
                  <div className="matching-skills">
                    <span className="matching-label">Your matching skills: </span>
                    {result.matchDetails.matchingSkills.map((skill) => (
                      <span className="matching-skill-tag" key={skill}>
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

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
        )}
      </div>
    </div>
  );
};

export default AIResults;
