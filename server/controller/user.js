import bcrypt from 'bcrypt';
import userModel from "../models/user.js";
import adduserSchema from '../validation/login.js';
import {createToken,createRoomtoken} from '../JWT.js';

const saltrounds = 5;

export const regUser = async (req,res) => {
    const user = req.body;
    try{
        const result = await adduserSchema.validateAsync(user);
        bcrypt.hash(user.password,saltrounds).then((hash)=>{
            try {
                const newUser = new userModel({
                    userName : user.userName,
                    password : hash
                });
                newUser.save().then((result)=>{
                    const token = createToken(result);
                    res.status(200).json({message:"Registration Sucessfull",token:token,username:user.userName});
                }).catch(err => res.status(404).json({message:"Username Exist",}));
            } catch (error) {
                res.status(404).json({message: error.message});
             }     
        }).catch((error)=> {console.log(error);}
        )   
    } catch (error){
        res.status(404).json({message:error.message});
    }
   
}; 


export const checkUser = async (req,res) => {
    const user = req.body;
    try{
        const result = await adduserSchema.validateAsync(user);
        const pass = user.password;
        userModel.findOne({userName:user.userName}).exec().then((user)=>{
            if(!user){
                res.status(404).json({message:"wrong username"});
                return;
                }
            bcrypt.compare(pass, user.password)
                .then((result)=>{
                    if (result) {
                        const token = createToken(user);
                        res.status(200).json({"token":token,message:"Sucessfully Loged",username:user.userName});
                    }
                    else{
                        res.status(404).json({message:"Wrong password"});
                    }
                    })
                .catch((err)=>{
                    res.status(404).json({message:"Internal Error"});
                })}).catch((err)=>{res.status(404).json({message:"Unknown Error"})});
     }
     
    catch (error){
        res.status(404).json({message:error.message});
        return;
    } 
};



export const checkChatroom = async (req,res,next) => {
    userModel.findOne({_id:req._id},{chatId:1}).exec()
    .then(results => {
        if (results.chatId.name){
            res.status(404).json({message:"Already in a room"})
        } else {
            return next();
        }
    })
    .catch(err => res.status(404).json({message:"Something wrong"}))
}

export const addChatroom = async (req,res) => {
    await userModel.updateOne({_id:req._id},{
        $set:{
            chatId:{
                name:req.body.name,
                isAdmin:req.isAdmin
            }
        }
    }).exec()
    .then(results=> {
        res.status(200).json({message:"success",token:req.token,roomname:req.body.name});})
    .catch(err => res.status(404).json({message:"Something wrong"}))
}

export const leavechatroom = async (req,res,next) => {
    await userModel.findOne({_id:req.id}).exec().then(result => {
        if (result && result.chatId.isAdmin){
            userModel.updateOne({_id:req.id},{
                $unset : {chatId:""}
            }).then((response)=>{
                return next();
                
            }).catch();
            
            
        } else if (result && !result.chatId.isAdmin) {
            userModel.updateOne({_id:req.id},{
                $unset : {chatId:""}
            }).then(()=>{
                res.status(200).json({message:"Leaved room",});
            }).catch();
            
        } else {
            res.status(404).json({message:"No user Found",})
        }
    }
    )
}

export const getChatroom = (id) => {
    
    return userModel.findOne({_id:id},{chatId:1,userName:1}).exec()
    .then(results => {
        if (results.chatId.name){
           return  {name:results.chatId.name,username:results.userName};
        } else {
           return  false;
        }
    })
    .catch(()=> {return  false})
}

export const userChatroom = (req,res) => {
    if (req._id) {
        userModel.findOne({_id:req._id}).exec()
        .then((result)=>{           
            if(result.chatId.name){
                const token = createRoomtoken({username:result.userName,_id:result._id,roomid:result.chatId.name});
                res.status(200).json({token:token,roomname:result.chatId.name});
            } else {
                res.status(404).json({message:"failed"});
            }
        })
        .catch()
    }
}
