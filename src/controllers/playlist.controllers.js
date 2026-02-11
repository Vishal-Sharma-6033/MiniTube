import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { Playlist } from "../models/playlist.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    throw new ApiError(400, "Enter the name of Playlist");
  }
  if (!description) {
    throw new ApiError(400, "Enter the name of Playlist");
  }
  console.log(name);
  console.log(description);

  const playlist = await Playlist.create({
    name: name,
    description: description,
    owner: req.user._id,
  });

  await playlist.save();
  res.status(200).json(new ApiResponse(true, "Playlist Created Successfully"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid Playlist Id");
  }

  const playlist = await Playlist.findById(id);
  if (!playlist) {
    throw new ApiError(400, "Playlist not found");
  }
  if (!playlist.owner.equals(req.user._id)) {
    throw new ApiError(403, "You are not authorised to delete this playlist");
  }

  await Playlist.findByIdAndDelete(id);

  res.status(200).json(new ApiResponse(true, "Playlist Deleted Successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name?.trim() || !description?.trim()) {
    throw new ApiError(400, "Name and description are required");
  }

  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Wrong playlist id");
  }

  const playlist = await Playlist.findById(id);

  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(400, "You are not Athorised to Update this playlist");
  }

  playlist.name = name || playlist.name;
  playlist.description = description || playlist.description;

  await playlist.save();

  res
    .status(200)
    .json(new ApiResponse(true, "Playlist update successfully", playlist));
});

const getUserPlaylist = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Error in playlist id");
  }

  const playlist = await Playlist.find({
    owner: id,
  }).populate("owner", "username fullName avatar");

  res
    .status(200)
    .json(new ApiResponse(true, "User Playlist fetch successfully", playlist));
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Error in playlist id");
  }

  const playlist = await Playlist.findById(id);
  if (!playlist) {
    throw new ApiError(400, "Not found any playlist ");
  }

  res
    .status(200)
    .json(new ApiResponse(true, "Playlist fetch successfully", playlist));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if (!playlistId || !videoId) {
    throw new ApiError(400, "PlaylistID and VideoId Both are required");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(401, "PlayList not found");
  }


  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only playlist owner can add videos");
  }
  if (playlist.videos.includes(videoId)) {
    throw new ApiError(400, "Video already exists in this playlist");
  }

  const addVideoInPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $push: {
        videos: videoId,
      },
    },
    { new: true }
  ).populate("videos");
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        addVideoInPlaylist,
        "Video added to playlist successfully"
      )
    );
});


const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
  if (!playlistId || !videoId) {
    throw new ApiError(400, "PlaylistID and VideoId Both are required");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(401, "PlayList not found");
  }


  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only playlist owner can remove videos");
  }

  const addVideoInPlaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $pull: {
        videos: videoId,
      },
    },
    { new: true }
  ).populate("videos");
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        addVideoInPlaylist,
        "Video remove from playlist successfully"
      )
    );
});

export {
  createPlaylist,
  getPlaylistById,
  getUserPlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
