import type { PlaylistData } from "@lib/shared_types"
import mongoose from "mongoose";
import type { Types } from "mongoose";

interface  PlaylistDocument
  extends Omit<PlaylistData, "id" | "songs">,
    mongoose.Document {
  songs: Types.ObjectId[];
}

interface PlaylistModel extends mongoose.Model<PlaylistDocument> {}

const PlaylistSchema = new mongoose.Schema<PlaylistDocument>(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        songs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Song",
            }
        ]
    },
    {
        timestamps: true,
    }
);

const Playlist = mongoose.model<PlaylistDocument, PlaylistModel>("Playlist", PlaylistSchema)
export default Playlist;
