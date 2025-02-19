const express = require('express')
const router = express.Router()
const controller = require('../../controllers/noteController')
const auth = require('../../middleware/auth-service')

// router.get('/', auth.requireLogin, controller.index)
router.post('/create', auth.verifyToken, controller.create)
// router.get('/:id', auth.requireLogin, controller.show)
// router.patch('/update/:id', auth.requireLogin, controller.update)
// router.post('/delete/:id', auth.requireLogin, controller.remove)

module.exports = router