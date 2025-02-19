const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        default: "Untitled"
    },
    content: {
        type: String
    },
    lastSaved : {
        type: Date,
        default: Date.now()
    },
    author : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
});

noteSchema.set("timestamps", true);

module.exports = mongoose.model('note', noteSchema);