import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { profile_upload } from "../../pages/Auth/feature/api/authApi";
import { useNavigate } from "react-router-dom";
import Avatar from "../Avatar/Avatar";

function Profile({ open }) {
  const { user, loading } = useSelector((state) => state.auth);
  const [file, setfile] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //  handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("avatar", file);
    dispatch(profile_upload(formData));
    setfile(null);
  };

  // handle profile upload
  const handleProfileUpload = (e) => {
    setfile(e.target.files[0]);
  };

  // handle logout
  const Logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    navigate("/SignIn");
  };

  return (
    <div
      className={`${
        !open ? "w-0 h-0 hidden" : "w-auto h-auto block p-5"
      } transition-all duration-75 ease-in-out duration-200  overflow-hidden bg-zinc-800 absolute top-0 left-12 shadow-md rounded-md p-5`}
    >
      <h3 className="text-md  font-medium border-bottom divide-y  mb-2 divide-current text-gray-300">
        Profile
      </h3>
      <div className="flex items-start justify-start my-4 w-full">
        <form
          className="opacity-70 hover:opacity-100 transition duration-300 relative flex flex-col items-center"
          onSubmit={handleSubmit}
        >
          <label htmlFor="profile_image" title="choose a file">
            <Avatar w="100" h="100" imgURL={user.profile_img} />
          </label>
          <input
            type="file"
            id="profile_image"
            className="hidden"
            onChange={handleProfileUpload}
          />
          <button
            className={`my-3 bg-gray-700 p-3 rounded-md text-sm flex items-center ${
              !file ? "hidden" : "block"
            }`}
            type="submit"
          >
            {loading && (
              <div className="w-5 h-5 rounded-full border-4 border-t-gray-600 border-gray-200 mr-2 animate-[spin_1s_ease-in-out_infinite]"></div>
            )}
            Upload
          </button>
        </form>
        {user && (
          <div className="ml-4 w-40 grow">
            <h2 className="text-lg font-bold my-2">{user.username}</h2>
            <p className="text-xs italic font-light text-gray-400">
              {user.email}
            </p>
            <button
              onClick={Logout}
              className="my-3 bg-gray-700 p-2 rounded-md text-sm flex items-center text-xs opacity-60 hover:opacity-100 hover:scale-95"
            >
              <span>
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="#9f9d9d"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m17 16 4-4m0 0-4-4m4 4H7m6 4v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1"></path>
                </svg>
              </span>
              <span className="ml-1 text-white">Logout</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
