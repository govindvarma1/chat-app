import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Logout from "./Logout";

export default function Contacts({ currentUser, contacts, chatChange }) {
    const [currentUserName, setCurrentUserName] = useState(undefined);
    const [currentuserImage, setCurrentUserImage] = useState(undefined);
    const [currentSelected, setCurrentSelected] = useState(undefined);

    useEffect(() => {
        if (currentUser) {
            setCurrentUserName(currentUser.username);
            setCurrentUserImage(currentUser.avatarImage);
        }
    }, [currentUser]);

    function changeCurrentChat(index, contact) {
        setCurrentSelected(index);
        chatChange(contact);
    }

    return (
        <>
            {currentuserImage && currentUserName && (
                <Container>
                    <div className="brand">
                        <h2>Chats</h2>
                    </div>
                    <div className="contacts">
                        {contacts.map((contact, index) => (
                            <div
                                className={`contact ${
                                    index === currentSelected ? "selected" : ""
                                }`}
                                key={contact._id}
                                onClick={() =>
                                    changeCurrentChat(index, contact)
                                }>
                                <div className="avatar">
                                    <img
                                        src={contact.avatarImage}
                                        alt="Avatar"
                                    />
                                </div>
                                <div className="username">
                                    <h3>{contact.name}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="current-user">
                        <div>
                            <div className="avatar">
                                <img
                                    src={currentUser.avatarImage}
                                    alt="Avatar"
                                />
                            </div>
                            <div className="username">
                                <h2>{currentUser.username}</h2>
                            </div>
                        </div>
                        <Logout />
                    </div>
                </Container>
            )}
        </>
    );
}

const Container = styled.div`
    display: grid;
    grid-template-rows: 10% 84% 10%;
    overflow: hidden;
    background-color: #080420;
    .brand {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .contacts {
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: auto;
        gap: 0.8rem;
        &::-webkit-scrollbar {
            width: 0.2rem;
            &-thumb {
                background-color: #ffffff39;
                width: 0.1rem;
                border-radius: 1rem;
            }
        }
        .contact {
            background-color: #ffffff39;
            min-height: 5rem;
            cursor: pointer;
            width: 90%;
            border-radius: 0.2rem;
            padding: 0.4rem;
            gap: 1rem;
            display: flex;
            align-items: center;
            transition: 0.5s ease-in-out;
            .avatar {
                img {
                    height: 3rem;
                    background: #997af0;
                    border-radius: 50%;
                }
            }
            .username {
                h3 {
                    color: white;
                }
            }
        }
        .selected {
            background-color: #9186f3;
        }
    }
    .current-user {
        position: relative;
        bottom: 1rem;
        padding: 1rem;
        background-color: #0d0d30;
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        gap: 2rem;
        height: fit-content;
        div {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            .avatar {
                img {
                    height: 3rem;
                    background-color: #997af0;
                    border-radius: 50%;
                }
            }
            .username {
                h2 {
                    color: white;
                }
            }
        }
        @media screen and (min-width: 720px) and (max-width: 1080) {
            gap: 0.5rem;
            .username {
                h2 {
                    font-size: 1rem;
                }
            }
        }
    }
`;
