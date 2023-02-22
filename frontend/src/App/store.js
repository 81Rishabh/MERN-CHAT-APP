import {configureStore} from '@reduxjs/toolkit';
import usersSlice  from '../pages/Home/features/Users/usersSlice';
import grouMessageSlice  from '../pages/Home/features/Group/messageSlice';
import authSlice  from '../pages/Auth/feature/authSlice';
import groupSlice from '../components/Modal/feature/groupSlice';
import messageSlice from '../pages/Home/features/OneToOne/messageSlice';

const store = configureStore({
    reducer : {
        auth : authSlice,
        User : usersSlice,
        group : groupSlice,
        group_message : grouMessageSlice,
        messages : messageSlice
    }
});

export default store;