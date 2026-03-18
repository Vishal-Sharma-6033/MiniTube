import mongoose, { isValidObjectId } from "mongoose"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError} from "../utils/ApiErrors.js"
import { ApiResponse} from "../utils/ApiResponse.js"
import {Subscription} from "../models/sbscription.models.js"

const toggleSubscription=asyncHandler(async(req,res)=>{
    const {channelId}=req.params
    if(!isValidObjectId(channelId)){
        throw new ApiError(400,"Channel Not found")
    }

    const existingSubscribe=await  Subscription.findOne({
        channel:channelId,
        subscriber:req.user._id
    })

    if(existingSubscribe){
        await Subscription.findByIdAndDelete(existingSubscribe._id);

        return res
        .status(200)
        .json(new ApiResponse(true,"Channel unSubscribed successfully"))
        
    }
    await Subscription.create({
        channel:channelId,
        subscriber:req.user._id

    })
    return res
    .status(200)
    .json(new ApiResponse(true,"Channel Subscribed successfully"))

})

const getUserchannelSubscription = asyncHandler(async (req, res) => {

    const { channelId } = req.params;

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel id");
    }

    const subscribers = await Subscription.find({
        channel: channelId
    }).populate({
        path: "subscriber",
        select: "fullname username avatar"
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            subscribers,
            "Channel subscribers fetched successfully"
        )
    );
});

const getSubscribedChannel = asyncHandler(async (req, res) => {

    const { subscriberId } = req.params;

    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber id");
    }

    const subscribedChannels = await Subscription.find({
        subscriber: subscriberId
    }).populate({
        path: "channel",
        select: "fullname username avatar"
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            subscribedChannels,
            "Subscribed channels fetched successfully"
        )
    );
});


export {toggleSubscription,getSubscribedChannel,getUserchannelSubscription}