import express from 'express';
import {checkChatroom,addChatroom} from '../controller/user.js';
import {createRoom,joinRoom} from '../controller/chatroom.js';
import { validateToken } from '../JWT.js';

const chatRoutes = express.Router();

chatRoutes.post('/create',validateToken,checkChatroom,createRoom,addChatroom);
chatRoutes.post('/join',validateToken,checkChatroom,joinRoom,addChatroom);


export default chatRoutes;