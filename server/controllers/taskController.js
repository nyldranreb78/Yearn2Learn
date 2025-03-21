const User = require('../models/user');
const Task = require('../models/task');
// const Folder = require('../models/folder');
const auth = require('../middleware/auth-service');


async function verifyID(id, res) {
    if (!id) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    return true;
};

async function index(req, res){
    try {
        const id = auth.getUserID(req);

        if (!(await verifyID(id, res))) return;

        const tasks = await Task.find({author: id});
        Task.populate('author', 'username', 'user');
        return res.status(200).json({ tasks : tasks });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

async function create(req, res){
    try {
        const id = auth.getUserID(req);

        if (!(await verifyID(id, res))) return;

        const user = await User.findOne({ _id: id });

        if (!user) {
            return res.status(404).json( { message: 'User not found' } );
        }

        const task = new Task({
            folderID: req.body.folderID ? req.body.folderID : null,
            name: req.body.name,
            taskGrade: req.body.taskGrade,
            actualGrade: req.body.actualGrade,
            deadline: req.body.deadline,
            isFinished: req.body.isFinished
        });

        task.author = user._id;
        await task.save();

        return res.status(201).json({ task: task });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

async function show(req, res){
    try {
        const id = auth.getUserID(req);

        if (!(await verifyID(id, res))) return;

        const task = await Task.findOne({ _id: req.params.id });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.author != id) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        return res.status(200).json({ task : task });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

async function update(req, res){
    try {
        const id = auth.getUserID(req);

        if (!(await verifyID(id, res))) return;

        const task = await Task.findOne({ _id: req.params.id });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.author != id) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        task.folderID = req.body.folderID ? req.body.folderID : task.folderID;
        task.name = req.body.name ? req.body.name : task.name;
        task.taskGrade = req.body.taskGrade ? req.body.taskGrade : task.taskGrade;
        task.actualGrade = req.body.actualGrade ? req.body.actualGrade : task.actualGrade;
        task.deadline = req.body.deadline ? req.body.deadline : task.deadline;
        task.isFinished = req.body.isFinished ? req.body.isFinished : task.isFinished;

        await task.save();
        return res.status(200).json({ task: task });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

async function remove(req, res){
    try {
        const id = auth.getUserID(req);

        if (!(await verifyID(id, res))) return;

        const task = await Task.findOne({ _id: req.params.id });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (task.author != id) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        await Task.deleteOne({ _id: req.params.id });

        return res.status(200).json({ message: 'Task deleted' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

async function removeAll(req, res){
    try {
        const id = auth.getUserID(req);

        if (!(await verifyID(id, res))) return;

        await Task.deleteMany({ author: id });

        return res.status(200).json({ message: 'All tasks deleted' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = { index, create, show, update, remove, removeAll };