import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { allUserRoutes, host } from "../utils/APIRoutes";
import Contacts from "../components/Contacts";
import Welcome from "../components/welcome";
import ChatContainer from "../components/ChatContainer";
import { io } from "socket.io-client";

export default function Chat() {
  const socket = useRef();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function Fetch() {
      if (!localStorage.getItem("chat-app-user")) {
        navigate("/login");
      } else {
        setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")));
        setIsLoaded(true);
      }
    }
    Fetch();
  }, []);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    async function Fetch() {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const data = await axios.get(`${allUserRoutes}/${currentUser._id}`);
          setContacts(data.data[0]);
        } else {
          navigate("/setAvatar");
        }
      }
    }
    Fetch();
  }, [currentUser]);

  function handleChatChange(chat) {
    setCurrentChat(chat);
  }

  return (
    <Container>
      <div className="container">
        <Contacts
          contacts={contacts}
          currentUser={currentUser}
          chatChange={handleChatChange}
        />
        {isLoaded && currentChat === undefined ? (
          <Welcome currentUser={currentUser} />
        ) : (
          <ChatContainer
            currentChat={currentChat}
            currentUser={currentUser}
            socket={socket}
          />
        )}
      </div>
    </Container>
  );
}

const Container = styled.div`
  color: white;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #131324;
  .container {
    height: 100vh;
    width: 100%;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080) {
      grid-template-columns: 35% 65%;
    }
  }
`;
