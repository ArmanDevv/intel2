const mongoose = require("mongoose");

const PlaylistSchema = new mongoose.Schema({
  title: String,
  videoCount: Number,
  videos: [
    {
      id: String,
      title: String,
      channel: String,
      thumbnail: String,
      topic: String
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "teacher"], required: true },
  playlists: [PlaylistSchema]
});

module.exports = mongoose.model("User", UserSchema);
