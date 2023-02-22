import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo81.png";
import Avatar from "../Avatar/Avatar";
import UserLogo from "../../assets/user(1).png";
import GroupAccordion from "./GroupAccordion";
import { useSelector, useDispatch } from "react-redux";
import { getAllUsers } from "../../pages/Home/features/Users/usersApi";
import "./sidenav.scss";
import Profile from "./Profile";

function Sidenav(props) {
  const {close , setClose} = props;
  const { data } = useSelector((state) => state.User);
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  // fetch all the user
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);


  const handleSideNavbarTransform = () => {
      const width = window.innerWidth;
      if(width <= 400) {
          setClose(true);
      }
  } 

  useEffect(() => {
    const handleResize = function(e) {
      const width = e.target.innerWidth;
      if(width >= 400) {
         setClose(false);
      } 
    }
    window.addEventListener('resize' , handleResize);
    return () => window.removeEventListener('resize' , handleResize);
  },[setClose])

  return (
    <div className={`sidenav transition duration-75  ease-in-out ${close ? '-translate-x-96' : 'translate-x-0'}`}>
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
          <svg
            width="23"
            height="23"
            fill="lightgrey"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2.4a7.2 7.2 0 0 0-7.2 7.2v4.303l-.848.849A1.2 1.2 0 0 0 4.8 16.8h14.4a1.201 1.201 0 0 0 .848-2.048l-.848-.849V9.6A7.2 7.2 0 0 0 12 2.4Zm0 19.2A3.6 3.6 0 0 1 8.4 18h7.2a3.6 3.6 0 0 1-3.6 3.6Z"></path>
          </svg>

          {/* prfile avatar */}
           <div className="sidenav__profile__image relative">
              <div onClick={() => setOpen(!open)}>
                <Avatar w="35" h="35" imgURL={user.profile_img} />
              </div>

              {/* prfile info */}
              <Profile open={open}/>
           </div>
        </div>
      </header>
      <section className="sidenav__body">

        {/* Accordion */}
        <GroupAccordion />

        {/* Users */}
        <div className="users">
          <div className="heading">
            <p style={{ display: "flex", alignItems: "center" }}>
              <span>
                <img src={UserLogo} alt="user__logo" />
              </span>
              <span style={{ marginLeft: "10px", color: "lightblue" }}>
                Users
              </span>
            </p>
          </div>
          <ul className="sidenav__users divide-y divide-white">
            {data.length > 0 ?
              data.map((user) => {
                return (
                  <Link to={`chat?userId=${user._id}`} key={user._id} onClick={handleSideNavbarTransform}>
                    <li className=" p-4 mx-3  hover:bg-zinc-800 hover:shadow-md rounded-md border border-transparent hover:border-gray-700 transition-all duration-200">
                      <div className="flex items-center">
                        <Avatar w="30" h="30" imgURL={user.profile_img} />
                        <p className="username ml-3">{user.username}</p>
                      </div>
                    </li>
                  </Link>
                );
              }) : <p className="text-zinc-600 text-center text-xs">There is other recipient users</p>
            }
          </ul>
        </div>
      </section>
    </div>
  );
}

export default Sidenav;
