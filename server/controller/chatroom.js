import chatroomModel from "../models/chatroom.js"
import validateSchema from '../validation/chat.js';
import {createRoomtoken} from '../JWT.js';

export const createRoom = async (req,res,next) => {
    if (req.authenticated && req.body.name) {
        let data = req.body.password ? {idName:req.body.name,isPassword:true,password:req.body.password} : {idName:req.body.name,isPassword:false};
        validateSchema.validateAsync(data)
        .then( () => {
            chatroomModel.findOne({idName:data.idName}).exec().then((results) => {
                if (!results) {
                    const chatRoom = new chatroomModel(data);
                    chatRoom.save()
                    .then((result)=> {
                        if (result) {
                            const token = createRoomtoken({username:req.username,_id:req._id,roomid:data.idName});
                            req.token = token;
                            req.isAdmin = true;
                            return next(); 
                        }
                    })
                    .catch(error => {res.status(404).json({message:"Sorry chatname already reserved."})})
                } else {
                    res.status(404).json({message:"Sorry chatname already reserved."})
                }
            })
            .catch(error => {res.status(404).json({message:"Unknown Problem"})})
    })
        .catch(error => {res.status(404).json({message:error.message})})
    }
}

export const joinRoom = async (req,res,next) => {
    if (req.authenticated && req.body.name) {
        let data = req.body.password ? {idName:req.body.name,isPassword:true,password:req.body.password} : {idName:req.body.name,isPassword:false};
        validateSchema.validateAsync(data)
        .then(() => {
            chatroomModel.findOne({idName:data.idName}).exec().then((results) => {
                if (results) {
                    req.token = createRoomtoken({username:req.username,_id:req._id,roomid:results.idName});
                    req.isAdmin = false;
                    if (results.isPassword && data.isPassword) {
                        if ( results.password === data.password) {
                            return next();
                        } else {
                            res.status(404).json({message:"Password Mismatch"});
                            return
                        }
                    } else if (!results.isPassword && !data.isPassword) {
                        return next(); 
                    } else if (results.isPassword && !data.isPassword) {
                        res.status(200).json({message:"Password Needed",needPass:true});
                        return
                    }
                } else {
                    res.status(404).json({message:"Sorry Chatroom NotFound"})
                }
            })
            .catch(error => {res.status(404).json({message:"Unknown Problem"})})
    })
        .catch(error => {res.status(404).json({message:error.message});return})
    }
}

export const exitRoom =  async (req,res) => {
    chatroomModel.findOneAndRemove({idName:req.name}).exec().then((response)=> {
    res.status(200).json({message:"Admin Leaved room"});}
    ).catch(err=>console.log(err))
}

export const checkRoom = async (name) => {
    return await chatroomModel.findOne({idName:name}).exec().then((result)=> {
        if (result) {
            return true;
        }
        return false;
    }).catch(()=>{return false})
}

