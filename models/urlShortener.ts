import mongoose, { Schema, Document, Model } from "mongoose";

interface IUrlShortener extends Document {
  originalUrl: string;
  shortenURL: string;
  createdAt: Date;
  click: Number;
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
  },
  { timestamps: true }
);

const Url: Model<IUrlShortener> =
  mongoose.models.Url ||
  mongoose.model<IUrlShortener>("Url", urlShortenerSchema);
export { Url };
export type { IUrlShortener };
