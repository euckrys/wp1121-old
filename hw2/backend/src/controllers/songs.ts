import SongModel from "../models/song";
import PlayListModel from "../models/playlist";
import { genericErrorHandler } from "../utils/errors";
import type {
    CreateSongPayload,
    CreateSongResponse,
    GetSongResponse,
    GetSongsResponse,
    UpdateSongPayload,
    UpdateSongResponse,
} from "@lib/shared_types";
import type { Request, Response } from "express";

export const getSongs = async (_: Request, res: Response<GetSongsResponse>) => {
    try {
      const dbSongs = await SongModel.find({});
      const songs = dbSongs.map((song) => ({
        id: song.id as string,
        title: song.title,
        singer: song.singer,
        link: song.link,
        list_id: song.list_id.toString(),
      }));

      return res.status(200).json(songs);
    } catch (error) {
      // Check the type of error
      genericErrorHandler(error, res);
    }
};

export const getSong = async (
    req: Request<{ id: string }>,
    res: Response<GetSongResponse | { error: string }>,
  ) => {
    try {
      const { id } = req.params;

      const song = await SongModel.findById(id);
      if (!song) {
        return res.status(404).json({ error: "id is not valid" });
      }

      return res.status(200).json({
        id: song.id as string,
        title: song.title,
        singer: song.singer,
        link: song.link,
        list_id: song.list_id.toString(),
      });
    } catch (error) {
      genericErrorHandler(error, res);
    }
};

export const createSong = async (
    req: Request<never, never, CreateSongPayload>,
    res: Response<CreateSongResponse | { error: string }>,
  ) => {
    try {
      const { title, singer, link, list_id } = req.body;

      // Check if the list exists
      const playList = await PlayListModel.findById(list_id);
      if (!playList) {
        return res.status(404).json({ error: "list_id is not valid" });
      }

      const song = await SongModel.create({
        title,
        singer,
        link,
        list_id,
      });

      // Add the song to the list
      playList.songs.push(song._id);
      await playList.save();

      return res.status(201).json({
        id: song.id as string,
      });
    } catch (error) {
      // Check the type of error
      genericErrorHandler(error, res);
    }
};

export const updateSong = async (
    req: Request<{ id: string }, never, UpdateSongPayload>,
    res: Response<UpdateSongResponse | { error: string }>,
  ) => {
    // Create mongoose transaction
    const session = await SongModel.startSession();
    session.startTransaction();
    // In `updateCard` function, 2 database operations are performed:
    // 1. Update the card
    // 2. Update the list
    // If one of them fails, we need to rollback the other one.
    // To do that, we need to use mongoose transaction.

    try {
      const { id } = req.params;
      const { title, singer, link, list_id } = req.body;

      // Check if the card exists
      const oldSong = await SongModel.findById(id);
      if (!oldSong) {
        return res.status(404).json({ error: "id is not valid" });
      }

      // If the user wants to update the list_id, we need to check if the list exists
      if (list_id) {
        // Check if the list exists
        const playListExists = await PlayListModel.findById(list_id);
        if (!playListExists) {
          return res.status(404).json({ error: "list_id is not valid" });
        }
      }

      const newSong = await SongModel.findByIdAndUpdate(
        id,
        {
          title,
          singer,
          link,
          list_id,
        },
        { new: true },
      );

      if (!newSong) {
        return res.status(404).json({ error: "id is not valid" });
      }

      // If the user wants to update the list_id, we need to update the list as well
      if (list_id) {
        // Remove the card from the old list
        const oldPlayList = await PlayListModel.findById(oldSong.list_id);
        if (!oldPlayList) {
          return res.status(404).json({ error: "list_id is not valid" });
        }
        oldPlayList.songs = oldPlayList.songs.filter(
          (songID) => songID.toString() !== id,
        );
        await oldPlayList.save();

        // Add the card to the new list
        const newPlayList = await PlayListModel.findById(list_id);
        if (!newPlayList) {
          return res.status(404).json({ error: "list_id is not valid" });
        }
        newPlayList.songs.push(newSong.id);
        await newPlayList.save();
      }

      // Commit the transaction
      // This means that all database operations are successful
      await session.commitTransaction();

      return res.status(200).send("OK");
    } catch (error) {
      // Rollback the transaction
      // This means that one of the database operations is failed
      await session.abortTransaction();
      genericErrorHandler(error, res);
    }
};


export const deleteSong = async (
    req: Request<{ id: string }>,
    res: Response,
  ) => {
    // Create mongoose transaction
    const session = await SongModel.startSession();
    session.startTransaction();

    try {
      const { id } = req.params;

      // Delete the Song from the database
      const deletedSong = await SongModel.findByIdAndDelete(id);
      if (!deletedSong) {
        return res.status(404).json({ error: "id is not valid" });
      }

      // Delete the Song from the list
      const playList = await PlayListModel.findById(deletedSong.list_id);
      if (!playList) {
        return res.status(404).json({ error: "list_id is not valid" });
      }
      playList.songs = playList.songs.filter((songID) => songID.toString() !== id);
      await playList.save();

      // Commit the transaction
      session.commitTransaction();

      return res.status(200).send("OK");
    } catch (error) {
      session.abortTransaction();
      genericErrorHandler(error, res);
    }
  };
