import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.models.js";

const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Error in video Id");
  }
  if (!content) {
    throw new ApiError(400, "Plz enter your comment");
  }

  const comment = new Comment({
    owner: req.user._id,
    video: videoId,
    content,
  });

  await comment.save();

  res
    .status(200)
    .json(new ApiResponse(true, "Add comment successfully", comment));
});

const getVideoComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  // get comments of the video
  const comments = await Comment.find({ video: videoId })
    .populate("owner", "username avatar") // optional
    .sort({ createdAt: -1 }); // latest first

  res.status(200).json(
    new ApiResponse(true, "Comments fetched successfully", {
      comments,
    })
  );
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Error in video Id");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(400, "You are not authorized user to delte comment");
  }
  await comment.deleteOne();

  res.status(200).json(new ApiResponse(true, "Comment delete Successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  if (!content) {
    throw new ApiError(400, "Content is required");
  }
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "We can not find any comment");
  }
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(400, "You are not authorized user to delte comment");
  }

  comment.content = content || comment.content;
  await comment.save();

  res
    .status(200)
    .json(new ApiResponse(true, "Comment updated successfully", comment));
});

export { addComment, deleteComment, getVideoComment, updateComment };
