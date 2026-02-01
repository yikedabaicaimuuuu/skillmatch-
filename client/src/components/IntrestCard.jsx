import { red } from "@mui/material/colors";
import React, { Fragment, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

const IntrestCard = (props) => {
  const [loading, setLoading] = useState(false);
  const handleActive = async () => {
    setLoading(true);
    await props.setActive(props.data);
    setLoading(false);
  };
  return (
    <Fragment>
      {loading ? (
        <button
          disabled
          onClick={() => handleActive()}
          className=" text-md font-[700] items-center justify-center align-middle border flex  md:w-2/12 px-3 py-3 shadow-[0px_4px_10px_#4F4F4F59] rounded-[10px]"
        >
          <CircularProgress
            style={{ height: "20px", width: "20px", color: "#000000" }}
            className="ml-2"
            sx={{ color: "#000000" }}
          />
        </button>
      ) : (
        <button
          onClick={() => handleActive()}
          style={{ backgroundColor: props.isActive ? "red" : "" }}
          className=" text-md font-[700] items-center justify-center align-middle border flex  md:w-2/12 px-3 py-3 shadow-[0px_4px_10px_#4F4F4F59] rounded-[10px]"
        >
          {props.data.interestTitle
            ? props.data.interestTitle
            : props.data.skillTitle}
        </button>
      )}
    </Fragment>
  );
};

export default React.memo(IntrestCard);
