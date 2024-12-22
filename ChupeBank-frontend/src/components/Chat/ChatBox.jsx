import React from "react";
import styled from "styled-components";

const ChatBox = ({
  isOpen,
  setIsOpen,
  messages,
  setMessages,
  message,
  setMessage,
  sendMessage,
}) => {
  return (
    <StyledWrapper>
      <div className="chat-card">
        <div className="chat-header">
          <div className="h2">ChatGPT</div>
          <div className="fechar-chat-button" onClick={() => setIsOpen(false)}>
            X
          </div>
        </div>

        <div className="chat-body">
          {messages.map((message, index) => (
            <div key={index} className="message incoming">
              <p>{message.content}</p>
            </div>
          ))}
        </div>
        <div className="chat-footer">
          <input
            placeholder="Digite sua mensagem..."
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .chat-card {
    width: 300px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    z-index: 1000;
  }

  .chat-header {
    padding: 10px;
    background-color: #f2f2f2;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .chat-header .h2 {
    font-size: 16px;
    color: #333;
  }
  .fechar-chat-button {
    cursor: pointer;
    color: #333;
  }

  .chat-body {
    padding: 20px;
  }

  .message {
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 5px;
  }

  .incoming {
    background-color: #e1e1e1;
  }

  .outgoing {
    background-color: #f2f2f2;
    text-align: right;
  }

  .message p {
    font-size: 14px;
    color: #333;
    margin: 0;
  }

  .chat-footer {
    padding: 10px;
    background-color: #f2f2f2;
    display: flex;
  }

  .chat-footer input[type="text"] {
    flex-grow: 1;
    padding: 5px;
    border: none;
    border-radius: 3px;
  }

  .chat-footer button {
    padding: 5px 10px;
    border: none;
    background-color: #4285f4;
    color: #fff;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .chat-footer button:hover {
    background-color: #0f9d58;
  }

  @keyframes chatAnimation {
    0% {
      opacity: 0;
      transform: translateY(10px);
    }

    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .chat-card .message {
    animation: chatAnimation 0.3s ease-in-out;
    animation-fill-mode: both;
    animation-delay: 0.1s;
  }

  .chat-card .message:nth-child(even) {
    animation-delay: 0.2s;
  }

  .chat-card .message:nth-child(odd) {
    animation-delay: 0.3s;
  }
`;

export default ChatBox;