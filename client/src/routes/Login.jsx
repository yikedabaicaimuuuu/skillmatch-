import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import WLIMG from "../assets/WL.png";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import CircularProgress from "@mui/material/CircularProgress";
import { getLoginDetailThunk, loginThunk } from "../redux/slices/userSlice";
import { errorToast, successToast } from "../helper/toast";

const Login = () => {
  const loadingBtn = useRef(null);
  const loginBtn = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle user login
  const loginHandler = async (e) => {
    e.preventDefault();
    loadingBtn.current.style.display = "block";
    loginBtn.current.style.display = "none";

    const data = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    console.log(data);

    const result = await dispatch(loginThunk(data.email, data.password));
    if (result.status === "success") {
      successToast(result.message);
      navigate("/UserProfile");
    } else {
      errorToast(result.message);
    }

    loadingBtn.current.style.display = "none";
    loginBtn.current.style.display = "block";
  };

  return (
    <div className="h-[100vh] w-[100vw] bg-white px-[30px] md:px-[50px] lg:px-[100px]">
      <div className="w-full h-full md:flex md:items-center">
        <div className="md:flex w-full">
          {/* Left Image */}
          <div className="flex justify-center w-full md:w-7/12">
            <img
              src={WLIMG}
              alt="Login Illustration"
              className="mt-2 md:h-[400px] md:w-[400px] lg:h-[500px] lg:w-[500px] object-contain"
            />
          </div>

          {/* Right Form Section */}
          <div className="md:ps-10 md:mt-0 mt-4 lg:w-5/12 md:w-6/12 md:flex md:justify-center md:flex-col">
            <form onSubmit={loginHandler}>
              {/* Email Input */}
              <div className="bg-[#F3F4F6] border-2 border-transparent p-2 rounded-xl flex items-center mt-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  className="bg-transparent text-md outline-none w-full py-2 px-2"
                  required
                />
                <MailOutlineIcon className="text-gray-400" />
              </div>

              {/* Password Input */}
              <div className="bg-[#F3F4F6] border-2 border-transparent p-2 rounded-xl flex items-center mt-4">
                <input
                  type="password"
                  name="password"
                  placeholder="Enter Password"
                  className="bg-transparent text-md outline-none w-full py-2 px-2"
                  required
                />
                <LockOpenIcon className="text-gray-400" />
              </div>

              {/* Login Button */}
              <div className="mt-4 flex justify-center">
                <button
                  ref={loginBtn}
                  className="w-full py-3 text-xl text-white bg-blue-400 hover:bg-blue-500 rounded-full flex items-center justify-center"
                >
                  Sign in <ArrowRightIcon className="ml-2" />
                </button>

                {/* Loading Button */}
                <button
                  ref={loadingBtn}
                  style={{ display: "none" }}
                  disabled
                  className="w-full py-3 text-xl text-white bg-blue-400 rounded-full flex items-center justify-center"
                >
                  Loading
                  <CircularProgress
                    style={{ height: "20px", width: "20px", color: "#ffff" }}
                    className="ml-2"
                  />
                </button>
              </div>
            </form>

            {/* Bottom Links */}
            <div className="text-center mt-5">
              <p className="text-lg font-semibold">
                Don’t have an account?{" "}
                <Link
                  className="font-bold underline text-blue-500"
                  to="/signup"
                >
                  Sign up
                </Link>
              </p>
            </div>

            {/* Social Media Login Options */}
            <div className="flex justify-around mt-4">
              <button type="button" className="cursor-pointer">
                <FacebookIcon sx={{ fontSize: "40px", color: "#1877F2" }} />
              </button>
              <button type="button" className="cursor-pointer">
                <GoogleIcon sx={{ fontSize: "40px", color: "#DB4437" }} />
              </button>
              <button type="button" className="cursor-pointer">
                <LinkedInIcon sx={{ fontSize: "40px", color: "#0A66C2" }} />
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className="text-center mt-5">
              <Link
                className="text-sm text-gray-500 hover:underline"
                to="/forgotPassword"
              >
                Forgot Password?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Login);
