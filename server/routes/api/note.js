const express = require('express')
const router = express.Router()
const controller = require('../../controllers/noteController')
const auth = require('../../middleware/auth-service')

router.get('/', auth.verifyToken, controller.index)
router.post('/create', auth.verifyToken, controller.create)
router.get('/:id', auth.verifyToken, controller.show)
router.patch('/update/:id', auth.verifyToken, controller.update)
router.post('/delete/:id', auth.verifyToken, controller.remove)

module.exports = router