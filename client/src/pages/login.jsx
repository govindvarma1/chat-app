import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { loginRoutes } from "../utils/APIRoutes";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const ToastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    theme: "dark",
    draggable: true,
  };

  useEffect(() => {
    if (localStorage.getItem("chat-ap-user")) {
      navigate("/");
    }
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    if (handleValidation()) {
      const { password, username } = user;
      const { data } = await axios.post(loginRoutes, {
        username,
        password,
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
    const { password, username } = user;
    if (username.length === "" || password.length === "") {
      toast.error("Username and password are required", ToastOptions);
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
            placeholder="Username"
            name="username"
            onChange={handleChange}
            value={user.username}
            min="3"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
            value={user.password}
          />
          <button type="submit">Login</button>
          <span>
            Don't have an account ? <Link to="/register">register</Link>
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
