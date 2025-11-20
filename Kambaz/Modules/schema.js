import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    _id: String,
    name: String,
    description: String,
  },
  { _id: false }
);

const moduleSchema = new mongoose.Schema(
  {
    _id: String,
    name: String,
    description: String,
    lessons: [lessonSchema],
  },
  { collection: "modules" }
);

export default moduleSchema;
