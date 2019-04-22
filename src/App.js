import React, { Component } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHaykal } from "@fortawesome/free-solid-svg-icons";
import logo from "./logo.svg";
import "./App.css";

const Row = styled.div`
  display: flex;
  margin-bottom: 10px;
  & .message-label {
    width: 150px;
    margin-right: 10px;
    p {
      text-align: start;
      font-family: "Oswald", sans-serif;

      span {
        display: inline-block;
        background-color: yellowgreen;
        color: white;
        padding: 8px 8px;
        border-radius: 10px;
      }
    }
  }
  & .message-content {
    p {
      margin-top: 28px;
      font-family: "Arvo", serif;
    }
  }
`;

const Message = ({ type, message, nickname }) => (
  <Row>
    <div className="message-label">
      <p>
        {type !== "message" ? (
          <span
            style={
              type === "notification"
                ? { backgroundColor: "blue" }
                : { backgroundColor: "orange" }
            }
          >
            <FontAwesomeIcon
              icon={faHaykal}
              size="sm"
              style={{ marginRight: "10px" }}
            />{" "}
            {` ${type}`}
          </span>
        ) : (
          <span>{nickname}</span>
        )}
      </p>
    </div>
    <div className="message-content">
      <p>{message}</p>
    </div>
  </Row>
);

class App extends Component {
  state = {
    nickname: "",
    id: "",
    message: [],
    text: ""
  };

  componentDidMount = () => {
    this.scrollToBottom();
    this.ws = new WebSocket("ws://fathomless-shelf-62294.herokuapp.com/");
    this.ws.onopen = () => {
      console.log("WebSocket server is connected");
      // this.ws.send("I'm loggin, ok?");
    };
    this.ws.onmessage = e => {
      var data = JSON.parse(e.data);
      const { type, id, nickname, message } = data;
      this.setState({
        nickname,
        id,
        message: [...this.state.message, { type, nickname, message }]
      });
      this.scrollToBottom();
    };
  };

  onChangeHandler = e => {
    const text = e.target.value;
    this.setState({
      text
    });
  };

  onClickHandler = e => {
    e.preventDefault();
    const { text } = this.state;
    if (!text.trim().length) return;
    this.ws.send(text);
    this.setState({
      text: ""
    });
    this.scrollToBottom();
  };

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  };

  render() {
    const { message, text } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>The Super chat room</h1>
        </header>
        <section>
          <div className="main-section">
            <h2>Chat Room 1:</h2>
            <ul className="messages">
              {message.map((obj, index) => (
                <Message
                  type={obj.type}
                  message={obj.message}
                  key={index}
                  nickname={obj.nickname}
                />
              ))}
              <div
                style={{ float: "left", clear: "both" }}
                className="dummy"
                ref={el => {
                  this.messagesEnd = el;
                }}
              />
            </ul>
            <form>
              <input
                onChange={this.onChangeHandler}
                type="text"
                placeholder="Type text to echo in here"
                value={text}
              />
              <button onClick={this.onClickHandler}>Send Message</button>
            </form>
          </div>
        </section>
      </div>
    );
  }
}

export default App;
