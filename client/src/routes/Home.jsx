import React, { useEffect } from "react";
import fetchData from "../helper/fetchData";
import { Link } from "react-router-dom";
import { logoutThunk } from "../redux/slices/userSlice";
import { useDispatch } from "react-redux";

const Home = () => {
  const dispatch = useDispatch();
  //example of api request
  const apiRequest = async () => {
    var email = "example@gmail.com";
    var password = "1234";
    const apiUrl = import.meta.env.VITE_API_URL + "/user/signup";
    const data = await fetchData(apiUrl, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "content-type": "application/json",
      },
    });
    console.log(data);
  };

  // useEffect(() => {
  //   apiRequest();
  // }, []);

  const logoutHandler = async () => {
    let logout = dispatch(logoutThunk());
  };
  return (
    <div>
      <div className="  text-center ">
        {" "}
        <h2 className="text-3xl text-center text-[red]"></h2>
        Home Page
        <div>
          <button
            className="border-black border-2 m-30"
            onClick={logoutHandler}
          >
            logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Home);
