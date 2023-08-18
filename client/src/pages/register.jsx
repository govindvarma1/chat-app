import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { registrationRoutes } from "../utils/APIRoutes";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const ToastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    theme: "dark",
    draggable: true,
  };

  useEffect(() => {
    if (localStorage.getItem("chat-app-user")) {
      navigate("/");
    }
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    if (handleValidation()) {
      const { password, cpassword, name, username, email } = user;
      const { data } = await axios.post(registrationRoutes, {
        username,
        email,
        password,
        name,
      });
      if (data.status === false) {
        toast.error(data.msg, ToastOptions);
      }
      if (data.status === true) {
        localStorage.setItem("chat-app-user", JSON.stringify(data.user));
        navigate("/");
      }
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setUser((prevValue) => ({ ...prevValue, [name]: value }));
  }

  function handleValidation() {
    const { password, cpassword, name, username, email } = user;
    if (password !== cpassword) {
      toast.error("Password and confirm password should be same", ToastOptions);
      return false;
    } else if (name.length < 3) {
      toast.error("Name should be greater than 3 characters", ToastOptions);
    } else if (username.length < 3) {
      toast.error("Username should be greater than 3 characters", ToastOptions);
      return false;
    } else if (password.length < 8) {
      toast.error("Password should have atleast 8 characters", ToastOptions);
      return false;
    } else if (email === "") {
      toast.error("email is required", ToastOptions);
      return false;
    }
    return true;
  }

  return (
    <>
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full name"
            name="name"
            onChange={handleChange}
            value={user.name}
          />
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={handleChange}
            value={user.username}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={handleChange}
            value={user.email}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
            value={user.password}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="cpassword"
            onChange={handleChange}
            value={user.cpassword}
          />
          <button type="submit">Register</button>
          <span>
            already have an account ? <Link to="/login">login</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
    input {
      background-color: transparent;
      padding: 1rem;
      border: 0.1rem solid #4e0eff;
      border-radius: 0.4rem;
      color: white;
      width: 100%;
      font-size: 1rem;
      &:focus {
        border: 0.1rem solid #997af0;
        outline: none;
      }
    }
    button {
      background-color: #997af0;
      padding: 1rem 2rem;
      border: none;
      border-radius: 0.4rem;
      font-weight: bold;
      cursor: pointer;
      text-transform: uppercase;
      color: white;
      width: 100%;
      transition: 0.4s ease-in-out;
      &:hover {
        background-color: #4e0eff;
      }
    }
    span {
      color: white;
      text-transform: uppercase;
      a {
        color: #4e0eff;
        font-weight: bold;
        text-decoration: none;
      }
    }
  }
`;
