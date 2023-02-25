import React, { useState, useEffect } from "react";
import groupLogo from "../../assets/groupSm.png";
import Avatar from "../Avatar/Avatar";
import { useSelector, useDispatch } from "react-redux";
import { getGroups, getGroupByUserId } from "../Feature/groupApi";
import { Link } from "react-router-dom";

function Accordion({
  handleSideNavbarTransform
}) {
  const [show, setshow] = useState(false);
  const dispatch = useDispatch();
  const {loading, isCreated, isNewGroupCreated, myGroups } = useSelector(
    (state) => state.group
  );



  // fetch profile
  useEffect(() => {
    if (isCreated || isNewGroupCreated) {
      dispatch(getGroups());
      dispatch(getGroupByUserId());
    }
  }, [dispatch, isCreated, isNewGroupCreated]);

  // accrodion style
  const accordionStyle = {
    height: show ? "auto" : "0px",
    overflow: "hidden",
  };

  return (
    <div className="accordion">
      <div className="accordion__header" onClick={() => setshow(!show)}>
        <p style={{ display: "flex", alignItems: "center" }}>
          <span>
            <img src={groupLogo} alt="group__Logo" />
          </span>
          <span style={{ marginLeft: "10px", color: "lightblue" }}>Groups</span>
        </p>
        <span className="accordion__arrow">
          {show ? (
            <svg
              width="32"
              height="32"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m7.41 15.705 4.59-4.58 4.59 4.58 1.41-1.41-6-6-6 6 1.41 1.41Z"></path>
            </svg>
          ) : (
            <svg
              width="32"
              height="32"
              fill="#fff"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41Z"></path>
            </svg>
          )}
        </span>
      </div>
      <div
        className="accordion__body transition-all ease-in-out duration-300"
        style={{ ...accordionStyle }}
      >
        <div className="groups">
          <ul className="sidenav__groups">
            {loading ? (
              <div
                className={`circle w-6 h-6 border-4 border-zinc-600 border-t-gray-400 animate-spin rounded-full mx-auto`}
              />
            ) : myGroups === undefined || myGroups.length === 0 ? (
              <li className="text-zinc-600 text-xs text-center">
                No Group is Created
              </li>
            ) : (
              myGroups.map((group) => {
                return (
                  <Link to={`chat?groupId=${group._id}`} key={group._id} onClick={() => handleSideNavbarTransform()}>
                    <li
                      className="sidenav__groups__items p-3 mx-2 hover:bg-zinc-800 hover:shadow-md border border-transparent hover:border-zinc-700 transition-all duration-200 rounded-md"
                      id={group._id}
                    >
                      <div className="flex justify-start items-center">
                        <Avatar w="20" h="20" imgURL={group.profile_img} />
                        <p className="ml-3">{group.groupName}</p>
                      </div>
                      <p className="typing-text"></p>
                    </li>
                  </Link>
                );
              })
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Accordion;
