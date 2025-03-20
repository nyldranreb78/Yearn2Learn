const express = require('express')
const router = express.Router()
const authControllers = require('../../controllers/authController')
const authMiddleware = require('../../middleware/auth')

// Register a new user
router.post('/register', authControllers.register)

// Login a new user
router.post('/login', authControllers.login)

// Logout a new user
router.post('/logout', authControllers.logout)

// Assign a new token on refresh
router.post('/refresh', authControllers.refresh)

// Get user
router.get('/user', authMiddleware, authControllers.user)

// Delete user for integration tests
router.post('/delete-test-user', authControllers.deleteTestUser)

module.exports = router