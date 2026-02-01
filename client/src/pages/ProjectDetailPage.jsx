import React, { useEffect } from 'react';
import { Tabs, Avatar, List, Typography } from 'antd';
import './ProjectDetailPage.css';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearSelectedProject } from '../redux/slices/userSlice';

const { TabPane } = Tabs;
const { Title, Paragraph } = Typography;

const ProjectDetailPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const project = useSelector((state) => state.user.selectedProject);


  useEffect(() => {
    if (!project) {
      navigate('/searchresults');
    }

    return () => {
      dispatch(clearSelectedProject());
    };
  }, [project, navigate, dispatch]);


  if (!project || !Array.isArray(project.users)) {
    return <div>Loading project details...</div>;
  }

  return (
    <div className="project-detail-page wider-layout">
      {/* project title */}
      <div className="project-header">
      <img src={project.image || "default-image.jpg"} alt="Project" className="project-image" />
        <div className="project-info">
          <Title level={2}>Welcome to the group</Title>
          <Title level={4} className="project-title">{project.title}</Title>
          <div className="project-meta">
            <Paragraph>{project.users[0].name} | {project.date}</Paragraph>
            <div className="project-members">
              {project.users.map((user, index) => (
                <Avatar key={index} src={user.avatar} className="member-avatar" />
              ))}
              <span>{project.users.length} members</span>
            </div>
            <div className="project-skills">
              {project.tags.map((tag) => (
                <span key={tag} className="skill-tag">{tag}</span>
              ))}
            </div>
          </div>
          {/* Description */}
          <Title level={5}>Description</Title>
          <Paragraph className="project-description">{project.description || "No description available."}</Paragraph>
        </div>
      </div>

      {/* label navigation */}
      <Tabs defaultActiveKey="1" centered className="tabs">
        <TabPane tab="Community" key="1">
          {/* community */}
          {project.users.map((user, index) => (
            <div key={index} className="community-post">
              <Avatar src={user.avatar} className="community-avatar" />
              <div className="community-content">
                <Title level={5}>{user.name}'s Post</Title>
                <Paragraph>This is a sample post in the community.</Paragraph>
              </div>
            </div>
          ))}
        </TabPane>

        {/* Members lable */}
        <TabPane tab="Members" key="2">
          <Title level={3}>Group Members</Title>
          {/* member and skill */}
          {project.users.map((user, index) => (
            <div key={index} className="member-item">
              <Avatar src={user.avatar} className="member-avatar" />
              <Paragraph>{user.name}</Paragraph>
              {/* skill */}
              <div className="member-skills">
                {user.skills?.map((skill, skillIndex) => (
                  <span key={skillIndex} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </TabPane>

        {/* Resources lable */}
        <TabPane tab="Resources" key="3">
          <div className="resources-tab">
            <Title level={3}>Resources</Title>
            <List
              dataSource={resources}
              renderItem={(resource) => (
                <List.Item>
                  <List.Item.Meta
                    title={<a href={resource.link}>{resource.title}</a>}
                    description={resource.description}
                  />
                </List.Item>
              )}
            />
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

// Mock data
const communityPosts = [
  {
    avatar: 'avatar1.jpg',
    title: 'Emma’s Post',
    content: 'This is a sample post in the community.'
  },
  {
    avatar: 'avatar2.jpg',
    title: 'Lily’s Post',
    content: 'Another post by a different member.'
  }
];

const members = [
  {
    avatar: 'avatar1.jpg',
    name: 'Emma Watt',
    skills: ['Coding', 'Design']
  },
  {
    avatar: 'avatar2.jpg',
    name: 'Lily Liang',
    skills: ['Coding', 'Marketing']
  }
];

const resources = [
  {
    title: 'Food and Beverage Marketing Strategy Case Studies',
    link: 'https://example.com',
    description: 'This collection offers in-depth analyses of successful marketing strategies...'
  },
  {
    title: 'Join the discord group',
    link: 'https://discordbranding.com',
    description: 'Connect with other group members on Discord.'
  }
];

export default ProjectDetailPage;
