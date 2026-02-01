import React, { useState } from "react";
import IntrestCard from "../components/IntrestCard";
import { useNavigate } from "react-router-dom";
import IlImg from "../assets/IL.png";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useDispatch } from "react-redux";
import { addInterest, removeInterest } from "../redux/slices/userSlice"; // Import the Redux action
import { errorToast, successToast } from "../helper/toast";
import fetchData from "../helper/fetchData"; // Import your fetch function
import { useSelector } from "react-redux";
import { setStatus } from "../redux/slices/userSlice";
import { getLoginDetailThunk } from "../redux/slices/userSlice";
import CircularProgress from "@mui/material/CircularProgress";
const AddInterest = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const allInterest = useSelector((state) => state.user.data.allInterests);

  const userInterests = useSelector((state) => state.user.data.userInterests);

  const isSelected = (data) => {
    console.log(data, userInterests);
    return userInterests?.some(
      (elem) => elem.interestTitle == data.interestTitle
    );
  };

  const setActive = async (data) => {
    const alreadyExist = userInterests.some(
      (elem) => elem.interestTitle === data.interestTitle
    );
    if (alreadyExist) {
      const result = await fetchData(
        `${import.meta.env.VITE_API_URL}/user/removeInterest`,
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify(data),
          headers: { "content-type": "application/json" },
        }
      );

      if (result.status === "success") {
        dispatch(removeInterest(data.interestTitle));

        successToast(result.message);
        // return prev.filter((elem) => elem.id !== data.id);
      } else {
        errorToast(result.message);
      }
    } else {
      const result = await fetchData(
        `${import.meta.env.VITE_API_URL}/user/addInterest`,
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify(data),
          headers: { "content-type": "application/json" },
        }
      );

      if (result.status === "success") {
        dispatch(addInterest(data, result));

        successToast(result.message);
        // return [...prev, data];
      } else {
        errorToast(result.message);
      }
    }
  };

  const handleAddInterest = async (interest) => {
    console.log("40", interest);
    setLoading(true);
    const result = await fetchData(
      `${import.meta.env.VITE_API_URL}/user/addInterest`,
      {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(interest),
        headers: { "content-type": "application/json" },
      }
    );

    if (result.status === "success") {
      dispatch(
        addInterest({ ...result.data, interestTitle: interest.skillTitle })
      );
      successToast(result.message);
    } else {
      errorToast(result.message);
    }
    setLoading(fasle);
  };

  const handleNextClick = async () => {
    if (userInterests.length <= 0) {
      errorToast("Please select at least one area of interest");
      return;
    }

    navigate("/addskill");
  };

  return (
    <div className=" h-[100vh] w-full bg-white px-[20px] md:px-[50px] lg:px-[100px]">
      <div className="mt-8">
        <p className="text-2xl font-bold">Hello Ella</p>
      </div>
      <div className="mt-5 ">
        <p className="font-semibold text-xl">Choose your area of interest</p>
        <div className="mt-5 flex-wrap flex gap-x-8 gap-y-4">
          {allInterest.map((data) => (
            <IntrestCard
              key={data.id}
              isActive={isSelected(data)}
              setActive={() => setActive(data)}
              data={data}
            />
          ))}
        </div>
      </div>
      <div className="mt-10">
        <img
          src={IlImg}
          alt="Add Interest Illustration"
          className="mt-2 md:h-[150px] md:w-[150px] h-[150px] w-[150px] lg:h-[200px] lg:w-[200px] object-contain"
        />
      </div>
      <div className="mt-8 justify-center flex">
        {loading ? (
          <button
            disabled
            className="py-3 text-xl text-white bg-blue-400  w-full sm:w-min sm:px-20 md:px-32 rounded-[15px] flex items-center justify-center"
          >
            Loading
            <CircularProgress
              style={{ height: "20px", width: "20px", color: "#ffff" }}
              className="ml-2"
            />
          </button>
        ) : (
          <button
            onClick={handleNextClick}
            className="py-3 text-xl text-white bg-blue-400 hover:bg-blue-500 w-full sm:w-min sm:px-20 md:px-32 rounded-[15px] flex items-center justify-center"
          >
            Next <ArrowRightIcon className="ml-2" />
          </button>
        )}
      </div>
    </div>
  );
};

export default React.memo(AddInterest);
