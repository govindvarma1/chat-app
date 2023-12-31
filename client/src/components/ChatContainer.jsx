import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Logout from "./Logout";
import ChatInput from "./ChatInput";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { getAllMessagesRoute, sendMessageRoute } from "../utils/APIRoutes";
import useSound from "use-sound";
import sound1 from "../assets/notifications/diff_chat.mp3";

export default function ChatContainer({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();
  const [diff_chat] = useSound(sound1);

  async function getMessages() {
    if (currentChat) {
      const response = await axios.post(getAllMessagesRoute, {
        from: currentUser._id,
        to: currentChat._id,
      });
      setMessages(response.data);
    }
  }

  useEffect(() => {
    getMessages();
  }, [currentChat]);

  async function handleSendMsg(msg) {
    await axios.post(sendMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
    });
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: currentUser._id,
      message: msg,
    });
    const msgs = [...messages];
    const currentDate = new Date();
    const date =
      currentDate.getDate() +
      "/" +
      (currentDate.getMonth() + 1) +
      "/" +
      currentDate.getFullYear();
    const time = currentDate.getHours() + ":" + currentDate.getMinutes();
    msgs.push({ fromSelf: true, message: msg, date: date, time: time });
    setMessages(msgs);
  }

  useEffect(() => {
    const currentDate = new Date();
    const date =
      currentDate.getDate() +
      "/" +
      (currentDate.getMonth() + 1) +
      "/" +
      currentDate.getFullYear();
    const time = currentDate.getHours() + ":" + currentDate.getMinutes();
    if (socket.current) {
      socket.current.on("msg-receive", ({ message, to }) => {
        // if (currentChat._id === to) {
        setArrivalMessage({
          fromSelf: false,
          message: message,
          date: date,
          time: time,
        });
        // }
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView();
  }, [messages]);

  return (
    <>
      {currentChat && (
        <Container>
          <div className="chat-header">
            <div className="user-details">
              <div className="avatar">
                <img src={currentChat.avatarImage} alt="" />
              </div>
              <div className="username">
                <h3>{currentChat.username}</h3>
              </div>
            </div>
            <Logout />
          </div>
          <div className="chat-messages">
            {messages.map((message, index) => {
              return (
                <div key={uuidv4()}>
                  <div className="date">
                    <p>
                      {(index === 0 ||
                        message.date !== messages[index - 1].date) &&
                        message.date}
                    </p>
                  </div>
                  <div ref={scrollRef}>
                    <div
                      className={`message ${
                        message.fromSelf ? "sent" : "received"
                      }`}
                    >
                      <div className="content">
                        <p>{message.message}</p>
                        <p className="time">{message.time}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <ChatInput handleSendMsg={handleSendMsg} />
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 82% 8%;
  gap: 0.1rem;
  overflow: hidden;
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
          border-radius: 50%;
          background-color: #997af0;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .date {
      display: flex;
      justify-content: center;
      align-items: center;
      p:not(:empty) {
        background-color: #997af0;
        width: fit-content;
        padding: 0.5rem;
        border-radius: 0.5rem;
        margin: 0.5rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        display: flex;
        align-items: flex-end;
        gap: 0.6rem;
        .time {
          font-size: 0.65rem;
        }
      }
    }
    .sent {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .received {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;
