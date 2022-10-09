import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import {validateRoomToken} from './JWT.js';
import {getChatroom} from './controller/user.js';
import userRoutes from './routes/user.js';
import chatRoutes from './routes/chatroom.js';
import {checkRoom} from './controller/chatroom.js';
import {SERVERPORT,MONGODB,CLIENTURI} from './config.js';

const app = express();

app.use(bodyParser.json({limit:"20mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"20mb",extended:true}));
app.use(cors());
app.use(express.json());

app.use('/user',userRoutes);
app.use('/chatroom',chatRoutes);

mongoose.connect(MONGODB)
	.then(()=> console.log('Connected to Database Server'))
	.catch(error => console.error(error));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: CLIENTURI,
    methods: ["GET", "POST"],
  },
});

global.users =new Map();

io.on("connection", (socket) => {

  validateRoomToken(socket.handshake.auth).then(decode =>{
    if (users.has(socket.id)) {
      users.delete(socket.id);
    }    
    checkRoom(decode.roomid).then(result=>
    {
      if (result) {
      users.set(socket.id,decode.id);
      socket.join(decode.roomid);
      socket.to(decode.roomid).emit("receive_message", {room:decode.roomid,author:decode.username,system:true,message:'joined'});
      } else {
      //socket.join(socket.id);
      socket.to(socket.id).emit("receive_message", {room:decode.roomid,author:decode.username,leave:false,message:'Chat Abandoned'});
      //socket.leave(socket.id);
    }})
    })


  socket.on("send_message", (data) => {
    validateRoomToken(data.auth).then(decode => {
      if (decode) {
        socket.to(decode.roomid).emit("receive_message", {room:decode.roomid,author:decode.username,message:data.message,time:data.time});
      } 
    })
  });

  socket.on("leave", (data) => {
    validateRoomToken(data.auth).then((decode) => {
      if (decode) {
      socket.to(decode.roomid).emit("receive_message", {room:decode.roomid,author:decode.username,system:true,message:'leave'});
      socket.leave(decode.roomid);
    }
    } ) } );

  socket.on("disconnect", async () => {
    if (users.has(socket.id)){
      let username = users.get(socket.id);
      getChatroom(username).then(result => {
        if (result) {
          socket.to(result.name).emit("receive_message", {room:result.name,author:result.username,system:true,message:'leave'});
          socket.leave(result.name);
        }}
        )
      users.delete(socket.id);    
    }
  });
});


server.listen(SERVERPORT, () => {
  console.log("Server Running");
});