import React, { useState , useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch , useSelector } from "react-redux";
import { signUp } from "../feature/api/authApi";
import {reset} from '../feature/authSlice';
import "../style/formStyle.scss";


function SignUp() {
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [conform_password, setconform_password] = useState("");
  const { isRegistered} = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  

  // hanldeSubmit
  function handleSubmit(e) {
    e.preventDefault();
    const credentials = { username, email, password, conform_password };
    dispatch(signUp(credentials));
    // reset input value
  }
  
   useEffect(() => {
      if(isRegistered) {
         navigate("/SignIn");
      }
      dispatch(reset());
   },[isRegistered , dispatch , navigate])

  return (
    <div className="container w-96 bg-white absolute top-2/4 left-2/4 left-50 py-5 rounded-md -translate-y-2/4 -translate-x-2/4">
      <div className="card">
      <h1 className="text-2xl text-center font-bold text-indigo-500">SignUp</h1>
          <form onSubmit={handleSubmit} className="flex flex-col px-4 py-3 w-11/12 m-auto">
            <div className="form-group">
              <label className="font-semibold text-gray-500">Userename</label>
              <br />
              <input
                type="text"
                placeholder="Enter your username"
                required
                value={username}
                onChange={(e) => setusername(e.target.value)}
                className="w-full my-2 bg-gray-50 outline outline-offset-2 outline-2 outline-gray-300 p-2 rounded-md shadow-sm focus:outline-indigo-500 transition-all duration-200"
              />
              <br />
            </div>
            <div className="form-group">
              <label className="font-semibold text-gray-500">Email</label>
              <br />
              <input
                type="text"
                placeholder="Enter your email address"
                value={email}
                required
                onChange={(e) => setemail(e.target.value)}
                className="w-full my-2 bg-gray-50 outline outline-offset-2 outline-2 outline-gray-300 p-2 rounded-md shadow-sm focus:outline-indigo-500 transition-all duration-200"
              />
              <br />
            </div>
            <div className="form-group">
              <label className="font-semibold text-gray-500">password</label>
              <br />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                required
                onChange={(e) => setpassword(e.target.value)}
                className="w-full my-2 bg-gray-50 outline outline-offset-2 outline-2 outline-gray-300 p-2 rounded-md shadow-sm focus:outline-indigo-500 transition-all duration-200"
              />
              <br />
            </div>
            <div className="form-group">
              <label className="font-semibold text-gray-500">conform password</label>
              <br />
              <input
                type="password"
                placeholder="Re-Enter password"
                required
                value={conform_password}
                onChange={(e) => setconform_password(e.target.value)}
                className="w-full my-2 bg-gray-50 outline outline-offset-2 outline-2 outline-gray-300 p-2 rounded-md shadow-sm focus:outline-indigo-500 transition-all duration-200"
              />
              <br />
            </div>
            <button type="submit" className="bg-indigo-500 w-full py-3 mt-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-md shadow-md cursor-pointer hover:scale-95 transition duration-100" disabled={(!email && !password) ? true : false} style={{
              opacity: (!email && !password) ? '.6' : '1'
            }}>
              continue with email
            </button>
          </form>
          <div className="footer text-center">
            <p className="footer-left-text text-gray-500">
              Don't have an account <Link to="/SignIn" className="text-indigo-700 font-medium">SignIn</Link>
            </p>
          </div>

      </div>
    </div>
  );
}

export default SignUp;
