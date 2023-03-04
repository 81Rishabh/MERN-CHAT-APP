import React, { useEffect, useState, createRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { socket } from "../../socket";
import { getFormateTime } from "../../utils/getFormateTime";
import { saveGroupMessage } from "../../components/Feature/groupSlice";
import { createMessage } from "./features/OneToOne/messageApi";
import { sendGroupMessage as sendGroupMessageInDB } from "./features/Group/groupMessageApi";
import {
  saveSendMessage,
  saveReceivedMessage,
  saveSentLastMessage,
  saveReceivedLastMessage
} from "./features/Users/usersSlice";
import Avatar from "../../components/Avatar/Avatar";
import "./home.scss";
import { useOutletContext } from "react-router-dom";

function ChatContainer() {
  const dispatch = useDispatch();
  const [message, setMsg] = useState("");
  const { currentGroupDetils, isUpdated } = useSelector((state) => state.group);
  const { user, isSelected, loading } = useSelector((state) => state.User);
  const [setClose, isTyping, setisTyping, typingUserId] = useOutletContext();
  const auth = useSelector((state) => state.auth);
  const messageContainerRef = createRef();
  const loggedInUser = auth && auth.user;

  // handle private message
  const handlePrivateMessage = useCallback(
    (newMessage) => {
      const typing = document.querySelector(`#user-${newMessage.from}`).firstChild.firstChild.lastChild;
      dispatch(saveReceivedMessage({ ...newMessage, fromSelf: false }));
      dispatch(saveReceivedLastMessage(newMessage));
      typing.removeChild(typing.lastChild);
      setisTyping(false);
    },
    [dispatch, setisTyping]
  );

  // handle group message
  const handleGroupMessage = useCallback(
    (userData) => {
      dispatch(saveGroupMessage({ ...userData, fromSelf: false }));
      const currentGroup = document.getElementById(userData.groupId).lastChild;
      currentGroup.textContent = "";
    },
    [dispatch]
  );

  // socket connection
  useEffect(() => {
    setMsg("");
    if (Object.keys(loggedInUser).length !== 0 && currentGroupDetils !== null) {
      socket.emit("setup", {user: loggedInUser,group: currentGroupDetils});
    }

    socket.on("message", handleGroupMessage);
    socket.on("private-message", handlePrivateMessage);

    // useEffect cleanup
    return () => {
      socket.off("message", handleGroupMessage);
      socket.off("private-message", handlePrivateMessage);
    };
  }, [
    loggedInUser,
    currentGroupDetils,
    user,
    handleGroupMessage,
    handlePrivateMessage,
  ]);
  

  // scroll down when mesage gets overflow
  useEffect(() => {
    const chatMessages = messageContainerRef.current;
    // chatMessages.scrollTop =
    chatMessages.scrollBy({
      top: chatMessages.scrollHeight,
      behavior: "smooth",
    });
  }, [
    isUpdated,
    isSelected,
    user,
    isTyping,
    currentGroupDetils,
    messageContainerRef,
  ]);

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

      // save message an auxilary space
      dispatch(saveSendMessage({ ...data, fromSelf: true }));

      // save last message
      dispatch(saveSentLastMessage(data))
    
      // stop typing
      setisTyping(false);
    } else if (message !== "" && currentGroupDetils !== null) {
      let data = {
        sender: {
          _id: auth.user._id,
          username: "you"
        },
        content: message,
        groupId: currentGroupDetils._id,
        time: getFormateTime(),
      };

      // send group message to all the connected clients
      socket.emit("group_message", data);

      const userData = { ...data, fromSelf: true };

      // save message an auxilary space
      dispatch(saveGroupMessage(userData));

      // svae message in DB
      dispatch(
        sendGroupMessageInDB({
          sender: auth.user._id,
          content: message,
          time: getFormateTime(),
          group: currentGroupDetils._id,
        })
      );
    }

    // clear input
    setMsg("");
  }

  // handleTyping
  const handleInputChange = (e) => {
    setMsg(e.target.value);
    if (currentGroupDetils !== null) {
      let context = {value: "Typing...",groupId:currentGroupDetils._id,message:e.target.value}
      socket.emit("group-typing", context);
    } else if (user !== null) {
      let context = {to:user._id, from:loggedInUser._id, message:e.target.value};
      socket.emit("individual-typing", context);
    }
  };

  // render user defail if we have an user Details
  const renderInfo = () => {
    if (user) {
      return (
        <div className="flex items-center p-2">
          <svg
            className="mr-2 md:hidden"
            width="25"
            height="25"
            fill="#9f9d9d"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => setClose(false)}
          >
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2Z"></path>
          </svg>
          <Avatar w="40" h="40" imgURL={user.profile_img} />
          <div className="ml-3">
            <p className="text-white font-semibold">{user.username}</p>
            <p className="text-zinc-400 font-light text-xs mt-1">{user.hasOwnProperty('isOnline') && user['isOnline'] ? 'online' : ''}</p>
          </div>
        </div>
      );
    }

    // render user defail if we have an group Details 
    if (currentGroupDetils) {
      return (
        <div className="header__info flex items-center pt-2">
          <svg
            className="mr-2 md:hidden"
            width="25"
            height="25"
            fill="#9f9d9d"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => setClose(false)}
          >
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2Z"></path>
          </svg>
          <Avatar w="40" h="40" imgURL={currentGroupDetils.profile_img} />
          <div className="ml-3">
            <p className="text-white font-semibold">
              {currentGroupDetils.groupName}
            </p>
            <p className="sub__title text-zinc-400 font-light text-xs mt-2">
              <span>
                You,{" "}
                {currentGroupDetils.users.map((user) => (
                  <span key={user._id}>
                    {user.username}
                    {","}
                  </span>
                ))}
              </span>
            </p>
          </div>
        </div>
      );
    }
  };

  // render group messages
  const renderGroupMessages = (messages) => {
    return (
      messages &&
      messages.map((msg, idx) => {
        if (msg.sender._id === loggedInUser._id) {
          return (
            <div className="w-full" key={idx}>
              <div className="bg-emerald-900 shadow-md rounded-md float-right clear-both my-2">
                <div className="p-2 text-zinc-300 text-xs bg-emerald-800 rounded-tl-md rounded-tr-md">
                  {msg.sender._id === loggedInUser._id ? 'You' :msg.sender.username }
                </div>
                <div className="message-body h-auto p-2">
                  <span className="text-white">{msg.content}</span>{" "}
                  <span className="text-[10px] mt-2 float-right ml-3 text-gray-400">
                    {msg.time}
                  </span>
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <div className="w-full" key={idx}>
              <div className="bg-zinc-800 shadow-md rounded-md float-left clear-both my-2">
                <div className="p-2 text-zinc-300 text-xs bg-zinc-700 rounded-tl-md rounded-tr-md">
                  {msg.sender.username}
                </div>
                <div className="message-body h-auto p-2">
                  <span className="text-white">{msg.content}</span>{" "}
                  <span className="text-[10px] mt-2 float-right ml-3 text-gray-400">
                    {msg.time}
                  </span>
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
    return loading ? (
      <div className="loading-container flex-col m-0 w-full h-full opacity-80 flex justify-center items-center shadow-lg rounded-md">
        <div className="circle w-8 h-8 border-2 border-white border-t-blue-700 border-b-pink-700 animate-spin  rounded-full" />
        <h4 className="text-zinc-400 mt-4">Loading Messages...</h4>
      </div>
    ) : (
      messages.map((msg, idx) => {
        if (
          msg.hasOwnProperty("fromSelf")
            ? msg.fromSelf
            : msg.from === loggedInUser._id
        ) {
          return (
            <div className="my-message" key={idx}>
              <div className="message-wrapper right bg-emerald-800 shadow-md rounded-md">
                <span>{msg.content}</span>{" "}
                <span className="message-time text-[10px] mt-2 float-right ml-3 text-gray-400">
                  {msg.time}
                </span>
              </div>
            </div>
          );
        } else {
          return (
            <div className="recipient-message" key={idx}>
              <div className="message-wrapper left bg-zinc-800 shadow-md rounded-md">
                <span>{msg.content}</span>{" "}
                <span className="message-time text-[10px] mt-2 float-right ml-3 text-gray-400">
                  {msg.time}
                </span>
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
      <div className="subnav bg-zinc-900">{renderInfo()}</div>

      {/* input box container */}
      <div className="messages" ref={messageContainerRef}>
        
        {currentGroupDetils !== null ? renderGroupMessages(currentGroupDetils.messages) : user && renderIndividualMessages(user.message)}
        
        {isTyping && typingUserId === user?._id && (
          <div className="recipient-message">
            <div
              className="message-wrapper animate-[translate] transition duration-300  left bg-zinc-800 shadow-md rounded-md typing-indicator"
              style={{ minWidth: "70px" }}
            >
              {
                [1,2,3].map((_,idx) => <div className="circle" key={idx}></div>)
              }
            </div>
          </div>
        )}
      </div>

      <div className="input-wrapper bg-zinc-900">
        <form type="submit" className="form" onSubmit={sendMessage}>
          <div className="form-left">
            <input
              type="text"
              className="input-box bg-zinc-800"
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
