import mongoose, {isValidObjectId} from "mongoose";
import { Playlist } from "../models/playlist.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    // TODO: create playlist
});

export const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    // TODO: get user playlist
});

export const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    // TODO: get playlist by Id
});

export const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    // TODO: add video to playlist
});

export const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    // TODO: remove video from playlist
});

export const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    // TODO: delete playlist
});

export const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    // TODO: update playlist
});