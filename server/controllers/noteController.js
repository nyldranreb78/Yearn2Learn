const User = require('../models/user')
const Note = require('../models/note')
const auth = require('../middleware/auth-service')

// async function index(req, res){
//     const id = auth.getUserID(req)

//     Note.find({author : id})
//     .populate('author', 'username', 'user')
//     .then(notes => {
//         return res.status(200).json({ notes : notes })
//     })
//     .catch(err => {
//         return res.status(500).json({message: err.message})
//     })
// }

async function create(req, res){
    const id = auth.getUserID(req)

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
        .catch(err => {
            return res.status(500).json({message: err.message})
        })
    })
}

// async function show(req, res){
//     const id = auth.getUserID(req)

//     Note.findOne({_id: req.params.id})
//     .then(note => {
//         if (!note) 
//             return res.status(404).json({message: 'Note not found'})

//         if (note.author != id) 
//             return res.status(403).json({message: 'Unauthorized'})

//         return res.status(200).json({note: note})
//     })
//     .catch(err => {
//         return res.status(500).json({message: err.message})
//     })
// }

// async function update(req, res) {
//     const id = auth.getUserID(req)

//     Note.findOne({_id: req.params.id})
//     .then(note => {
//         if (!note) 
//             return res.status(404).json({message: 'Note not found'})

//         if (note.author != id) 
//             return res.status(403).json({message: 'Unauthorized'})

//         note.title = req.body.title || note.title
//         note.content = req.body.content
//         note.save()
//         .then(note => {
//             return res.status(200).json({note: note})
//         })
//         .catch(err => {
//             return res.status(500).json({message: err.message})
//         })
//     })
// }

// async function remove(req, res) {
//     const id = auth.getUserID(req)
//     Note.findOne({_id: req.params.id})
//     .then(note => {
//         if (!note) 
//             return res.status(404).json({message: 'Note not found'})

//         if (note.author != id) 
//             return res.status(403).json({message: 'Unauthorized'})

//         Note.deleteOne({_id: req.params.id})
//         .then(note => {
//             return res.status(200).json({message: 'Note deleted'})
//         })
//     })
//     .catch(err => {
//         return res.status(500).json({message: err.message})
//     })
// }

module.exports = { create }
// module.exports = {index, create, show, update, remove}