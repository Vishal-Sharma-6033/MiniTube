import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173,http://localhost:5174")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const isLocalDevOrigin = (origin) => {
    return /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
};

app.use(cors({
    origin: (origin, callback) => {
        // Allow non-browser tools (no origin) and configured frontend origins.
        if (!origin || allowedOrigins.includes(origin) || isLocalDevOrigin(origin)) {
            return callback(null, true);
        }
        return callback(null, false);
    },
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
import playlistRoter from "./routes/playlist.routes.js"
import deshBoardRouter from "./routes/deshBoard.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"

//Use Routes
app.use("/api/v1/users",userRoutes);
app.use("/api/v1/videos",videoRoutes);
app.use("/api/v1/tweets",tweetRoutes);
app.use("/api/v1/comments",commentRouter );
app.use("/api/v1/likes",likeRouter);
app.use("/api/v1/playlist",playlistRoter);
app.use("/api/v1/deshboard",deshBoardRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);



 
export { app } 