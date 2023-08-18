import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { setAvatarRoutes } from "../utils/APIRoutes";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

export default function SetAvatar() {
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(-1);
  const ToastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    theme: "dark",
    draggable: true,
  };

  useEffect(() => {
    async function avatarSet() {
      if (!localStorage.getItem("chat-app-user")) {
        navigate("/login");
      }
    }
    avatarSet();
  }, []);

  const setProfilePicture = async () => {
    if (selectedAvatar === -1) {
      toast.error("Please select an avatar", ToastOptions);
    } else {
      const user = await JSON.parse(localStorage.getItem("chat-app-user"));
      const { data } = await axios.post(`${setAvatarRoutes}/${user._id}`, {
        image: avatars[selectedAvatar],
      });
      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem("chat-app-user", JSON.stringify(user));
        navigate("/");
      } else {
        toast.error("Error setting avatar, Please try again", ToastOptions);
      }
    }
  };

  useEffect(() => {
    const data = [];
    const url = "https://api.dicebear.com/6.x/micah/svg?seed=";
    for (let i = 0; i < 4; i++) {
      const image = `${url}` + Math.floor(Math.random() * 1000000);
      data.push(image);
    }
    setAvatars(data);
    setIsLoading(false);
  }, []);

  return (
    <>
      <Container>
        <div className="title-container">
          <h1>Pick an avatar as your profile picture</h1>
        </div>
        <div className="avatars">
          {avatars.map((avatar, index) => {
            return (
              <div
                key={index}
                className={`avatar ${
                  selectedAvatar === index ? "selected" : ""
                }`}
                onClick={() => {
                  setSelectedAvatar(index);
                }}
              >
                <img src={avatar} alt="avatar" />
              </div>
            );
          })}
        </div>
        <button className="submit-btn" onClick={setProfilePicture}>
          Select Avatar
        </button>
      </Container>
      <ToastContainer />
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;
  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    gap: 1rem;
  }

  .avatar {
    border: 0.4rem solid transparent;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    padding: 0.2rem;
    align-items: center;
    transition: 0.5s ease-in-out;
    img {
      height: 7rem;
      border-radius: 50%;
      background-color: #997af0;
    }
  }
  .selected {
    border: 0.4rem solid #4e0eff;
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
    width: fit-content;
    transition: 0.4s ease-in-out;
    &:hover {
      background-color: #4e0eff;
    }
  }
`;
