import { Schema, model } from "mongoose";


const userSchema = new Schema({
    userName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    gender : {
        type : String,
        enum : ['male', 'fmale'],
        default : 'male'
    },
    isDeleted : {
        type : Boolean,
        default : false
    },
    profilePic : String,
    coverPic : Array,
    confirmEmail : {
        type : Boolean,
        default : false
    }
}, {
    timestamps : true
})

const userModle = model('User', userSchema)
export default userModle