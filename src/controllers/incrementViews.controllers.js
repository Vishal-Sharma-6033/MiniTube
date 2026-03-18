import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.models.js";

const incrementViews = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        throw new ApiError(400, "Invalid video id");
    }

    const video = await Video.findByIdAndUpdate(
        id,
        { $inc: { views: 1 } }, // increase by 1
        { new: true }
    );

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    res.status(200).json(
        new ApiResponse(200, { views: video.views }, "View counted")
    );
});


export { incrementViews };
