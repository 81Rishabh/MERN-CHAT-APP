import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { socket } from "../../socket";
import { isNewGroupCreated } from "../Feature/groupSlice";

function Notifications() {
  const [openNotification, setOpenNotication] = useState(false);
  const [notifications, setNotications] = useState([]);
  const dispatch = useDispatch();

  const handleNofication = useCallback(
    (data) => {
      let newNofication = `${data.admin.username} is added you in ${data.groupName}`;
      setNotications((prevNotification) => {
        return [...prevNotification, newNofication];
      });
      dispatch(isNewGroupCreated());
    },
    [dispatch]
  );

  useEffect(() => {
    socket.on("group connection", handleNofication);
    return () => {
      socket.off("group connection", handleNofication);
    };
  }, [handleNofication]);

  const deleteNotification = (id) => {
    setNotications(prev => {
       if(prev.length > 0) {
         return prev.filter((_, index) => index !== id)
       }
    })
  }

  return (
    <div className="relative">
      <div className="relative cursor-pointer" onClick={() => setOpenNotication(!openNotification)}>
        <svg
          width="23"
          height="23"
          fill="lightgrey"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          
        >
          <path d="M12 2.4a7.2 7.2 0 0 0-7.2 7.2v4.303l-.848.849A1.2 1.2 0 0 0 4.8 16.8h14.4a1.201 1.201 0 0 0 .848-2.048l-.848-.849V9.6A7.2 7.2 0 0 0 12 2.4Zm0 19.2A3.6 3.6 0 0 1 8.4 18h7.2a3.6 3.6 0 0 1-3.6 3.6Z"></path>
        </svg>
       {
        notifications.length > 0 && (
          <span className="flex h-3 w-3 absolute -top-1 right-0">
          <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
          </span>
        )
       }
      </div>
     
      <div
        className={`${
          openNotification ? "opacity-100 z-50" : "opacity-0 -z-10"
        } w-96 h-96  transition duration-50 ease-in overflow-hidden bg-zinc-800 absolute md:top-8 right-0 md:left-0 shadow-md rounded-md p-5`}
      >
        <div>
          <h3 className="text-white font-semibold">Notification</h3>
        </div>
        <div className="mt-3 py-2 relative">
          <ul className="h-full">
            {notifications.length > 0 ? (
              notifications.map((notification, idx) => {
                return (
                  <li
                    key={idx}
                    className="flex justify-between items-center py-3 px-2 hover:bg-[#303033] border border-[#303033] hover:shadow-md transition duration-100 ease-in mb-1  rounded-md border-b-1 text-gray-100 hover:text-zinc-100 duration-100 transition cursor-pointer text-sm"
                  >
                    <Link to="/" className="truncate">
                      {notification}
                    </Link>
                    <svg width="20" height="20" fill="#9f9d9d" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" onClick={() => deleteNotification(idx)}>
                       <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z"></path>
                    </svg>
                  </li>
                );
              })
            ) : (
              <p className="mt-24 text-zinc-600 text-center">
                There is No Notification for you
              </p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Notifications;
