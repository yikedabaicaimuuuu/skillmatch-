import { createSlice } from "@reduxjs/toolkit";
import fetchData from "../../helper/fetchData";
import { errorToast, successToast } from "../../helper/toast";
import RecentPosts from "../../components/RecentPosts";


// function to signup the user
export const signupThunk = (fullName, email, password) => {
  return async function signupAsyncThunk(dispatch) {
    const data = await fetchData(
      `${import.meta.env.VITE_API_URL}/auth/signup`,
      {
        method: "POST",
        body: JSON.stringify({ fullName, email, password }),
        headers: {
          "content-type": "application/json",
        },
      }
    );
    if (data.status == "success") {
      dispatch(setUsername(fullName));
      await dispatch(loginThunk(email, password));
    }
    return data;
  };
};

// function to login the user
export const loginThunk = (email, password) => {
  return async function loginAsyncThunk(dispatch) {
    const data = await fetchData(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
    });

    if (data.status == "success") {
      await dispatch(getLoginDetailThunk());
    }
    return data;
  };
};

//function to logout user from server
export const logoutThunk = () => {
  return async function logoutAsyncThunk(dispatch) {
    const data = await fetchData(
      `${import.meta.env.VITE_API_URL}/auth/logout`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
          credential: "include",
        },
      }
    );
    if (data.status == "success") {
      dispatch(logout());
    }
    return data;
  };
};



// function to know that the user is login or not from server . if login get the detail of user
export const getLoginDetailThunk = () => {
  return async function getLoginDetailAsyncThunk(dispatch) {
    dispatch(setStatus("loading"));
    const data = await fetchData(
      `${import.meta.env.VITE_API_URL}/auth/getLoginDetail`,
      {
        method: "POST",
        body: JSON.stringify({}),
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
      }
    );
    if (data.status == "success") {
      dispatch(setStatus("success"));
      dispatch(login(data.data));
      // 从返回的数据中获取并设置用户名
      if (data.data.fullName) {
        dispatch(setUsername(data.data.fullName));
      }
    } else {
      dispatch(setStatus("error"));
    }
    return true;
  };
};

const initialState = {
  isAuthenticated: false,
  status: "idle",
  username: '',  // 新增字段，存储用户名
  data: {
    userInterests: [],
    userSkills: [],
    recentPosts: [],
  },
  selectedProject: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.data = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.data = { interests: [], skills: [] };
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    addInterest: (state, action) => {
      state.data.userInterests = [action.payload, ...state.data.userInterests];
    },
    removeInterest: (state, action) => {
      state.data.userInterests = state.data.userInterests.filter(
        (elem) => action.payload != elem.interestTitle
      );
    },
    addSkill(state, action) {
      state.data.userSkills = [action.payload, ...state.data.userSkills];
    },
    removeSkill(state, action) {
      state.data.userSkills = state.data.userSkills.filter(
        (elem) => action.payload.skillTitle != elem.skillTitle
      );
    },
    setSelectedProject: (state, action) => {
      state.selectedProject = action.payload;
    },
    clearSelectedProject: (state) => {
      state.selectedProject = null;
    },
    addPost: (state, action) => {
      state.data.recentPosts = [action.payload, ...state.data.recentPosts];
    },
    setUsername: (state, action) => {  // 新增
      state.username = action.payload;
    },
  },
});

export const {
  login,
  logout,
  setStatus,
  addInterest,
  removeInterest,
  addSkill,
  removeSkill,
  setSelectedProject,
  clearSelectedProject,
  addPost,
  setUsername,
} = userSlice.actions;

export default userSlice.reducer;
