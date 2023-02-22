import React, { useState , useEffect } from "react";
import { Outlet } from "react-router-dom";
import CreateGroup from "../../components/Modal/CreateGroup";
import Sidenav from "../../components/Sidenav/Sidenav";
import { useDispatch , useSelector } from "react-redux";
import { getProfile } from "../Auth/feature/api/authApi";
import {isJwtExpired} from '../../utils/jwtExpiraction';
import { useLocation } from "react-router-dom";
import { getQueryParams } from "../../utils/getQueryParams";
import { currentUser, resetUsersState } from "./features/Users/usersSlice";
import { fetchMessage } from "./features/Users/usersApi";
import {
  getGroupById,
  resetGroupState,
} from "../../components/Modal/feature/groupSlice";


function Home() {
  const [open, setOpen] = useState(false);
  const [close , setClose] = useState(false);
  const dispatch = useDispatch();
  const loc = useLocation();
  const params = getQueryParams(loc);
  const groupId = params.groupId;
  const userId = params.userId;
  const { groups,isCreated } = useSelector((state) => state.group);
  const { data , isSelected } = useSelector((state) => state.User);
  const { isUploaded } = useSelector((state) => state.auth);

  // fetch group by curresponded id
  useEffect(() => {
    if (Object.keys(params)[0] === "groupId" && groups.length > 0) {
      dispatch(getGroupById({ groups, groupId: groupId}));
      dispatch(resetUsersState());
    }
  }, [params, groupId, dispatch, groups]);
  
  useEffect(() => {
    if (Object.keys(params)[0] === "userId" && data.length > 0) {
      // get current selected user
      dispatch(currentUser({ data, userId: userId }));

      // reset group State
      dispatch(resetGroupState());
    }
  }, [params, userId, dispatch, data]);

  useEffect(() => {
     if(isSelected && userId) {
       console.log("Message rendered....")
       dispatch(fetchMessage(userId));
     }
  },[dispatch,isSelected,userId])

  // check jwt expiraction
  useEffect(() => {
     if(isJwtExpired()) {
        // remove token from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.reload();
     }
  },[]);

  // fetch profile
  useEffect(() => {
    dispatch(getProfile());
  },[dispatch,isCreated,isUploaded]);


  return (
    <div className="home">
      {/* create group modal box */}
      <CreateGroup open={open} setOpen={setOpen} />

      {/* main container */}
      <main>
        {/* sidenav */}
        <Sidenav setOpen={setOpen} close={close} setClose={setClose} />
        <Outlet context={[setClose]}/>
      </main>
    </div>
  );
}

export default Home;
