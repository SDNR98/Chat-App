import mongoose from 'mongoose';

const userSchema = mongoose.Schema ({
    userName: {
        type: String,
        unique: true
    },
    password: String,
    chatId: {
        name : String,
        isAdmin : Boolean
    }
});

const userModel = mongoose.model('user',userSchema);

export default userModel;