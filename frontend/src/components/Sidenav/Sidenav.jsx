import React, { useEffect, useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../../assets/logo81.png";
import Avatar from "../Avatar/Avatar";
import UserLogo from "../../assets/user(1).png";
import GroupAccordion from "./GroupAccordion";
import { useSelector, useDispatch } from "react-redux";
import { getAllUsers } from "../../pages/Home/features/Users/usersApi";
import "./sidenav.scss";
import Profile from "./Profile";
import Notifications from "../Notifications/Notifications";
import { newMessageViewed } from "../../pages/Home/features/Users/usersSlice";
import { removeNavItemsActiveStyle } from "./util";

function Sidenav(props) {
  const { close, setClose } = props;
  const { data, usersFetched } = useSelector((state) => state.User);
  const auth = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [refresh , setRefresh] = useState(false);
  const dispatch = useDispatch();
  const navItemRef = useRef();
  const groupItemsRef = useRef();

  // fetch all the user
  useEffect(() => {
    dispatch(getAllUsers())
  }, [dispatch,refresh]);
  
  // handle sidebar transform
  const handleSideNavbarTransform = (userId) => {
    const width = window.innerWidth;
    if (width <= 600) setClose(true);
    dispatch(newMessageViewed(userId));
    activeClassStyle(userId);
    removeNavItemsActiveStyle(groupItemsRef);
  };
 
  // handle active class style
  const activeClassStyle = (userId) => {
    const navItems = navItemRef.current.children;
    const current = document.getElementById(`user-${userId}`);
    const itemsExceptCurrent = Array.from(navItems).filter(item => item !== current);
    itemsExceptCurrent.forEach((item) => item.classList.remove("active"));
    current.classList.add("active");
  };
  
  // handle resize
  useEffect(() => {
    const handleResize = function (e) {
      const width = e.target.innerWidth;
      if (width >= 600) setClose(false)
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setClose]);
  
  // handle refresh
  const handleRefresh = () => setRefresh(!refresh); 

  return (
    <div
      className={`sidenav bg-zinc-900 transition-all duration-50 ease-in-out ${
        close ? "-translate-x-full" : "translate-x-0"
      }`}
    >
      {/* header */}
      <header className="sidenav__header">
        <div className="navbar-logo">
          <img
            src={Logo}
            alt="chit-chat-logo"
            width="100%"
            style={{ borderRadius: "5px" }}
          />
        </div>
        <div className="sidenav__header__items">
          <button
            className="bg-zinc-700 border border-gray-600 hover:bg-zinc-800 hover:border-indigo-500 transition-all duration-100 flex items-center justify-between px-3 py-2 rounded-md shadow-md cursor-pointer"
            onClick={() => props.setOpen(true)}
          >
            <svg
              width="23"
              height="23"
              fill="none"
              stroke="lightgrey"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 5.75v12.5"></path>
              <path d="M18.25 12H5.75"></path>
            </svg>
            <span className="text-sm font-medium">New Group</span>
          </button>

          {/* Notification */}
          <Notifications />

          {/* prfile avatar */}
          <div className="sidenav__profile__image relative">
            <div onClick={() => setOpen(!open)}>
              <Avatar w="35" h="35" imgURL={auth.user.profile_img} />
            </div>

            {/* prfile info  */}
            <Profile open={open} />
          </div>
        </div>
      </header>
      <section className="sidenav__body">
        {/* Accordion */}
        <GroupAccordion
          setClose={setClose}
          groupItemsRef={groupItemsRef}
          navItemRef={navItemRef}
        />

        {/* Users */}
        <div className="users overflow-hidden">
          <div className="px-3 py-3 inline-flex items-center justify-between w-full">
            <p className="flex gap-2 items-center">
              <span>
                <img src={UserLogo} alt="user__logo" />
              </span>
              <span>
                Users
              </span>
            </p>
            <p onClick={handleRefresh}>
              <svg width="20" height="20" fill="#8f8f8f" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
               <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35Z"></path>
             </svg>
            </p>
          </div>
          <ul className="sidenav__users" ref={navItemRef}>
            {usersFetched ? (
              <li className="mx-3">
                {Array.from([1, 2, 3, 4, 5]).map((_, idx) => (
                  <div
                    className="h-16 w-full bg-zinc-800 rounded-md shadow-md mb-2 p-2 flex start"
                    key={idx}
                  >
                    <div className="w-12 h-12 rounded-full bg-zinc-900  animate-pulse"></div>
                    <div className="flex-auto flex flex-col justify-evenly ml-3">
                      <div className="w-1/2 h-3 rounded-md bg-zinc-900  animate-pulse"></div>
                      <div className="w-1/4 h-3 rounded-md bg-zinc-900  animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </li>
            ) : data.length > 0 ? (
              data.map((user) => {
                return (
                  <li
                    className={`p-4 mx-2 my-2  hover:bg-zinc-800 hover:shadow-md rounded-md  hover:border-zinc-900 transition-all duration-100`}
                    id={`user-${user._id}`}
                    key={user._id}
                    onClick={() => handleSideNavbarTransform(user._id)}
                  >
                    <NavLink to={`chat?userId=${user._id}`}>
                      <div className="left flex items-center justify-start">
                        <Avatar w="40" h="40" imgURL={user.profile_img} />
                        <div className="ml-4 flex-1">
                          <p className="username">{user.username}</p>
                          <p
                            className={`text-sm  mt-1 ${
                              user.lastMessage !== null &&
                              "isSelected" in user.lastMessage &&
                              user["lastMessage"]["isSelected"] === false
                                ? "text-zinc-100"
                                : "text-zinc-500"
                            }`}
                          >
                            {user.lastMessage && user.lastMessage.content}
                          </p>
                        </div>
                        <div className="right justify-self-end self-start text-xs text-zinc-500 flex flex-col justify-between">
                          <span>
                            {user.lastMessage && user.lastMessage.time}
                          </span>
                        </div>
                      </div>
                    </NavLink>
                  </li>
                );
              })
            ) : (
              <p className="text-zinc-600 text-center text-xs">
                There is other recipient users
              </p>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}

export default Sidenav;
