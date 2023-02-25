import React, { useState, useEffect, useCallback } from "react";
import { Outlet } from "react-router-dom";
import CreateGroup from "../../components/Modal/CreateGroup";
import Sidenav from "../../components/Sidenav/Sidenav";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../Auth/feature/api/authApi";
import { isJwtExpired } from "../../utils/jwtExpiraction";
import { useLocation } from "react-router-dom";
import { getQueryParams } from "../../utils/getQueryParams";
import { currentUser, resetUsersState } from "./features/Users/usersSlice";
import { fetchMessage } from "./features/Users/usersApi";
import {
  getGroupById,
  resetGroupState,
} from "../../components/Feature/groupSlice";
import { socket } from "../../socket";

function Home() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [open, setOpen] = useState(false);
  const [close, setClose] = useState(false);
  const dispatch = useDispatch();
  const loc = useLocation();
  const params = getQueryParams(loc);
  const groupId = params.groupId;
  const userId = params.userId;
  const [isTyping, setisTyping] = useState(false);
  const [typingUserId, settypingUserId] = useState(null);
  const { groups } = useSelector((state) => state.group);
  const { data } = useSelector((state) => state.User);
  const { isUploaded, user } = useSelector((state) => state.auth);

  // handling typing events
  const handleTyping = useCallback(({ message, from,}) => {
    const typing = document.querySelector(`#user-${from}`).firstChild;
    const istypingTextPresent = document.querySelector(`#user-${from} .typing-text`);
    const typingText = document.createElement("span");
    typingText.className = "typing-text text-xs text-green-500 ml-10";

    // handle typing and typing text
    if (message.length === 0) {
      setisTyping(false);
      settypingUserId(null);
      // rmeove child
      typing.removeChild(typing.lastChild);
    } else {
      settypingUserId(from);
      setisTyping(true);
      // append child
      if (istypingTextPresent === null) {
        typingText.textContent = "Typing..";
        typing.append(typingText);
      }
    }
  }, []);

    // handle Group Typing
    const handleGroupTyping = useCallback((typing) => {
      const { groupId, message, value } = typing;
      const currentGroup = document.getElementById(groupId).lastChild;
      if (message.length === 0) {
        currentGroup.textContent = "";
      } else {
        currentGroup.textContent = value;
      }
    }, []);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("connection init", { isConnected, user });
    });

    if (Object.keys(user).length > 0) {
      user.groups.forEach((group) => {
        socket.emit("setup", {
          user,
          group: group,
        });
      });
      socket.emit("one-to-one-connection", user);
    }

    socket.on("individual typing", handleTyping);
    socket.on("group typing", handleGroupTyping);
    socket.on("disconnect", () => setIsConnected(false));

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("individual typing", handleTyping);
      socket.off("group typing", handleGroupTyping);
    };
  }, [isConnected, user, handleTyping, handleGroupTyping,]);
  
  // -------------------------fetch mesage-----------------
  // fetch messages
  useEffect(() => {
    if (userId) {
      dispatch(fetchMessage(userId));
    }
  }, [dispatch, userId]);

  // fetch group by curresponded id
  useEffect(() => {
    if (groupId && groups.length > 0) {
      dispatch(getGroupById({ groups, groupId: groupId }));
      dispatch(resetUsersState());
    }
  }, [groupId, dispatch, groups]);

  useEffect(() => {
    // get current selected user
    // reset group State
    if (userId && data) {
      dispatch(currentUser({ data, userId: userId }));
      dispatch(resetGroupState());
    }
  }, [dispatch, userId, data]);

  // check jwt expiraction
  useEffect(() => {
    if (isJwtExpired()) {
      // remove token from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      window.location.reload();
    }
  }, []);

  // fetch profile
  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch, isUploaded]);

  return (
    <div className="home">
      {/* create group modal box */}
      <CreateGroup open={open} setOpen={setOpen} />
      <main>
        <Sidenav setOpen={setOpen} close={close} setClose={setClose} />
        <Outlet
          context={[
            setClose,
            isTyping,
            setisTyping,
            typingUserId,
            settypingUserId,
          ]}
        />
      </main>
    </div>
  );
}

export default Home;
