import mongoose, {isValidObjectId} from "mongoose";
import { User } from "../models/user.models.js";
import { Tweet } from "../models/tweet.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createTweet = asyncHandler(async (req, res) => {
    // TODO: create tweet
});

export const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
});

export const updateTweet = asyncHandler(async (req, res) => {
    // TODO: update tweet
});

export const deleteTweet = asyncHandler(async (req, res) => {
    // TODO: delete tweet
});