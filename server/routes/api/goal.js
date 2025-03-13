const express = require('express')
const router = express.Router()
const controller = require('../../controllers/goalController')
const auth = require('../../middleware/auth-service')

// Get all goals
router.get('/', auth.verifyToken, controller.index)

// Create a new goal
router.post('/create', auth.verifyToken ,controller.create)

// Get a specific goal
router.get('/:id', auth.verifyToken, controller.show)

// Update a specific goal
router.patch('/:id', auth.verifyToken, controller.update)

// Delete a specific goal
router.delete('/:id', auth.verifyToken, controller.remove)

module.exports = router