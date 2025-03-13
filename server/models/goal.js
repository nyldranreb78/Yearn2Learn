const mongoose = require('mongoose');
const auth = require('../middleware/auth');

const goalSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    folderID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'folder'
    },
    name: {
        type: String,
        required: true
    },
    taskGrade: {
        type: Number,
    },
    actualGrade: {
        type: Number
    },
    deadline: {
        type: Date,
    },
    isFishished: {
        type: Boolean
    }
});

goalSchema.set("timestamps", true);

module.exports = mongoose.model('goal', goalSchema);