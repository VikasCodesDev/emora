import mongoose, { Document, Schema } from 'mongoose';

export interface ISavedMusic extends Document {
  userId: mongoose.Types.ObjectId;
  trackId: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  preview: string;
  duration: number;
  createdAt: Date;
}

const savedMusicSchema = new Schema<ISavedMusic>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    trackId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    artist: {
      type: String,
      required: true,
    },
    album: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
      required: true,
    },
    preview: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

savedMusicSchema.index({ userId: 1, trackId: 1 }, { unique: true });

const SavedMusic = mongoose.model<ISavedMusic>('SavedMusic', savedMusicSchema);

export default SavedMusic;
