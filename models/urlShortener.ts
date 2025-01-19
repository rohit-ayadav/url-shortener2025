import mongoose, { Schema, Document, Model } from "mongoose";

interface IUrlShortener extends Document {
  originalUrl: string;
  shortenURL: string;
  createdAt: Date;
  click: number; // Changed to lowercase
  expireAt?: Date; // Optional expiration field
}

const urlShortenerSchema: Schema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: true,
    },
    shortenURL: {
      type: String,
      required: true,
      unique: true,
    },
    click: {
      type: Number,
      required: true,
      default: 0,
    },
    expireAt: {
      type: Date, // Field for TTL-based expiration
      default: null,
    },
  },
  { timestamps: true }
);

// Add TTL index for automatic expiration
urlShortenerSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const Url: Model<IUrlShortener> =
  mongoose.models.Url ||
  mongoose.model<IUrlShortener>("Url", urlShortenerSchema);

export { Url };
export type { IUrlShortener };
