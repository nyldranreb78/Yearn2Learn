const express = require('express')
const router = express.Router()
const controller = require('../../controllers/folderController')
const auth = require('../../middleware/auth-service')

// Get all folders
router.get('/', auth.verifyToken, controller.index)

// Create a new folder
router.post('/create', auth.verifyToken ,controller.create)

// Get a specific folder
router.get('/:id', auth.verifyToken, controller.show)

// Update a specific folder
router.patch('/:id', auth.verifyToken, controller.update)

// Delete a specific folder
router.delete('/:id', auth.verifyToken, controller.remove)

// Delete all folders for integration tests
router.delete('/delete-all-folders', controller.removeAll)

module.exports = router