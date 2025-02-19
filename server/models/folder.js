const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
    name: {
        type: String,
        default: "Untitled"
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    notes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'note'
    }],
    
});

folderSchema.set("timestamps", true);

module.exports = mongoose.model('folder', folderSchema);