const User = require('../models/user')
const Note = require('../models/note')
const Folder = require('../models/folder')
const auth = require('../middleware/auth-service')

async function verifyID(id, res) {
    if (!id) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    return true;
}

async function index(req, res){
    try {
        const id = auth.getUserID(req)
        if (!(await verifyID(id, res))) return;

        const notes = await Note.find({ author: id })
            .populate("author", "username");

        return res.status(200).json({ notes });
    } catch (err) {
        console.error("Error fetching notes:", err.message);
        return res.status(500).json({message: err.message})
    }
}

async function indexFolder(req, res){
    const id = auth.getUserID(req)

    Folder.findOne({_id: req.params.folderID})
    .then(folder => {
        if (!folder) 
            return res.status(404).json({message: 'Folder not found'})

        if (folder.author != id) 
            return res.status(403).json({message: 'Unauthorized'})

        Note.find({_id: folder.notes})
        .then(notes => {
            return res.status(200).json({notes: notes})
        })
        .catch(err => {
            return res.status(500).json({message: err.message})
        })
    })
}

async function create(req, res){
    try{
        const id = auth.getUserID(req)
        if (!(await verifyID(id, res))) return;

        User.findOne({_id: id})
        .then(user => {
            if(!user) return res.status(500).json()
                
            const note = new Note({
                title: req.body.title,
                content: req.body.content,
            })

            note.author = user._id
            note.save()
            .then(note => {
                return res.status(201).json({note: note})
            })
        })
    } catch (err){
        console.error("Error creating note:", err.message);
        return res.status(500).json({message: err.message})
    }
}

async function createInFolder(req, res){
    const id = auth.getUserID(req)

    User.findOne({_id: id})
    .then(user => {
        if(!user) return res.status(500).json()
        
        Folder.findOne({_id: req.params.folderID})
        .then(folder => {
            if (!folder) 
                return res.status(404).json({message: 'Folder not found'})
            
            if (folder.author != id) 
                return res.status(403).json({message: 'Unauthorized'})

            const note = new Note({
                title: req.body.title,
                content: req.body.content,
            })
    
            note.author = user._id
            note.save()

            folder.notes.push(note)
            folder.save()

            .then(note => {
                return res.status(201).json({folder: note})
            })
            .catch(err => {
                return res.status(500).json({message: err.message})
            })
        })
            
    })
}

async function show(req, res){
    try{
        const id = auth.getUserID(req);
        if (!(await verifyID(id, res))) return;

        Note.findOne({_id: req.params.id})
        .then(note => {
            if (!note) 
                return res.status(404).json({message: 'Note not found'})

            if (note.author != id) 
                return res.status(403).json({message: 'Unauthorized'})

            return res.status(200).json({note: note})
        })
    } catch(error){
        console.error("Error fetching note:", error.message);
        return res.status(500).json({message: error.message})
    }
}

async function update(req, res) {
    try {
        const id = auth.getUserID(req);
        if (!(await verifyID(id, res))) return;

        const note = await Note.findOne({ _id: req.params.id });
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        if (note.author.toString() !== id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        if (req.body.title) note.title = req.body.title;
        if (req.body.content) note.content = req.body.content;
        note.lastSaved = Date.now();

        const updatedNote = await note.save();
        return res.status(200).json({ note: updatedNote });
    } catch (err) {
        console.error("Error updating note:", err.message);
        return res.status(500).json({message: err.message})
    }
}

async function remove(req, res) {
    try {
        const id = auth.getUserID(req);
        if (!(await verifyID(id, res))) return;

        Note.findOne({_id: req.params.id})
        .then(note => {
            if (!note) 
                return res.status(404).json({message: 'Note not found'})

            if (note.author != id) 
                return res.status(403).json({message: 'Unauthorized'})

            Note.deleteOne({_id: req.params.id})
            .then(note => {
                return res.status(200).json({message: 'Note deleted'})
            })
        })
    } catch (err){
        console.error("Error deleting note:", err.message);
        return res.status(500).json({message: err.message})
    }
}

module.exports = {index, indexFolder, create, createInFolder, show, update, remove}