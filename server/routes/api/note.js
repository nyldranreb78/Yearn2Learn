const express = require('express')
const router = express.Router()
const controller = require('../../controllers/noteController')
const auth = require('../../middleware/auth-service')

// Get all notes
router.get('/', auth.verifyToken, controller.index)

// Get all notes in folder
router.get('/:folderID/note', auth.verifyToken, controller.indexFolder)

// Get a specific note
router.get('/:id', auth.verifyToken, controller.show)

// Create a new note in folder
router.post('/:folderID/create', auth.verifyToken ,controller.createInFolder)

// Create a free note
router.post('/create', auth.verifyToken ,controller.create)

// Update a specific note
router.patch('/:id', auth.verifyToken, controller.update)

// Delete a specific note
router.delete('/:id', auth.verifyToken, controller.remove)

module.exports = router