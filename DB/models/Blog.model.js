import { Schema, Types, model } from "mongoose";
const blogSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true,
    },
    pictures : Array,
    createdBy : {
        type : Types.ObjectId,
        ref : 'User',
        required : true,
    },
    likes : [{type : Types.ObjectId, ref : 'User'}],
    unlikes : [{type : Types.ObjectId, ref : 'User'}],
    totalCount : {
        type : Number,
        default : 0
    },
    video : String
}, {timestamps : true})
const blogModle = model('Blog', blogSchema)
export default blogModle