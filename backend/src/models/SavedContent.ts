import mongoose, { Document, Schema } from 'mongoose';

export interface ISavedContent extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'meme' | 'playlist' | 'quote' | 'mood' | 'wallpaper';
  contentData: {
    title?: string;
    url?: string;
    description?: string;
    mood?: string;
    imageUrl?: string;
    metadata?: any;
  };
  createdAt: Date;
}

const savedContentSchema = new Schema<ISavedContent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['meme', 'playlist', 'quote', 'mood', 'wallpaper'],
    },
    contentData: {
      title: String,
      url: String,
      description: String,
      mood: String,
      imageUrl: String,
      metadata: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
savedContentSchema.index({ userId: 1, type: 1 });
savedContentSchema.index({ userId: 1, createdAt: -1 });

const SavedContent = mongoose.model<ISavedContent>('SavedContent', savedContentSchema);

export default SavedContent;
