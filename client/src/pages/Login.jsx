import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { storeUserDetails } from "../redux/userSlice";
import TextField from "@mui/material/TextField";

const URL = `${process.env.REACT_APP_SERVER_URL}`;

const Login = ({ login }) => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user: loggedInUser } = useSelector((state) => state.userData);

  useEffect(() => {
    if (loggedInUser) {
      navigate("/");
    }
    return () => {};
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(URL + "/login", user, {
        withCredentials: true,
      });
      const loggedInUserDetail = await res.data;
      dispatch(storeUserDetails(loggedInUserDetail));

      navigate("/");
      toast.success("Logged in!");
    } catch (err) {
      console.log(err);
    }
  };

  async function handleRegister(e) {
    e.preventDefault();
    try {
      const res = await axios.post(URL + "/register", user, {
        withCredentials: true,
      });
      const loggedInUserDetail = await res.data;
      console.log("user register - ", loggedInUserDetail);
      dispatch(storeUserDetails(loggedInUserDetail));

      navigate("/");
      toast.success("Logged in!");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="mt-10">
      {login ? (
        <div className="ml-20 flex gap-8 align-center">
          <img
            loading="lazy"
            height="500px"
            width="500px"
            src={`${process.env.PUBLIC_URL}/Login.svg`}
            alt="Login"
          />
          <form
            onSubmit={handleClick}
            className="flex flex-col gap-4 items-center justify-center"
          >
            <TextField
              id="outlined-basic"
              label="Email address"
              type="email"
              name="email"
              onChange={handleChange}
              variant="outlined"
            />
            <TextField
              id="outlined-basic"
              label="Password"
              type="password"
              name="password"
              onChange={handleChange}
              variant="outlined"
            />
            <button
              className="rounded-md bg-emerald-400 px-5 py-2.5 text-sm font-medium text-white shadow"
              type="submit"
            >
              Login
            </button>
          </form>
        </div>
      ) : (
        <div className="ml-20 flex gap-8 align-center">
          <img
            loading="lazy"
            height="500px"
            width="500px"
            src={`${process.env.PUBLIC_URL}/Register.svg`}
            alt="Register"
          />
          <form
            onSubmit={handleRegister}
            className="flex flex-col gap-4 items-center justify-center"
          >
            <TextField
              id="outlined-basic"
              label="Name"
              type="text"
              name="name"
              onChange={handleChange}
              variant="outlined"
            />
            <TextField
              id="outlined-basic"
              label="Email address"
              type="email"
              name="email"
              onChange={handleChange}
              variant="outlined"
            />
            <TextField
              id="outlined-basic"
              label="Password"
              type="password"
              name="password"
              onChange={handleChange}
              variant="outlined"
            />
            <button
              type="submit"
              className="rounded-md bg-emerald-400 px-5 py-2.5 text-sm font-medium text-white shadow"
            >
              Register
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;
