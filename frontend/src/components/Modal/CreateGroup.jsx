import React, { useState } from "react";
import groupLogo from "../../assets/group (1).png";
import Users from "./Users";
import { useDispatch, useSelector } from "react-redux";
import { saveGroupInDB  } from "../Feature/groupApi";
import "./createGroup.scss";
import { socket } from "../../socket";


function CreateGroup(props) {
  const [groupName, setgroupName] = useState("");
  const [users, setusers] = useState([]);
  const [showUsers, setshowUsers] = useState(false);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const onGroupConnectedNofication = () => {
      users.forEach((user) => {
        // send notification
        socket.emit("group connection", {
            groupName,
            user,
            admin: {
              _id : auth ? auth.user._id : '',
              username : auth ? auth.user.username : '',
            },
            users,
         });
      });
  };  

  //   hanlidng create group form
  const handleCreateGroupform = (e) => {
    e.preventDefault();
    //  get Userid from localstorage this would group admin
    const groupAdmin = localStorage.getItem("userId");

    // ending data objects
    const data = { groupName, users, groupAdmin };

    // dispatch an action for creating group
    dispatch(saveGroupInDB(data));

    onGroupConnectedNofication();

    // reset fields
    setgroupName("");
    setusers([]);
    
    // close modal
    close();
  };



  //   handle focus
  const handleFocus = (e) => {
    e.preventDefault();
    setshowUsers(true);
  };

  //   handle backdrop appearance
  const handleModalShowHide = function () {
    close();
  };

  // handle modal close
  function close() {
      props.setOpen(false);
      setshowUsers(false);
      setgroupName("");
      setusers([]);
  }

  return (
    <React.Fragment>
      <div
        className={`${
          !props.open ? "hidden" : "block"
        } backdrop blur-sm transition-all ease-linear transition ease-out duration-200`}
        onClick={handleModalShowHide}
      />

      <div
        className={`w-11/12 sm:w-9/12 lg:w-1/3 create__group__modal py-5 animation-[translateFromY_1s_ease-in_infinite] ${
          !props.open ? "hidden" : "block"
        }`}
      >
        <div className="modal__header">
          <div className="group__logo">
            <img src={groupLogo} alt="group__logo" width="100%" />
          </div>
          <h3 className="modal__title">Create Group</h3>
          <div className="modal__close" onClick={handleModalShowHide}>
            <svg
              width="23"
              height="23"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z"></path>
            </svg>
          </div>
        </div>
        <div className="body">
          <form className="modal__form" onSubmit={handleCreateGroupform}>
            <div className="form__group">
              <label>Group Name</label>
              <div>
              <input
                 type="text"
                 placeholder="Enter Group Name"
                 value={groupName}
                 onChange={(e) => setgroupName(e.target.value)}
                 className="w-full py-3 placeholder:text-xs text-gray-200 text-sm placeholder:font-medium placeholder:text-zinc-600 px-2 text-zinc-700 border-transparent rounded-md mt-1 bg-zinc-800 focus:outline focus:outline-zinc-600 transition-all duration-100 shadow-md"
              />
              </div>
            </div>
            <div className="form__group rounded-md">
              <label>Search Users</label>
              <div className="form__control bg-zinc-800 rounded-md">
                <input
                  type="text"
                  placeholder="Search Users.."
                  // onChange={hanldeSearchUsers}
                  className="w-full py-3 placeholder:text-xs text-gray-200 text-sm placeholder:font-medium placeholder:text-zinc-600 px-2 text-zinc-700 border-transparent rounded-md mt-1 bg-transparent outline-none transition-all duration-100 shadow-md"
                  onFocusCapture={handleFocus}
                />
                <svg
                  width="20"
                  height="20"
                  fill="#a3a3a3"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ cursor: "pointer", opacity: showUsers ? "1" : "0" }}
                  onClick={() => setshowUsers(false)}
                >
                  <path
                    fillRule="evenodd"
                    d="M5.152 5.152a1.2 1.2 0 0 1 1.696 0L12 10.303l5.152-5.151a1.2 1.2 0 1 1 1.696 1.696L13.697 12l5.151 5.152a1.2 1.2 0 0 1-1.696 1.696L12 13.697l-5.152 5.151a1.2 1.2 0 0 1-1.696-1.696L10.303 12 5.152 6.848a1.2 1.2 0 0 1 0-1.696Z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>

              <Users showUsers={showUsers} setusers={setusers} />

              <div className="profile_upload mt-3">
                <label>Profile Picture</label>
                <button className="bg-zinc-700 mt-1 text-sm border border-gray-600 hover:bg-zinc-800 hover:border-indigo-500 transition-all duration-100 flex items-center justify-between px-3 py-2 rounded-md shadow-md cursor-pointer">
                  <svg
                    width="20"
                    height="20"
                    fill="#f7f7f7"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9 16.5h6v-6h4l-7-7-7 7h4v6Zm3-10.17 2.17 2.17H13v6h-2v-6H9.83L12 6.33ZM5 18.5h14v2H5v-2Z"></path>
                  </svg>
                  <span className="ml-2">Upload</span>
                </button>
              </div>
            </div>
            <button type="submit">Create Group</button>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
}

export default CreateGroup;
