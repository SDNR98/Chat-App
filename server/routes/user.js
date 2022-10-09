import express from 'express';
import {regUser,userChatroom,checkUser,leavechatroom} from '../controller/user.js';
import {exitRoom} from '../controller/chatroom.js';
import { validateToken,validateChatroomToken } from '../JWT.js';

const userRoutes = express.Router();

userRoutes.post('/reg',regUser);
userRoutes.post('/leave',validateChatroomToken,leavechatroom,exitRoom);
userRoutes.post('/login',checkUser);
userRoutes.post('/get',validateToken, userChatroom); 


export default userRoutes;