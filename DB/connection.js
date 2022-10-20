import mongoose from "mongoose";

const connectDB = async()=>{
    return await mongoose.connect(process.env.DBURI).then(()=>{
        console.log(`ConnectDB........ at ${process.env.DBURI}`);
    }).catch((err)=>{
        console.log('fail to ConnectDB', err);
    })
}
export default connectDB