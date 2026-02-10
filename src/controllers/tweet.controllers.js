import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.models.js";
import { ApiError } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;

    if (!content || content.trim() === "") {
        throw new ApiError(400, "Content is required");
    }

    if (!req.user || !req.user._id) {
        throw new ApiError(401, "Unauthorized request");
    }

    const tweet = new Tweet({
    owner: req.user._id,
    content
});

await tweet.save();

    return res.status(201).json(
        new ApiResponse(
            true,
            "Tweet created successfully",
            tweet
        )
    );
});

const deleteTweet =asyncHandler(async(req, res)=>{
    const { id } = req.params;
    if(!isValidObjectId(id)){
        throw new ApiError(400,"Error to find the tweet")
    }

    const tweet = await Tweet.findById(id);
      if (!tweet) {
        throw new ApiError(404, "Tweet not found");
      }
      if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this Tweet");
      }
      await tweet.deleteOne();

      res.status(200).json(new ApiResponse(true, "tweet deleted successfully"));


})

const updateTweet=asyncHandler(async(req,res)=>{
    const {id}=req.params
    const {content}=req.body
    if(!isValidObjectId(id)){
        throw new ApiError(400,"Not found any tweet on this id")
    }
    const tweet = await Tweet.findById(id);
      if (!tweet) {
        throw new ApiError(404, "Tweet not found");
      }

    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this Tweet");
      }

      tweet.content=content || tweet.content
      await tweet.save();

    res
    .status(200)
    .json(new ApiResponse(true, "tweet updated successfully", tweet));

})

const getUserTweet=asyncHandler(async(req,res)=>{
    const {id}=req.params
    if(!isValidObjectId(id)){
        throw new ApiError(400,"Tweet not found")
    }
    const tweet = await Tweet.findById(id);
      if (!tweet) {
        throw new ApiError(404, "Tweet not found");
      }

    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this Tweet");
      }

      res.status(200).json(new ApiResponse(true, "Tweet details", tweet))

    
})


export {createTweet,deleteTweet,updateTweet,getUserTweet};