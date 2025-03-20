const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  priority: {
    type: Boolean,
    required: false,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "note",
    },
  ],
  flashcards: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "flashcards",
    },
  ],
});

folderSchema.set("timestamps", true);

module.exports = mongoose.model("folder", folderSchema);
