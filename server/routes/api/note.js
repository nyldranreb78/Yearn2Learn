const express = require('express')
const router = express.Router()
const controller = require('../../controllers/noteController')
const auth = require('../../middleware/auth-service')

// router.get('/', auth.requireLogin, controller.index)
// router.post('/create', auth.requireLogin ,controller.create)

router.get('/', controller.index)
router.post('/create' ,controller.create)
router.get('/:id', controller.show)
router.put('/update/:id', controller.update)
router.post('/delete/:id', controller.remove)

module.exports = router