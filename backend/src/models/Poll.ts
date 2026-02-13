import mongoose, { Document, Schema } from 'mongoose';

interface IPollOption {
  text: string;
  votes: number;
  voters: mongoose.Types.ObjectId[];
}

export interface IPoll extends Document {
  userId: mongoose.Types.ObjectId;
  question: string;
  options: IPollOption[];
  expiresAt?: Date;
  createdAt: Date;
}

const pollSchema = new Schema<IPoll>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    options: [
      {
        text: {
          type: String,
          required: true,
          trim: true,
        },
        votes: {
          type: Number,
          default: 0,
        },
        voters: [
          {
            type: Schema.Types.ObjectId,
            ref: 'User',
          },
        ],
      },
    ],
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Poll = mongoose.model<IPoll>('Poll', pollSchema);

export default Poll;
