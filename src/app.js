import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"})); // to parse JSON bodies
app.use(express.urlencoded({extended:true,limit:"26kb"}));  // to parse URL-encoded bodies
app.use(express.static("public"));  // to serve static files from 'public' directory
app.use(cookieParser()); // to parse cookies



//Import Routes 

import userRoutes from "./routes/user.routes.js";
import videoRoutes from "./routes/videos.routes.js";
import tweetRoutes from "./routes/tweet.routes.js";
import commentRouter from "./routes/comment.routes.js"
import likeRouter from "./routes/like.routes.js"

//Use Routes
app.use("/api/v1/users",userRoutes);
app.use("/api/v1/videos",videoRoutes);
app.use("/api/v1/tweets",tweetRoutes);
app.use("/api/v1/comments",commentRouter );
app.use("/api/v1/likes",likeRouter)
 
export { app } 