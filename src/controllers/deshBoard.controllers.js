import mongoose from "mongoose";
import {Video} from "../models/video.models.js"
import {Subscription} from "../models/sbscription.models.js"
import {Like} from "../models/like.models.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const getChannelStats = asyncHandler(async (req, res) => {

    const channelId = req.user?._id;

    if (!channelId) {
        throw new ApiError(400, "Channel not found");
    }

    // ---------------- VIDEO STATS ----------------
    const videoStatus = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $group: {
                _id: null,
                totalVideos: { $sum: 1 },
                totalViews: { $sum: "$views" }
            }
        }
    ]);

    // ---------------- SUBSCRIBERS ----------------
    const Subscriber = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $group: {
                _id: null,
                totalSubscriber: { $sum: 1 }
            }
        }
    ]);

    // ---------------- LIKES ----------------
    const likes = await Like.aggregate([
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videoDetails"
            }
        },
        {
            $match: {
                "videoDetails.owner": new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $group: {
                _id: null,
                totalLikes: { $sum: 1 }
            }
        }
    ]);

    const channelStats = {
        totalVideos: videoStatus[0]?.totalVideos || 0,
        totalViews: videoStatus[0]?.totalViews || 0,
        totalSubscriber: Subscriber[0]?.totalSubscriber || 0,
        totalLikes: likes[0]?.totalLikes || 0
    };

    return res.status(200).json(
        new ApiResponse(200, channelStats, "Channel stats fetched successfully")
    );
});


const getChannelVideos=asyncHandler(async(req,res)=>{
    const channelId = req.user?._id
    const { page = 1, limit = 10 } = req.query

    if (!channelId) {
        throw new ApiError(400, "Channel ID is required")
    }

    const videos = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $skip: (page - 1) * limit
        },
        {
            $limit: parseInt(limit)
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            fullname: 1,
                            username: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                }
            }
        }
    ])

    return res
        .status(200)
        .json(
            new ApiResponse(200, videos, "Channel videos fetched successfully")
        )



})


export {getChannelVideos,getChannelStats}