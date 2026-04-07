const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  userId: String,
  prompt: String,
  reply: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Chat", chatSchema);