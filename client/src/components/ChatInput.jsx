import React, { useState } from "react";
import styled from "styled-components";
import Picker, { EmojiStyle } from "emoji-picker-react";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs";

export default function ChatInput({ handleSendMsg }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [msg, setMsg] = useState("");

  function handleEmojiPickerHideShow() {
    setShowEmojiPicker(!showEmojiPicker);
  }

  function handleEmojiClick(emoji, event) {
    let message = msg;
    message += emoji.emoji;
    setMsg(message);
  }

  function handleInputChange(event) {
    const value = event.target.value;
    setMsg(value);
  }

  function sendChat(event) {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  }

  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerHideShow} />
          <div className="emoji-picker">
            {showEmojiPicker && (
              <Picker
                height="340px"
                emojiStyle={EmojiStyle.APPLE}
                onEmojiClick={handleEmojiClick}
                theme="dark"
              />
            )}
          </div>
        </div>
      </div>
      <form className="input-container" onSubmit={(e) => sendChat(e)}>
        <input
          type="text"
          placeholder="type your message here"
          value={msg}
          onChange={handleInputChange}
        />
        <button type="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 5% 95%;
  align-items: center;
  background-color: #080420;
  padding: 0 2rem;
  padding-bottom: 0.3rem;
  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;
    .emoji {
      position: relative;
      svg {
        font-size: 1.5rem;
        color: #ffff00c8;
        cursor: pointer;
      }
      .emoji-picker {
        position: absolute;
        top: -350px;
        /* color: black;
        box-shadow: 0 5px 10px #9a86f3;
        border-color: #9a86f3; */
      }
    }
  }
  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #ffffff34;
    input {
      height: 80%;
      width: 90%;
      background-color: transparent;
      border: none;
      font-size: 1.2rem;
      color: white;
      padding-left: 1.2rem;
      &::selection {
        background-color: #9a86f3;
      }
      &:focus {
        outline: none;
      }
    }
    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #9a86f3;
      border: none;
      cursor: pointer;
      svg {
        font-size: 2rem;
        color: white;
      }
    }
  }
`;
