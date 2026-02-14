import mongoose, { Document, Schema } from 'mongoose';

interface ITrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  duration: number;
  previewUrl?: string;
  imageUrl?: string;
}

export interface IPlaylist extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  tracks: ITrack[];
  createdAt: Date;
}

const playlistSchema = new Schema<IPlaylist>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    tracks: [
      {
        id: String,
        name: String,
        artist: String,
        album: String,
        duration: Number,
        previewUrl: String,
        imageUrl: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Playlist = mongoose.model<IPlaylist>('Playlist', playlistSchema);

export default Playlist;
