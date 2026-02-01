import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import Landing from "./routes/Landing";
import Login from "./routes/Login";
import Signup from "./routes/Signup";
import { useDispatch, useSelector } from "react-redux";
import AddIntrest from "./routes/AddIntrest";
import { getLoginDetailThunk } from "./redux/slices/userSlice";
import AddSkill from "./routes/AddSkill";
import ForgotPassword from "./routes/ForgotPassword";
import LoadingScreen from "./components/LoadingScreen";
import UserProfile from "./routes/UserProfile";
import SearchResults from "./pages/SearchResults";
import ProjectDetailPage from './pages/ProjectDetailPage';


function AppRoutes() {
  const { isAuthenticated, status } = useSelector(
    (globalState) => globalState.user
  );
  const dispatch = useDispatch();
  const data = useSelector((state) => state);
  console.log(data);

  useEffect(() => {
    dispatch(getLoginDetailThunk());
  }, []);

  if (status == "loading") {
    return <LoadingScreen />;
  }
  if (isAuthenticated) {
    return (
      <Routes>
        <Route path="*" element={<Home />} />
        <Route path="/addInterests" element={<AddIntrest />} />
        <Route path="/addSkill" element={<AddSkill />} />
        <Route path="/userProfile" element={<UserProfile />} />
        <Route path="/newProject" element={<SearchResults />} />
        <Route path="/project/:projectId" element={<ProjectDetailPage />} />

      </Routes>
    );
  } else {
    return (
      <Routes>
        <Route path="*" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
      </Routes>
    );
  }
}

export default AppRoutes;