const { Server } = require("socket.io");

module.exports.chat_sockets = function (chatServer) {
  const io = new Server(chatServer, {
    cors: {
      origin: "https://chitchat-frontend-l8g9.onrender.com",
      // origin : "http://localhost:3000"
    },
  });
  
  io.on("connection", function (socket) {
    console.log(socket.connected);
    socket.on("connection init" , ({isConnected,user}) => {
       if(isConnected && Object.keys(user).length !== 0) {
         socket.join(user._id);
         console.log(`${user.username} initial joined` + user._id);
       }
    });

    // groups events
    groups_events(socket);

    // one to one events hanlings
    one_to_one_events(socket);

    // diconnection acknowladge
    socket.on("disconnect", function (reason) {
     console.log(reason);
      console.log("socket disconnected!");
    });
  });
};

// groups events
function groups_events(socket) {
  // user connected
  socket.on("setup", ({ user, group }) => {
    socket.join(group._id);
    console.log(`${user.username} is connected with ${group.groupName}` + user._id);
  });

  // listening group_message event
  // boradcast message all the associated groups
  socket.on("group_message", (userData) => {
    socket.to(userData.groupId).emit("message", userData);
  });

 // broadcast message to all client is conected in group
 socket.on("group connection" , (data) => {
   const {user , admin} = data;
    socket.to(user).to(admin._id).emit("group connection", data)
 });
 
 
  // handle typing
  socket.on("group-typing", (indicator) => {
    socket.to(indicator.groupId).emit("group typing", indicator);
  });
}

// one to one events
function one_to_one_events(socket) {
  // user connection
  socket.on("one-to-one-connection", (userData) => {
     if(Object.keys(userData).length === 0) {
      console.log(`${userData.username} is trying to join` + userData._id);
     } else {
        socket.join(userData._id);
       console.log(`${userData.username} is joined in private room` + userData._id);
     }
  });

  // private message
  socket.on("privateMessage", ({ to, from, content, time }) => {
    // broad cast private message to userData.userId
    socket.to(to).to(from).emit("private-message", {
      content,
      from,
      to,
      time,
    });
  });

  // handle typing
  socket.on("individual-typing", (indicator) => {
    const { to, from} = indicator;
    socket.to(to).to(from).emit("individual typing", indicator);
  });
}
