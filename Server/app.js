const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const socket = require("socket.io");

const { serverLogger } = require("./logs/winston");

const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");

const config = require("./config/config");

const PORT = process.env.PORT;

const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

mongoose
  .connect(process.env.MONGO_URL, {})
  .then(() => {
    serverLogger.info("DB_Connected!!");
  })
  .catch((err) => serverLogger.error(err.message));

const server = app.listen(PORT, () => {
  serverLogger.info("Server_Start");
});

const io = socket(server, {
  cors: {
    origin: config.origin,
    credentials: true,
  },
});

global.onlineUsers = new Map();
// 변수 또는 전체 전역으로 사용하는 방법

io.on("connection", (socket) => {
  // on : 현재 접속해 있는 클라이언트로부터 메시지를 수신하는 코드
  // connection : 기본으로 발생하는 이벤트로 사용자가 웹사이트에 접속하면 발생한다.
  global.chatSocket = socket;

  socket.on("add-user", (userId) => {
    // Client의 Char에 보면 add-user를 emit하게 되고 이를 저장하게 된다.
    console.log(userId);
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    // Clinet의 ChatContain을 확인하면 메시지를 보내게 된다.
    console.log(data);
    const sendUserSocket = onlineUsers.get(data.to);

    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", data.msg);
      // emit은 특정 클라이언트에게 메시지를 전송하는 것을 의미합니다.
      // 이떄 to가 없다면 모든 클라이언트에게 메시지를 전송하게 됩니다.
    }
  });
});
