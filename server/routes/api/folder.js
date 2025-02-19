const express = require('express')
const router = express.Router()
const controller = require('../../controllers/folderController')
const auth = require('../../middleware/auth-service')

// Get all folders
router.get('/', auth.requireLogin, controller.index)

// Create a new folder
router.post('/create', auth.requireLogin ,controller.create)

// Get a specific folder
router.get('/:id', auth.requireLogin, controller.show)

// Update a specific folder
router.patch('/:id', auth.requireLogin, controller.update)

// Delete a specific folder
router.delete('/:id', auth.requireLogin, controller.remove)

module.exports = router