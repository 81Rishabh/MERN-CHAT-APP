import React, { useState, useEffect, useCallback } from "react";
import { Outlet } from "react-router-dom";
import CreateGroup from "../../components/Modal/CreateGroup";
import Sidenav from "../../components/Sidenav/Sidenav";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../Auth/feature/api/authApi";
import { isJwtExpired } from "../../utils/jwtExpiraction";
import { useLocation } from "react-router-dom";
import { getQueryParams } from "../../utils/getQueryParams";
import {
  currentUser,
  resetUsersState,
  setUserStatus,
} from "./features/Users/usersSlice";
import { fetchMessageByUser as fetchMessage } from "./features/Users/usersApi";
import {
  getGroupById,
  resetGroupState,
} from "../../components/Feature/groupSlice";
import { socket } from "../../socket";


function Home() {
  const [open, setOpen] = useState(false);
  const [close, setClose] = useState(false);
  const [isTyping, setisTyping] = useState(false);
  const [typingUserId, settypingUserId] = useState(null);
  const [refresh , setRefresh] = useState(false);
  const dispatch = useDispatch();
  const loc = useLocation();
  const params = getQueryParams(loc);
  const { myGroups } = useSelector((state) => state.group);
  const { data } = useSelector((state) => state.User);
  const { isUploaded, user } = useSelector((state) => state.auth);
  const userId = params.userId;
  const groupId = params.groupId;


  // handling typing events
  const handleTyping = useCallback(({ message, from }) => {
    const typing = document.querySelector(`#user-${from}`).firstChild.firstChild
      .lastChild;
    const istypingTextPresent = document.querySelector(
      `#user-${from} .typing-text`
    );
    const typingText = document.createElement("span");
    typingText.className = "typing-text text-xs text-green-500 mt-2";

    // handle typing and typing text
    if (message.length === 0) {
      setisTyping(false);
      settypingUserId(null);
      typing.removeChild(typing.lastChild);
    } else {
      settypingUserId(from);
      setisTyping(true);
      if (istypingTextPresent === null) {
        typingText.textContent = "Typing..";
        typing.append(typingText);
      }
    }
  }, []);

  // handle Group Typing
  const handleGroupTyping = useCallback((typing) => {
    const { groupId, message, value } = typing;
    const currentGroup = document.getElementById(`group-${groupId}`).lastChild;
    if (message.length === 0) {
      currentGroup.textContent = "";
    } else {
      currentGroup.textContent = value;
    }
  }, []);

  // handle disconnection
  const onDisconnect = useCallback(() => {
    console.log("server is disconnected...");
  }, []);


  // all the socket event listener will be called here
  useEffect(() => {
       
        console.log("socket connected" , socket.connected);
        console.log(socket.id);

        const sessionID = localStorage.getItem("sessionID");
        if (sessionID) {
            socket.auth = { sessionID };
            console.log("reconnect");
            socket.connect();
        }

           // session of persitent connection
        socket.on("socket-session", (sessionID) => {
        socket.auth = { sessionID };
          // store it in the localStorage
          localStorage.setItem("sessionID", sessionID);
        });

      
        // user online status
        socket.on("user online", (data) => {
          dispatch(setUserStatus(data));
        });

      // connection all the groups and individual client
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
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect");
      socket.off("disconnect", onDisconnect);
      socket.off("individual typing", handleTyping);
      socket.off("group typing", handleGroupTyping);
      socket.off("user online");
    };
  }, [user, handleTyping, handleGroupTyping, onDisconnect, dispatch]);

  // -------------------------fetch mesage-----------------
  // fetch messages
  useEffect(() => {
    if (userId) {
      dispatch(fetchMessage(userId));
    }
  }, [dispatch, userId,refresh]);

  // fetch group by curresponded id
  useEffect(() => {
    if (groupId && myGroups.length !== 0) {
      dispatch(getGroupById({ groupId: groupId }));
      dispatch(resetUsersState());
    }
  }, [groupId, dispatch, myGroups]);

  // reset group State
  // get current selected user
  useEffect(() => {
    if (userId && data) {
      dispatch(currentUser({ data, userId: userId }));
      dispatch(resetGroupState());
      const current = document.getElementById(`user-${userId}`);
      if(current) {
        current.classList.add('active');
      }
    }
  }, [dispatch, userId, data]);

  // check jwt expiraction
  // remove token from localStorage
  useEffect(() => {
    if (isJwtExpired()) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      window.location.reload();
    }
  }, []);

  // fetch profile
  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch, isUploaded]);
  
  // props
  const SideNavProps = {
    refresh,
    setRefresh,
    setOpen,
    close,
    setClose
  }
 
// outlet props
 const outletProps = [
  setClose,
  isTyping,
  setisTyping,
  typingUserId,
  settypingUserId,
]
  return (
    <div className="home">
      {/* create group modal box */}
      <CreateGroup open={open} setOpen={setOpen} />
      <main>
        <Sidenav {...SideNavProps} />
        <Outlet context={[...outletProps]} />
      </main>
    </div>
  );
}

export default Home;
