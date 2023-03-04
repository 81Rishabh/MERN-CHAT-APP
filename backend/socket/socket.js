const { Server } = require("socket.io");
const {v4:uuidv4} = require("uuid")

module.exports.chat_sockets = function (chatServer) {
  const io = new Server(chatServer, {
    pingTimeout: 60000,
    cors: {
      origin: "https://chitchat-frontend-l8g9.onrender.com",
      // origin: "http://localhost:3000",
    },
  });

  io.use((socket, next) => {
    const sessionID = socket.handshake.auth.sessionID;
    if (sessionID) {
      socket.sessionID = sessionID;
      return next();
    }
    // create new session
    socket.sessionID = uuidv4();
    next();
  });

  io.on("connection", async function (socket) {
    
    // one to one events hanlings
    one_to_one_events(socket);

    // groups events
    groups_events(socket);
    
    // diconnection acknowladge
    socket.on("disconnecting", async (reason) => {
      if (reason === "transport close") {
        let userId;
        socket.leave(socket.id);
        socket.rooms.forEach(val => {
          userId = val
        });
        socket.broadcast.emit('user online' , {id : userId, online : false});
        socket.leave(userId);
        console.log("user is disconnected");
      }
    });
  });
};

// groups events
function groups_events(socket) {
  socket.on("heartbeat", (data) => {
    console.log(data.message); // 'ping'
  });

  // user connected
  socket.on("setup", ({ user, group }) => {
    socket.join(group._id);
    console.log(
      `${user.username} is connected with ${group.groupName}` + user._id
    );
  });

  // listening group_message event
  // boradcast message all the associated groups
  socket.on("group_message", (userData) => {
    socket.to(userData.groupId).emit("message", userData);
  });

  // broadcast message to all client is conected in group
  socket.on("group connection", (data) => {
    const { user, admin } = data;
    socket.to(user).to(admin._id).emit("group connection", data);
  });

  // handle typing
  socket.on("group-typing", (indicator) => {
    socket.to(indicator.groupId).emit("group typing", indicator);
  });
}

// one to one events
function one_to_one_events(socket) { 
 
  // user connection
  socket.on("one-to-one-connection", async (userData) => {
    if (Object.keys(userData).length === 0) {
      console.log(`${userData.username} is trying to join` + userData._id);
    } else {
      socket.join(userData._id);
      console.log(
        `${userData.username} is joined in private room` + userData._id
      );
      socket.emit("socket-session", socket.sessionID);
      socket.broadcast.emit('user online' , {id : userData._id, online : true});
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
    const { to, from } = indicator;
    socket.to(to).to(from).emit("individual typing", indicator);
  });
}
