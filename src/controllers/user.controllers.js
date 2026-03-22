import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import User from "../models/user.models.js";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadToTelegram } from "../utils/telegramStorage.js";
import jwt from "jsonwebtoken";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("TOKEN ERROR:", error);
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Something went wrong while generating tokens"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // Registration logic here

  const { username, email, password, fullname } = req.body;

  if (!fullname) {
    throw new ApiError(400, "Full name is required");
  }
  if (!username) {
    throw new ApiError(400, "Username is required");
  }
  if (!email) {
    throw new ApiError(400, "Email is required");
  }
  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new ApiError(409, "User with this email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar image is required");
  }

  let avatar;
  let coverImage;
  try {
    avatar = await uploadToTelegram(avatarLocalPath);
    coverImage = await uploadToTelegram(coverImageLocalPath);
  } catch (error) {
    throw new ApiError(
      500,
      "Image upload failed. Check Telegram bot config/network and retry."
    );
  }

  if (!avatar) {
    throw new ApiError(500, "Failed to upload avatar image");
  }

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    avatarFileId: avatar.file_id || "",
    coverImage: coverImage?.url || "",
    coverImageFileId: coverImage?.file_id || "",
    email,
    username: username.toLowerCase(),
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Failed to create user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "Username or Email is required");
  }

  const user = await User.findOne({
    $or: [{ username: username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { refreshToken, user: loggedInUser },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  //logout logic here
  await User.findByIdAndUpdate(
    req.user._id,
    {
      refreshToken: undefined,
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, null, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(400, "Refresh token is required");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?.userId || decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is Expired");
    }

    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Old password is incorrect");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password changed successfully"));
});

const getCurrentUserDetails = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        req.user,
        "Current user details fetched successfully"
      )
    );
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;
  if (!fullName || !email) {
    throw new ApiError(400, "Full name and email are required");
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        fullname: fullName,
        email,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const updateAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar image is required");
  }

  const avatar = await uploadToTelegram(avatarLocalPath);

  if (!avatar) {
    throw new ApiError(500, "Failed to upload avatar image");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: avatar.url,
        avatarFileId: avatar.file_id || "",
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully"));
});

const updateCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image is required");
  }

  const coverImage = await uploadToTelegram(coverImageLocalPath);

  if (!coverImage) {
    throw new ApiError(500, "Failed to upload cover image");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        coverImage: coverImage.url,
        coverImageFileId: coverImage.file_id || "",
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover image updated successfully"));
});

const getUserProfileDetails = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username) {
    throw new ApiError(400, "Username is required");
  }
  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscriberDetails",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribeTo",
      },
    },
    {
      $addFields: {
        subscribeCount: { $size: "$subscriberDetails" },
        subscribedToCount: { $size: "$subscribeTo" },
        isSubscribed: {
          $cond: [{ $in: [req.user?._id, "$subscriberDetails.subscriber"] }, true, false],
        }
      },
    },
    {
    
      $project: {
        fullname:1,
        username:1,
        avatar:1,
        coverImage:1,
        subscribeCount:1,
        subscribedToCount:1,
        isSubscribed:1,
        email:1
      },
    }
  ]);
  console.log(channel);
  
  if (!channel?.length) {
    throw new ApiError(404, "User not found");
  }
  return res
  .status(200)
  .json(new ApiResponse(200, channel[0], "User profile details fetched successfully"));
});

const getWatchHistory=asyncHandler(async(req,res)=>{
  const user=await User.aggregate([
    {
      $match:{
        _id:new mongoose.Types.ObjectId(req.user._id)
      }
    },
    {
      $lookup:{
        from:"videos",
        localField:"watchHistory",
        foreignField:"_id",
        as:"watchHistoryDetails",
        pipeline:[
          {
            $lookup:{
              from:"users",
              localField:"owner",
              foreignField:"_id",
              as:"ownerDetails",
              //SubpipeLine
              pipeline:[
                {
                  $project:{
                    fullname:1,
                    username:1,
                    avatar:1
                  }
                }
              ]
            }
          },
          {
            $addFields:{
              ownerDetails:
              {
                $first:"$ownerDetails"
              }
            }
          }
        ]
      }
    },

  ])

  return res
  .status(200)
  .json(new ApiResponse(200, user[0]?.watchHistoryDetails || [], "User watch history fetched successfully"));

})




export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUserDetails,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
  getUserProfileDetails,
  getWatchHistory
};
