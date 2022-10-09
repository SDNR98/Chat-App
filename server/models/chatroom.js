import mongoose from 'mongoose';

const chatroomSchema = mongoose.Schema ({
        idName:{
            type:String,
            require:true,
            unique: true
            },
        isPassword : Boolean,
        password: {
            type: String,
        }   
    }
    );

const chatroomModel = mongoose.model('room',chatroomSchema);

export default chatroomModel;