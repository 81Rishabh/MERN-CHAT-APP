import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../feature/api/authApi";
import { useDispatch, useSelector } from "react-redux";
import "../style/formStyle.scss";

function SignIn() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [password_show, setpassword_show] = useState(false);
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // check user is logged in
  useEffect(() => {
    if (authState.isLoggedIn) {
      navigate("/");
    }
  }, [authState.isLoggedIn,navigate]);

  // hanldeSubmit
  const SignInHandler = (e) => {
    e.preventDefault();
    if(email && password) {
       dispatch(login({ email, password }));
       setemail("");
       setpassword("");
    }
  };

  return (
    <div className="container w-96 bg-white absolute top-2/4 left-2/4 left-50 py-5 rounded-md -translate-y-2/4 -translate-x-2/4">
      <div className="card">
        <h1 className="text-2xl text-center font-bold text-indigo-500">Login</h1>
          <form onSubmit={SignInHandler} className="flex flex-col px-4 py-3 w-11/12 m-auto">
            <div className="form-group">
              <label className="font-semibold text-gray-500">Email</label>
              <div className="">
                <input
                type="text"
                placeholder="Enter your email address"
                value={email}
                required={true}
                onChange={(e) => setemail(e.target.value)}
                className="w-11/12 my-2 bg-gray-50 outline outline-offset-2 outline-2 outline-gray-300 p-2 rounded-md shadow-sm focus:outline-indigo-500 transition-all duration-200"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="font-semibold text-gray-500">password</label>
              <div className="flex items-center">
                <input
                  type={
                    password_show ? "text" : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                  className="my-2 mr-2 flex-1 bg-gray-50 p-2 outline outline-offset-2 outline-2  outline-gray-300 rounded-md shadow-md focus:outline-indigo-500 transition-all duration-200"
                  required={true}
                  />
                {!password_show ? (
                  <svg
                    width="20"
                    height="20"
                    fill="grey"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    className="password__show"
                    onClick={() => setpassword_show(true)}
                  >
                    <path d="M12 14.4a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8Z"></path>
                    <path
                      fillRule="evenodd"
                      d="M.55 12C2.078 7.132 6.626 3.6 12 3.6s9.922 3.532 11.45 8.4c-1.528 4.868-6.076 8.4-11.45 8.4S2.078 16.868.55 12Zm16.25 0a4.8 4.8 0 1 1-9.6 0 4.8 4.8 0 0 1 9.6 0Z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    fill="grey"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    className="password__show"
                    onClick={() => setpassword_show(false)}
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.448 2.752a1.2 1.2 0 0 0-1.696 1.696l16.8 16.8a1.2 1.2 0 0 0 1.696-1.696l-1.767-1.768A12.018 12.018 0 0 0 23.45 12C21.92 7.132 17.373 3.6 12 3.6a11.95 11.95 0 0 0-5.414 1.289L4.45 2.752h-.002Zm5.114 5.112 1.816 1.818a2.404 2.404 0 0 1 2.94 2.94l1.817 1.816a4.8 4.8 0 0 0-6.573-6.573v-.001Z"
                      clipRule="evenodd"
                    ></path>
                    <path d="M14.945 20.036 11.7 16.79a4.8 4.8 0 0 1-4.49-4.489L2.802 7.894A11.976 11.976 0 0 0 .55 12c1.528 4.868 6.078 8.4 11.45 8.4 1.016 0 2.003-.126 2.945-.364Z"></path>
                  </svg>
                )}
              </div>
            </div>
            <button type="submit" className="bg-indigo-500 w-11/12 py-2 mt-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-md shadow-md cursor-pointer hover:scale-95 transition duration-100" disabled={(!email && !password) ? true : false} style={{
              opacity: (!email && !password) ? '.6' : '1'
            }}>
              continue with email
            </button>
          </form>
          <div className="footer text-center">
            <p className="footer-left-text text-gray-500">
              Don't have an account <Link to="/SignUp" className="text-indigo-700 font-medium">SignUp</Link>
            </p>
          </div>
 
      </div>
    </div>
  );
}

export default SignIn;
