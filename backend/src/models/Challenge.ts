import mongoose, { Document, Schema } from 'mongoose';

interface ISubmission {
  userId: mongoose.Types.ObjectId;
  response: string;
  imageUrl?: string;
  score: number;
  createdAt: Date;
}

export interface IChallenge extends Document {
  title: string;
  description: string;
  type: 'text' | 'image' | 'video';
  startDate: Date;
  endDate: Date;
  submissions: ISubmission[];
  createdAt: Date;
}

const challengeSchema = new Schema<IChallenge>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['text', 'image', 'video'],
      default: 'text',
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    submissions: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        response: String,
        imageUrl: String,
        score: { type: Number, default: 0 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Challenge = mongoose.model<IChallenge>('Challenge', challengeSchema);

export default Challenge;
