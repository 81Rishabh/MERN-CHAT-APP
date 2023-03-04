import React, {useRef } from 'react';
import { useSelector } from "react-redux";
import Avatar from "../Avatar/Avatar";

function Users(props) {
  const { data } = useSelector((state) => state.User);
  const panelRef = useRef();


  // handle select users
  const handleSelectUser = (event , USER_ID) => {
      const isChecked = event.target.checked;
      props.setusers(prev => {
          return isChecked ? [...prev , USER_ID] : prev.filter(user => user !== USER_ID);
      });
  }

  

  return (
    <div
      className="Users transition-all ease-in-out duration-300 relative"
      style={{
        maxHeight : props.showUsers ? `${panelRef.current !== null ? panelRef.current.scrollHeight : 100}px` : "0px",
        overflow : 'hidden'
      }}
      ref={panelRef}
    >
      <ul>
        {data &&
          data.map((user) => (
            <li className="users__items" key={user._id}>
              <div className="users__items__left">
                <Avatar w="25" h="25" imgURL={user.profile_img} />
                <p className="username">{user.username}</p>
              </div>
              <div className="user__item__right checkboxes">
                <input
                  type="checkbox"
                  name="user"
                  onChange={(e) => handleSelectUser(e,user._id)}
                />
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default Users;
