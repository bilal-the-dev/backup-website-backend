import mongoose from "mongoose";

const configSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  tokenType: {
    type: String,
    enum: ["bot", "user"],
    required: true,
  },
});

export default mongoose.model("Config", configSchema);
