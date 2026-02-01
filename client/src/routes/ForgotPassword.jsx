import React, { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  console.log("Current Step:", step);
  console.log("Email:", email);
  console.log("OTP:", otp);
  console.log("New Password:", newPassword);
  console.log("Confirm Password:", confirmPassword);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    //  OTP
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 2000);
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // reset password
    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 2000);
  };

  return (
    <div className="h-[100vh] w-full flex justify-center items-center px-4">
      {step === 1 ? (
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-4 mt-2">
            Forgot Password
          </h2>
          <form onSubmit={handleEmailSubmit}>
            <div className="mb-4">
              <label className="block font-semibold">Email</label>
              <input
                type="email"
                className="w-full p-2 border rounded"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {loading ? (
              <button
                disabled
                className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Loading
                <CircularProgress
                  style={{ height: "20px", width: "20px", color: "#fff" }}
                  className="ml-2"
                />
              </button>
            ) : (
              <button
                type="submit"
                className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Send OTP
              </button>
            )}
          </form>
        </div>
      ) : (
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <button
            onClick={() => {
              setStep(1);
              setLoading(false);
            }}
            className="text-blue-500"
          >
            Back
          </button>
          <h2 className="text-2xl font-bold text-center mb-4">
            Reset Password
          </h2>
          <form onSubmit={handleResetSubmit}>
            <div className="mb-4">
              <label className="block font-semibold">Verification Code</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="Enter Verification Code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold">New Password</label>
              <input
                type="password"
                className="w-full p-2 border rounded"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold">
                Confirm New Password
              </label>
              <input
                type="password"
                className="w-full p-2 border rounded"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {loading ? (
              <button
                disabled
                className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Loading
                <CircularProgress
                  style={{ height: "20px", width: "20px", color: "#fff" }}
                  className="ml-2"
                />
              </button>
            ) : (
              <button
                type="submit"
                className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Submit
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
