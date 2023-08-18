import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

export default function Welcome({ currentUser }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserAvatar, setCurrentUserAvatar] = useState(undefined);

  useEffect(() => {
    if (currentUser) {
      setCurrentUserName(currentUser.username);
      setCurrentUserAvatar(currentUser.avatarImage);
    }
  }, [currentUser]);
  return (
    <Container>
      <h1>
        Welcome, <span>{currentUserName}</span>
      </h1>
      <h3>Please select a chat to start messaging</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 1rem;
  span {
    color: #4e0eff;
  }
`;
