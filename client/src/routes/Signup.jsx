import React, { useRef } from "react";
import WLIMG from "../assets/WL.png";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { Link, useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useDispatch } from "react-redux";
import { signupThunk } from "../redux/slices/userSlice";
import CircularProgress from "@mui/material/CircularProgress";
import { errorToast, successToast } from "../helper/toast";

const Signup = () => {
  const loadingBtn = useRef();
  const signupBtn = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Signup handler function
  const signupHandler = async (e) => {
    e.preventDefault();
    loadingBtn.current.style.display = "block";
    signupBtn.current.style.display = "none";

    const data = {
      fullName: e.target[0].value,
      email: e.target[1].value,
      password: e.target[2].value,
      confirmPassword: e.target[3].value,
    };

    // Password validation
    if (data.confirmPassword !== data.password) {
      alert("Password and confirm password do not match");
    } else {
      const result = await dispatch(
        signupThunk(data.fullName, data.email, data.password)
      );
      if (result.status === "success") {
        successToast(result.message);
        navigate("/addInterests");
      } else {
        errorToast(result.message);
      }
    }

    loadingBtn.current.style.display = "none";
    signupBtn.current.style.display = "block";
  };

  return (
    <div className="h-[100vh] w-[100vw] bg-white px-[30px] md:px-[50px] lg:px-[100px]">
      <div className="w-full h-full md:flex md:items-center">
        <div className="md:flex w-full">
          {/* Left image */}
          <div className="flex justify-center w-full md:w-7/12">
            <img
              src={WLIMG}
              alt="Signup Illustration"
              className="mt-2 md:h-[400px] md:w-[400px] lg:h-[500px] lg:w-[500px] object-contain"
            />
          </div>

          {/* Right form section */}
          <div className="md:ps-10 md:mt-0 mt-4 lg:w-5/12 md:w-6/12 md:flex md:justify-center md:flex-col">
            <form onSubmit={signupHandler}>
              <div className="md:w-12/12">
                {/* Full Name input */}
                <div className="bg-[#F3F4F6] border-2 border-transparent p-2 rounded-xl flex items-center mt-4">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter Full Name"
                    className="bg-transparent text-md outline-none w-full py-2 px-2"
                    required
                  />
                  <PermIdentityIcon className="text-gray-400" />
                </div>

                {/* Email input */}
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

                {/* Password input */}
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

                {/* Confirm Password input */}
                <div className="bg-[#F3F4F6] border-2 border-transparent p-2 rounded-xl flex items-center mt-4">
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className="bg-transparent text-md outline-none w-full py-2 px-2"
                    required
                  />
                  <LockOpenIcon className="text-gray-400" />
                </div>

                {/* Terms Checkbox */}
                <div className="mt-5">
                  <label className="text-md">
                    <input
                      type="checkbox"
                      name="checkbox"
                      className="me-2 text-blue-600 border-gray-300 rounded"
                      required
                    />
                    I agree to the terms and conditions
                  </label>
                </div>

                {/* Signup button */}
                <div className="mt-4 flex justify-center">
                  <button
                    ref={signupBtn}
                    className="w-full py-3 text-xl text-white bg-blue-400 hover:bg-blue-500 rounded-full flex items-center justify-center"
                  >
                    Next <ArrowRightIcon className="ml-2" />
                  </button>
                  <button
                    ref={loadingBtn}
                    style={{ display: "none" }}
                    disabled
                    className="w-full py-3 text-xl text-white bg-blue-400 rounded-full flex items-center align-middle justify-center"
                  >
                    Loading
                    <CircularProgress
                      style={{ height: "20px", width: "20px", color: "#ffff" }}
                      className="ml-2"
                    />
                  </button>
                </div>
              </div>
            </form>

            {/* Existing account alert */}
            <div className="text-center mt-5">
              <p className="text-lg font-semibold">
                Already a Member?{" "}
                <Link className="font-bold underline text-blue-500" to="/login">
                  Login
                </Link>
              </p>
            </div>

            {/* Social media login buttons */}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Signup);
