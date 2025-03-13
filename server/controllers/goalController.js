const User = require('../models/user');
const Goal = require('../models/goal');
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

        const goals = await Goal.find({author: id});
        Goal.populate('author', 'username', 'user');
        return res.status(200).json({ goals : goals });
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

        const goal = new Goal({
            folderID: req.body.folderID ? req.body.folderID : null,
            name: req.body.name,
            taskGrade: req.body.taskGrade,
            deadline: req.body.deadline,
            isFishished: false
        });

        goal.author = user._id;
        await goal.save();

        return res.status(201).json({ goal: goal });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

async function show(req, res){
    try {
        const id = auth.getUserID(req);

        if (!(await verifyID(id, res))) return;

        const goal = await Goal.findOne({ _id: req.params.id });

        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        if (goal.author != id) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        return res.status(200).json({ goal });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

async function update(req, res){
    try {
        const id = auth.getUserID(req);

        if (!(await verifyID(id, res))) return;

        const goal = await Goal.findOne({ _id: req.params.id });

        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        if (goal.author != id) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        goal.folderID = req.body.folderID ? req.body.folderID : goal.folderID;
        goal.name = req.body.name ? req.body.name : goal.name;
        goal.taskGrade = req.body.taskGrade ? req.body.taskGrade : goal.taskGrade;
        goal.actualGrade = req.body.actualGrade ? req.body.actualGrade : goal.actualGrade;
        goal.deadline = req.body.deadline ? req.body.deadline : goal.deadline;
        goal.isFishished = req.body.isFishished ? req.body.isFinished : goal.isFishished;

        await goal.save();
        return res.status(200).json({ goal });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

async function remove(req, res){
    try {
        const id = auth.getUserID(req);

        if (!(await verifyID(id, res))) return;

        const goal = await Goal.findOne({ _id: req.params.id });

        if (!goal) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        if (goal.author != id) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        await Goal.deleteOne({ _id: req.params.id });

        return res.status(200).json({ message: 'Goal deleted' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports = { index, create, show, update, remove };