import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
// import User from "../models/user.models.js";
import User from "../models/user.models.js";

import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";

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
  if( req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if(!avatarLocalPath){
    throw new ApiError(400, "Avatar image is required");
  }
  
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
   
   if(!avatar){
    throw new ApiError(500, "Failed to upload avatar image");
   }
   
   const user= await User.create({
    fullname,
    avatar:avatar.url,
    coverImage:coverImage?.url || " ",
    email,
    username:username.toLowerCase(),
    password
   })

   const createdUser = await User.findById(user._id).select("-password -refreshToken");

if(!createdUser){
    throw new ApiError(500, "Failed to create user");
   }

  return res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully"));

});
 
export { registerUser };
