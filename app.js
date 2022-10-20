import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import * as indexRouter from './modules/index.router.js'
import connectDB from './DB/connection.js';
const app = express()
app.use(express.json())
const port = 3000
app.use(`${process.env.BASEURL}/uploads`, express.static("./uploads"))
app.use(`${process.env.BASEURL}/auth`,indexRouter.authRouter)
app.use(`${process.env.BASEURL}/user`,indexRouter.userRouter)
app.use(`${process.env.BASEURL}/blog`,indexRouter.blogRouter)
app.use('*', (req, res) => res.status(404).json({message : '404 In-valid Routing'}))
connectDB()
app.listen(port, ()=>{
    console.log(`server is running........at ${port}`);
})