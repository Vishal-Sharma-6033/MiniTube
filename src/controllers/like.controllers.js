import mongoose, { isValidObjectId } from "mongoose"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Like } from "../models/like.models.js"
import { ApiError } from "../utils/ApiErrors.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const toggleVideoLike=asyncHandler(async(req,res)=>{
    const {videoId}=req.params
    console.log(videoId)
    if(!isValidObjectId(videoId)){
        throw new ApiError(401,"Invalid video id")
    }

    const existingLike=await Like.findOne({
        video:videoId,
        likedBy:req.user._id
    })
    // UNLIKE
    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id)

        return res.status(200).json(
            new ApiResponse(true, "Video unliked successfully")
        )
    }

    // LIKE
    await Like.create({
        video: videoId,
        likedBy: req.user._id
    })

    res.status(200).json(
        new ApiResponse(true, "Video liked successfully")
    )

})

const toggleCommentLike=asyncHandler(async(req,res)=>{
const {commentId}=req.params
    if(!isValidObjectId(commentId)){
        throw new ApiError(401,"Invalid comment id")
    }

    const existingLike=await Like.findOne({
        video:commentId,
        likedBy:req.user._id
    })
    // UNLIKE
    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id)

        return res.status(200).json(
            new ApiResponse(true, "comment unliked successfully")
        )
    }

    // LIKE
    await Like.create({
        video: commentId,
        likedBy: req.user._id
    })

    res.status(200).json(
        new ApiResponse(true, "comment liked successfully")
    )
})

const toggleTweetLike=asyncHandler(async(req,res)=>{
const {tweetId}=req.params
    if(!isValidObjectId(tweetId)){
        throw new ApiError(401,"Invalid tweet id")
    }

    const existingLike=await Like.findOne({
        video:tweetId,
        likedBy:req.user._id
    })
    // UNLIKE
    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id)

        return res.status(200).json(
            new ApiResponse(true, "tweet unliked successfully")
        )
    }

    // LIKE
    await Like.create({
        video: tweetId,
        likedBy: req.user._id
    })

    res.status(200).json(
        new ApiResponse(true, "Tweet liked successfully")
    )
})

const togglegetLikeVideos=asyncHandler(async(req,res)=>{
  const likedVideos = await Like.find({
        likedBy: req.user._id,
        video: { $exists: true }
    })
    .populate("video")
    .sort({ createdAt: -1 })

    res.status(200).json(
        new ApiResponse(
            true,
            "Liked videos fetched successfully",
            likedVideos
        )
    )
})

export{toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
    togglegetLikeVideos
}