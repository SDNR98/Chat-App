import jwt from 'jsonwebtoken';
import {JWT_SECRET,JWT_SECRET_ROOM} from './config.js';


const createToken =(user)=> {
    const token = jwt.sign({username:user.userName,id:user._id},JWT_SECRET,{expiresIn: 30000000});
    return token;
};

const createRoomtoken = (data) => {
    const token = jwt.sign({username:data.username,id:data._id,roomid:data.roomid},JWT_SECRET_ROOM,{expiresIn: 30000000});
    return token;
};

const validateRoomToken = async (data) => {
    if(!data.auth) {
        return false
    } else {
       return jwt.verify(data.auth,JWT_SECRET_ROOM,(error,decode) => {
            return error ? false : decode
        })
    }
}

const validateChatroomToken = async (req,res,next) => {
    if(!req.headers.token) {
        res.status(404).json({message:"Token not found"})
    } else {
       jwt.verify(req.headers.token,JWT_SECRET_ROOM,(error,decode) => {
            if (error){
                res.status(404).json({message:"Invalid Token"})
            } else {
                req.id = decode.id;
                req.name = decode.roomid;
                return next();
            }
        })
    }
}

const validateToken = async (req,res,next) => {
        const token = JSON.stringify(req.headers['token']);
        if (!token) {
            res.status(404).json({message :"No Authoriation token"});
        } else {   
            const temp_token = token.slice(1,-1)
            if (!temp_token) {
                res.status(400).json({message :"Invalid Token"})
            } else  {
                await jwt.verify(temp_token,JWT_SECRET,(error,decode)=>{
                    if (error) {
                        res.status(404).json({message :"Bad token"});
                        return;
                    }else{
                        req.authenticated = true;
                        req._id = decode.id;
                        req.username = decode.username;
                        return next();
            }
        })
    }}    
};


export {createToken,validateToken,createRoomtoken,validateRoomToken,validateChatroomToken};