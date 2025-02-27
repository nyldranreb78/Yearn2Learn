const User = require('../models/user')
const Note = require('../models/note')
const Folder = require('../models/folder')
const auth = require('../middleware/auth-service')

async function index(req, res){
    const id = auth.getUserID(req)

    Folder.find({author : id})
    .populate('author', 'username', 'user')
    .then(folders => {
        return res.status(200).json({ folders : folders })
    })
    .catch(err => {
        return res.status(500).json({message: err.message})
    })
}

async function create(req, res){
    const id = auth.getUserID(req)

    User.findOne({_id: id})
    .then(user => {
        if(!user) return res.status(500).json()
            
        const folder = new Folder({
            name: req.body.name,
            priority: req.body.priority,
        })

        folder.author = user._id
        folder.save()
        .then(folder => {
            return res.status(201).json({folder: folder})
        })
        .catch(err => {
            return res.status(500).json({message: err.message})
        })
    })
}

async function show(req, res){
    const id = auth.getUserID(req)

    Folder.findOne({_id: req.params.id})
    .then(folder => {
        if (!folder) 
            return res.status(404).json({message: 'Folder not found'})

        if (folder.author != id) 
            return res.status(403).json({message: 'Unauthorized'})

        return res.status(200).json({notes: folder.notes})
    })
    .catch(err => {
        return res.status(500).json({message: err.message})
    })
}

async function update(req, res) {
    try {
        const id = auth.getUserID(req);
        
        // Find the folder
        const folder = await Folder.findOne({ _id: req.params.id });

        if (!folder) {
            return res.status(404).json({ message: 'Folder not found' });
        }

        if (folder.author.toString() !== id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Update only if new values are provided
        if (req.body.name) folder.name = req.body.name;
        if (req.body.priority !== undefined) folder.priority = req.body.priority;

        const updatedFolder = await folder.save();
        return res.status(200).json({ folder: updatedFolder });

    } catch (err) {
        console.error("Error updating folder:", err);
        return res.status(500).json({ message: err.message });
    }
}

async function remove(req, res) {
    const id = auth.getUserID(req)

    try {
        const folder = await Folder.findOne({_id: req.params.id})
        if (!folder) 
            return res.status(404).json({message: 'Folder not found'})

        if (folder.author != id) 
            return res.status(403).json({message: 'Unauthorized'})

        await Note.deleteMany({_id: {$in: folder.notes}})

        await folder.deleteOne({_id: req.params.id})
        return res.status(200).json({message: 'Folder deleted'})
    }
    catch (err)
    {
        return res.status(500).json({message: err.message})
    }
}

module.exports = { index, create, show, update, remove }