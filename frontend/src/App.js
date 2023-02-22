import React from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PrivateRoutes } from "./utils/PrivateRoutes";
import SignIn from "./pages/Auth/Form/SignIn";
import SignUp from "./pages/Auth/Form/SignUp";
import Home from "./pages/Home/Home";
import ChatContainer from "./pages/Home/ChatContainer";
import "./App.css";


function App() {
  return (
    <div className="App">
      <Toaster
        toastOptions={{
          error: {
            style: {
              background: "red",
            },
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<Home />}>
              <Route path="/chat" element={<ChatContainer />} />
            </Route>
          </Route>
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/SignUp" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
