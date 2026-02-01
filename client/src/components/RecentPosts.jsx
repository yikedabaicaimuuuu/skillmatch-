import React, { useState } from "react";
import { Avatar, Popover, Button, List, Badge, Tooltip, Modal, Input } from "antd";
import "./RecentPosts.css";
import DefaultAvatar from "../assets/postavatar.jpg";
import DefaultProjectImage from "../assets/postproject.jpg";
import PrivateChat from "./PrivateChat";
import { useDispatch, useSelector } from "react-redux";
import { logoutThunk } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { addPost } from '../redux/slices/userSlice';

const { TextArea } = Input;

const RecentPosts = () => {
  const [chatHistoryVisible, setChatHistoryVisible] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const userSkills = useSelector((state) => state.user.data.userSkills);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutThunk());
    navigate("/login");
  };

  const recentPosts = useSelector((state) => state.user.data.recentPosts);
  console.log(recentPosts);
  // const recentPosts = [
  //   {
  //     id: 1,
  //     author: {
  //       name: "Abby",
  //       avatar: DefaultAvatar,
  //       title: "Abby wants to team up",
  //     },
  //     skills: ["Coding", "Guitar"],
  //     description: "Hi, I'm Abby. I am a professional pianist and a coder...",
  //     image: DefaultProjectImage,
  //     stats: { likes: 11, stars: 11, comments: 11 },
  //   },
  //   // more mock data
  // ];

  const [chatHistoryData, setChatHistoryData] = useState([
    {
      id: 1,
      name: "Emma Watt",
      lastMessage: "Hello, can I join your recent project?",
      avatar: DefaultAvatar,
    },
    {
      id: 2,
      name: "John Doe",
      lastMessage: "Let’s discuss the project details",
      avatar: DefaultAvatar,
    },
    // more mock data
  ]);

  const openChat = (user) => {
    setSelectedUser(user);
    setIsChatOpen(true);

    // Update chat history if not already present
    const existingHistory = chatHistoryData.find(
      (history) => history.name === user.name
    );
    if (!existingHistory) {
      setChatHistoryData([
        ...chatHistoryData,
        {
          id: chatHistoryData.length + 1,
          name: user.name,
          lastMessage: "",
          avatar: user.avatar,
        },
      ]);
    }
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setSelectedUser(null);
  };

  // open Post Modal
  const showCreatePostModal = () => {
    setIsModalVisible(true);
  };

  // close Modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // submit new Post
  const handleCreatePost = () => {
    if (newPostContent.trim()) {
      // add to post list
      const newPost = {
        id: Date.now(),
        author: { name: 'Ella Bennett', avatar: DefaultAvatar, title: 'My New Post' },
        skills: userSkills,
        description: newPostContent,
        image: DefaultProjectImage,
        stats: { likes: 0, stars: 0, comments: 0 },
      };

      dispatch(addPost(newPost));
      setIsModalVisible(false);
      setNewPostContent('');
    }
  };



  return (
    <div className="recent-posts">
      <header>
        {/* creat Post button */}
        <Button type="primary" onClick={showCreatePostModal}>Create New Post</Button>
      </header>

      {/* Logout Button */}
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>

      {/* creat Post Modal */}
      <Modal
        title="Create New Post"
        visible={isModalVisible}
        onOk={handleCreatePost}
        onCancel={handleCancel}
        okText="Post"
        cancelText="Cancel"
      >
        <TextArea
          rows={4}
          placeholder="Write something about your project or skills..."
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
        />
      </Modal>

      {/* Chat History Popover */}
      <Popover
        content={
          <List
            itemLayout="horizontal"
            dataSource={chatHistoryData}
            renderItem={(item) => (
              <List.Item onClick={() => openChat(item)}>
                <List.Item.Meta
                  avatar={<Avatar src={item.avatar} />}
                  title={item.name}
                  description={item.lastMessage || "Start a new conversation"}
                />
                <Badge count={1} style={{ backgroundColor: "#f5222d" }} />
              </List.Item>
            )}
          />
        }
        title="Chat History"
        trigger="click"
        visible={chatHistoryVisible}
        onVisibleChange={(visible) => setChatHistoryVisible(visible)}
      >
        <Button className="fixed-chat-button">
          <i className="fas fa-comments"></i> Chat History
        </Button>
      </Popover>

      {/* Private Chat Popover */}
      <Popover
        content={
          selectedUser && (
            <PrivateChat
              user={selectedUser}
              messages={[
                {
                  text: "Hello, can I join your recent project?",
                  isSender: true,
                  time: "10:18 PM",
                },
                {
                  text: "Hey! I came across your group...",
                  isSender: false,
                  time: "10:20 PM",
                },
                {
                  text: "Hi! Thanks for reaching out...",
                  isSender: false,
                  time: "10:22 PM",
                },
              ]}
              onClose={closeChat}
            />
          )
        }
        title={selectedUser ? `Chat with ${selectedUser.name}` : ""}
        trigger="click"
        visible={isChatOpen}
        onVisibleChange={(visible) => {
          if (!visible) closeChat();
        }}
      >
        {selectedUser && <Button style={{ display: "none" }} />}
      </Popover>

      {recentPosts.map((post) => (
        <div className="post-item" key={post.id}>
          <div className="post-header">
            {/* Author Avatar with Chat Icon */}
            <Avatar
              src={DefaultAvatar}
              alt="Author Avatar"
              className="author-avatar"
            />

            <Tooltip title="Chat with the author">
              <Button
                type="link"
                icon={<i className="fas fa-comments"></i>}
                className="chat-icon-button"
                onClick={() => openChat(post.author)}
              />
            </Tooltip>

            <div className="author-info">
              <h4 className="author-title">{post.title}</h4>
              <div className="skills">
                <span className="skills-label">Skill Bank</span>
                {post.skills.map((skill) => (
                  <span className="skill-tag" key={skill.skillTitle}>
                    {skill.skillTitle}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <p className="post-description">{post.description}</p>
          <img src={post.imageUrl} alt="Post" className="post-image" />
          <div className="post-footer">
            <div className="post-stats">
              <span className="stat">❤️ {post.stats.likes}</span>
              {/* <span className="stat">⭐ {post.stats.stars}</span> */}
              {/* <span className="stat ms-3">💬 {post.stats.comments}</span> */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentPosts;