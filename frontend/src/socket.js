import {io} from 'socket.io-client';
// const ENDPOINT = 'http://localhost:8080';
const ENDPOINT = 'https://chitchat-nio0.onrender.com';

export const socket = io(ENDPOINT , {
    autoConnect : false
});


socket.onAny((event, ...args) => {
  console.log(`got ${event}`);
});

const tryReconnect = () => {
    setTimeout(() => {
      socket.io.open((err) => {
        if (err) {
          tryReconnect();
        }
      });
    }, 2000);
}
  
  socket.io.on("close", tryReconnect);  
