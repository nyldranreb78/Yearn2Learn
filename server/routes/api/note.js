const express = require('express')
const router = express.Router()
const controller = require('../../controllers/noteController')
const auth = require('../../middleware/auth-service')

// Get all notes
router.get('/', auth.requireLogin, controller.index)

// Get all notes in folder
router.get('/:folderID/note', auth.requireLogin, controller.indexFolder)

// Get a specific note
router.get('/:id', auth.requireLogin, controller.show)

// Create a new note in folder
router.post('/:folderID/create', auth.requireLogin ,controller.createInFolder)

// Create a free note
router.post('/create', auth.requireLogin ,controller.create)

// Update a specific note
router.patch('/:id', auth.requireLogin, controller.update)

// Delete a specific note
router.delete('/:id', auth.requireLogin, controller.remove)

module.exports = router