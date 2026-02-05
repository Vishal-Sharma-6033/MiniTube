import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import User from "../models/user.models.js";

import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessTokenAndrefreshToken = async (userId) => {
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

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(500, "Failed to upload avatar image");
  }

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || " ",
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
    await generateAccessTokenAndrefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    )

    const options = {
      httpOnly: true, 
      secure: true,
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new ApiResponse(200,{ refreshToken, user: loggedInUser }, "User logged in successfully"))

})

const logoutUser = asyncHandler(async(req,res)=>{
    //logout logic here
    await User.findByIdAndUpdate(
      req.user._id,{
        refreshToken:undefined
      },
      {
        new:true
      }
    )

    const options = {
      httpOnly: true, 
      secure: true,
    }
    return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200, null, "User logged out successfully"));


}) 

const refreshAccessToken= asyncHandler(async(req,res)=>{
  const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken

  if(!incomingRefreshToken){
    throw new ApiError(400, "Refresh token is required")
  }
  try {
     const decodedToken= jwt.verify(incomingRefreshToken,
       process.env.REFRESH_TOKEN_SECRET)
  
  
       const user= User.findById(decodedToken?._id)
  
       if(!user){
        throw new ApiError(401, "Invalid refresh token")
       }
  
  if(incomingRefreshToken !== user?.refreshAccessToken){
    throw new ApiError(401,"Refresh token is Expired")
  }
  
  const options={
    httpOnly:true,
    secure:true,
  }
  
   const { accessToken, newrefreshToken } = await generateAccessTokenAndrefreshToken(user._id)
  
   return res
   .status(200)
   .cookie("accessToken", accessToken, options)
   .cookie("refreshToken", newrefreshToken, options)
   .json(new ApiResponse(200, { accessToken, refreshToken: newrefreshToken }, "Access token refreshed successfully"))
  
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token")
    
  }
})

const changeCrrnetPassword = asyncHandler(async(req,res)=>{
  const {oldPassword, newPassword}=req.body
  const user= await User.findById(req.user?._id)
  const isPasswordCorrect= await user.isPasswordCorrect(oldPassword)
  
  if(!isPasswordCorrect){
    throw new ApiError (400, "Old password is incorrect")
  }
   user.password=newPassword
    await user.save({validateBeforeSave:false})

    return res
    .status(200)
    .json (new ApiResponse(200, null, "Password changed successfully"))
})

const getCurrentUserDetails=asyncHandler(async(req,res)=>{
  return res
  .status(200)
  .json(new ApiResponse(200, req.user, "Current user details fetched successfully"))
}) 

const updateAccountDetails= asyncHandler(async(req,res)=>{
  const {fullName, email}=req.body
  if(!fullName || !email){
    throw new ApiError(400, "Full name and email are required")  
  }
  const user= await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        fullName,
        email
      }
    },{new:true}
  ).select("-password -refreshToken")

  return res
  .status(200)
  .json(new ApiResponse(200, user, "Account details updated successfully"))
})

const updateAvatar= asyncHandler(async(req,res)=>{
  const avatarLocalPath= req.file?.path

  if(!avatarLocalPath){
    throw new ApiError(400, "Avatar image is required")
  }

  const avatar= await uploadOnCloudinary(avatarLocalPath)

  if(!avatar){
    throw new ApiError (500, "Failed to upload avatar image")
  }

  const user= await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        avatar: avatar.url
      } 
    },
    {new:true}
  ).select("-password -refreshToken")

  return res 
  .status(200)
  .json(new ApiResponse(200, user, "Avatar updated successfully"))
})

const updateCoverImage= asyncHandler(async(req,res)=>{
  const coverImageLocalPath= req.file?.path

  if(!coverImageLocalPath){
    throw new ApiError(400, "Cover image is required")
  }

  const coverImage= await uploadOnCloudinary(coverImageLocalPath)

  if(!coverImage){
    throw new ApiError (500, "Failed to upload cover image")
  }

  const user= await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        coverImage: coverImage.url
      } 
    },
    {new:true}
  ).select("-password -refreshToken")

  return res 
  .status(200)
  .json(new ApiResponse(200, user, "Cover image updated successfully"))
})


 




export { registerUser,
   loginUser,
   logoutUser,
   refreshAccessToken,
   changeCrrnetPassword,
   getCurrentUserDetails,
   updateAccountDetails,
    updateAvatar,
    updateCoverImage
   };
