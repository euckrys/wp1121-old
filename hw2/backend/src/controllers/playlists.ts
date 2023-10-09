import SongModel from "../models/song";
import PlaylistModel from "../models/playlist";
import { genericErrorHandler } from "../utils/errors";
import type {
    SongData,
    CreatePlaylistPayload,
    CreatePlaylistResponse,
    GetPlaylistsResponse,
    PlaylistData,
    UpdatePlaylistPayload,
} from "@lib/shared_types";
import type { Request, Response } from "express";


export const getPlaylists = async (_: Request, res: Response<GetPlaylistsResponse>) => {
    try {
      const playlists = await PlaylistModel.find({});

      // Return only the id and name of the list
      const listsToReturn = playlists.map((playlist) => {
        return {
          id: playlist.id,
          title: playlist.title,
          description: playlist.description,
        };
      });

      return res.status(200).json(listsToReturn);
    } catch (error) {
      genericErrorHandler(error, res);
    }
};


export const getPlaylist = async (
    req: Request<{ id: string }>,
    res: Response<PlaylistData | { error: string }>,
  ) => {
    try {
      const { id } = req.params;
      const playlists = await PlaylistModel.findById(id).populate("cards");
      if (!playlists) {
        return res.status(404).json({ error: "id is not valid" });
      }

      return res.status(200).json({
        id: playlists.id,
        title: playlists.title,
        description: playlists.description,
        songs: playlists.songs as unknown as SongData[],
      });
    } catch (error) {
      genericErrorHandler(error, res);
    }
};


export const createPlaylist = async (
    req: Request<never, never, CreatePlaylistPayload>,
    res: Response<CreatePlaylistResponse>,
  ) => {
    try {
      const { id } = await PlaylistModel.create(req.body);
      return res.status(201).json({ id });
    } catch (error) {
      genericErrorHandler(error, res);
    }
};


export const updatePlaylist = async (
    req: Request<{ id: string }, never, UpdatePlaylistPayload>,
    res: Response,
  ) => {
    try {
      const { id } = req.params;
      const { title, description } = req.body;

      // Update the Playlist
      const newPlaylist = await PlaylistModel.findByIdAndUpdate(
        id,
        {
            title: title,
            description: description,
        },
        { new: true },
      );

      // If the Playlist is not found, return 404
      if (!newPlaylist) {
        return res.status(404).json({ error: "id is not valid" });
      }

      return res.status(200).send("OK");
    } catch (error) {
      genericErrorHandler(error, res);
    }
};

export const deletePlaylist = async (
    req: Request<{ id: string }>,
    res: Response,
  ) => {
    // Create a transaction
    const session = await PlaylistModel.startSession();
    session.startTransaction();

    try {
      const { id } = req.params;
      const deletedPlaylist = await PlaylistModel.findByIdAndDelete(id).session(session);
      if (!deletedPlaylist) {
        throw new Error("id is not valid");
      }
      await SongModel.deleteMany({ list_id: id }).session(session);
      await session.commitTransaction();
      res.status(200).send("OK");
    } catch (error) {
      await session.abortTransaction();
      genericErrorHandler(error, res);
    } finally {
      session.endSession();
    }
  };
