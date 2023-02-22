import React, { useEffect, useState, createRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { socket } from "../../socket";
import { getFormateTime } from "../../utils/getFormateTime";
import { saveGroupMessage } from "../../components/Modal/feature/groupSlice";
import { createMessage } from "./features/OneToOne/messageApi";
import { sendGroupMessage } from "./features/Group/groupMessageApi";
import {
  saveSendMessage,
  saveReceivedMessage,
} from "./features/Users/usersSlice";
import Avatar from "../../components/Avatar/Avatar";
import "./home.scss"; 
import { useOutletContext } from "react-router-dom";

function ChatContainer() {
  const dispatch = useDispatch();
  const [message, setMsg] = useState("");
  const [isTyping , setisTyping] = useState(false);
  const { currentGroupDetils, isUpdated } = useSelector((state) => state.group);
  const { user, isSelected } = useSelector((state) => state.User);
  const auth = useSelector((state) => state.auth);
  const messageContainerRef = createRef();
  const loggedInUser = auth.user;
  const [setClose] = useOutletContext();



  // socket connection
  useEffect(() => {
    setMsg("");
    // -------------------hanlde groups convertation--------------
    // connect to scoket instance
    // group events
    function groups_events() {
      if (
        Object.keys(loggedInUser).length !== 0 &&
        currentGroupDetils !== null
      ) {
        socket.emit("setup", {
          user: loggedInUser,
          groupId: currentGroupDetils._id,
        });
      }

      // listing messag event from server
      socket.on("message", (userData) => {
        dispatch(saveGroupMessage({ ...userData, fromSelf: false }));
        const currentGroup = document.getElementById(
          userData.groupId
        ).lastChild;
        currentGroup.textContent = "";
      });

      // handling typing indicator
      socket.on("group typing", (typing) => {
        const { groupId, message, value } = typing;
        const currentGroup = document.getElementById(groupId).lastChild;
        if (message.length === 0) {
          currentGroup.textContent = "";
          // setTyping(false);
        } else {
          currentGroup.textContent = value;
          // setTyping(true);
        }
      });
    }

    // invoke functions
    groups_events();

    // ------------------hanlding one to one communication-------------
    // one to one events
    function one_to_one_events() {
      // user connection
      if (loggedInUser !== null) {
        socket.emit("one-to-one-connection", loggedInUser);
      }

      // private message
      socket.on("private-message", (newMessage) => {
        // save message an auxilary space
        dispatch(saveReceivedMessage({ ...newMessage, fromSelf: false }));
        setisTyping(false);
        
      });

      // handling typing event
      socket.on("individual typing", (typing) => {
        if (typing.message.length === 0) {
          setisTyping(false);
        } else {
          setisTyping(true);
        }
      });
    }

    // invoke functions
    one_to_one_events();


    // useEffect cleanup
    return () => {
      socket.off("connect");
      socket.off("message");
      socket.off("group typing");
      socket.off("individual typing");
      socket.off("private-message");
    };
  }, [loggedInUser, currentGroupDetils, dispatch, user]);

  // render user defail if we have an user Details
  const renderInfo = () => {
    if (user !== null) {
      return (
        <div className="flex items-center pt-2">
          <svg className="mr-2 md:hidden" width="25" height="25" fill="#9f9d9d" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" onClick={() => setClose(false)}>
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2Z"></path>
         </svg>
          <Avatar w="40" h="40" imgURL={user.profile_img} />
          <div className="ml-3">
            <p className="text-white font-semibold">{user.username}</p>
            <p className="text-zinc-400 font-light text-xs mt-1">online</p>
          </div>
        </div>
      );
    }

    // render user defail if we have an group Details
    if (currentGroupDetils !== null) {
      return (
        <div className="header__info">
          <div
            className="title"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: ".5rem 0",
            }}
          >
            <Avatar w="25" h="25" imgURL={null} />
            <span style={{ marginLeft: "10px" }}>
              {currentGroupDetils.groupName}
            </span>
          </div>
          <p className="sub__title">
            <span>You,</span>
            {currentGroupDetils.users.map((user) => (
              <span key={user._id}>
                {user.username}
                {","}
              </span>
            ))}
          </p>
        </div>
      );
    }
  };

  useEffect(() => {
    const chatMessages = messageContainerRef.current;
    // chatMessages.scrollTop =
    chatMessages.scrollBy({
      top: chatMessages.scrollHeight,
      behavior: "smooth",
    });

  }, [isUpdated, isSelected, user, isTyping ,currentGroupDetils,messageContainerRef]);

  // handling message sending inside perticular group
  function sendMessage(e) {
    e.preventDefault();

    if (currentGroupDetils === null && user !== null) {
      let data = {
        to: user._id,
        from: loggedInUser._id,
        content: message,
        time: getFormateTime(),
      };

      // send private message
      socket.emit("privateMessage", data);

      // save message in db
      dispatch(createMessage(data));

      // set  my message
      const newMessage = { ...data, fromSelf: true };

      // save message an auxilary space
      dispatch(saveSendMessage(newMessage));

      // stop typing
      setisTyping(false);

    } else if (message !== "" && currentGroupDetils !== null) {

      let data = {
        sender : {
            _id : auth.user._id,
            username : auth.user.username,
        },
        content: message,
        groupId: currentGroupDetils._id,
        time: getFormateTime(),
      };

      // send group message to all the connected clients
      socket.emit("group_message", data);

      // set  my message
      const userData = { ...data, fromSelf: true };

      // save message an auxilary space
      dispatch(saveGroupMessage(userData));

      // svae message in DB
      dispatch(sendGroupMessage({
        sender : auth.user._id,
        content : message,
        time : getFormateTime(),
        group : currentGroupDetils._id
      }))
    }

    // clear input
    setMsg("");
  }

  // handleTyping
  const handleInputChange = (e) => {
    setMsg(e.target.value);
    if (currentGroupDetils !== null) {
      socket.emit("group-typing", {
        value: "Typing...",
        groupId: currentGroupDetils._id,
        message: e.target.value,
      });

    } else if (user !== null) {
      socket.emit("individual-typing", {
        to: user._id,
        from: loggedInUser._id,
        message: e.target.value,
      });
    }
  };

  // render group messages
  const renderGroupMessages = (messages) => {
    return (
      messages &&
      messages.map((msg, idx) => {
        if (msg.sender._id === loggedInUser._id) {
          return (
            <div className="my-message" key={idx}>
              <div className="message-wrapper right">
                <div
                  className="message-username"
                  style={{ background: "rgb(64 64 64)" }}
                >
                  {msg.sender.username}
                </div>
                <div className="message-body">
                  <span>{msg.content}</span>{" "}
                  <span className="message-time">{msg.time}</span>
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <div className="recipient-message" key={idx}>
              <div className="message-wrapper left">
                <div
                  className="message-username"
                  style={{ background: "#333333" }}
                >
                {msg.sender.username}
                </div>
                <div className="message-body">
                  <span>{msg.content}</span>{" "}
                  <span className="message-time">{msg.time}</span>
                </div>
              </div>
            </div>
          );
        }
      })
    );
  };

  // render single message
  const renderIndividualMessages = (messages) => {
    return (
      messages &&
      messages.map((msg, idx) => {
        if (
          msg.hasOwnProperty("fromSelf")
            ? msg.fromSelf
            : msg.from === loggedInUser._id
        ) {
          return (
            <div className="my-message" key={idx}>
              <div className="message-wrapper right">
                <span>{msg.content}</span>{" "}
                <span className="message-time">{msg.time}</span>
              </div>
            </div>
          );
        } else {
          return (
            <div className="recipient-message" key={idx}>
              <div className="message-wrapper left">
                <span>{msg.content}</span>{" "}
                <span className="message-time">{msg.time}</span>
              </div>
            </div>
          );
        }
      })
    );
  };

  return (
    <div className="chat-container">
      {/* sub navigation */}
      <div className="subnav">{renderInfo()}</div>

      {/* input box container */}
      <div className="messages" ref={messageContainerRef}>
        {currentGroupDetils !== null
          ? renderGroupMessages(currentGroupDetils.messages)
          : user && renderIndividualMessages(user.message)}
          {
            isTyping && (
              <div className="recipient-message animation-[translate] transition duration-300">
              <div className="message-wrapper left typing-indicator" style={{minWidth : '100px'}}>
                 <div className="circle"></div>
                 <div className="circle"></div>
                 <div className="circle"></div>
              </div>
            </div>
            )
          }
      </div>

      {/* input box container */}
      <div className="input-wrapper">
        <form type="submit" className="form" onSubmit={sendMessage}>
          <div className="form-left">
            <input
              type="text"
              className="input-box"
              placeholder="Enter message here..."
              value={message}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-right">
            <button type="submit">
              <span>Send</span>
              <svg
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2 .01 7Z"></path>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatContainer;
