const mongoose = require('mongoose');
const auth = require('../middleware/auth');

const taskSchema = new mongoose.Schema({
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
        required: true
    },
    isFinished: {
        type: Boolean
    }
});

taskSchema.set("timestamps", true);

module.exports = mongoose.model('task', taskSchema);