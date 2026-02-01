import { Link } from "react-router-dom";
import React from "react";
import TopNavbar from "../components/TopNavbar";
import BLIMG from "../assets/BL.png";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

const Landing = () => {
  return (
    <div className="h-[100vh] w-[100vw] bg-[#2B292A] flex flex-col">
      {/* main content */}
      <div className="flex-1 flex items-center justify-center px-8 md:px-12 lg:px-24">
        <div className="md:flex w-full items-center justify-between">
          {/* picture */}
          <div className="flex justify-center md:w-6/12">
            <img
              src={BLIMG}
              alt="Landing Illustration"
              className="md:h-[400px] md:w-[400px] lg:h-[500px] lg:w-[500px] object-contain"
            />
          </div>

          {/* text */}
          <div className="md:w-6/12 text-center md:text-left space-y-6">
            <p className="font-bold text-[#B3CEFB] text-4xl leading-snug">
              Connect <br />
              Collaborate <br />
              Create
            </p>

            <p className="font-bold text-[#F4FEDA] text-2xl">
              Unlock Skills with <br /> AI-Powered Projects
            </p>

            {/* button */}
            <div className="flex justify-center md:justify-start mt-6">
              <Link to="/login">
                <span className="w-[70px] h-[70px] rounded-full border-2 border-white bg-gradient-to-b from-[rgba(255,255,255,0.4)] to-[rgba(255,255,255,0.2)] flex items-center justify-center hover:scale-110 transition-transform">
                  <ArrowRightAltIcon
                    sx={{ fontSize: "40px", color: "#FFFFFF" }}
                  />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Landing);
