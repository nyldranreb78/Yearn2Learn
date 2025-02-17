const express = require('express')
const router = express.Router()
const controller = require('../../controllers/noteController')
const auth = require('../../middleware/auth-service')

router.get('/', auth.requireLogin, controller.index)
router.post('/create', auth.requireLogin ,controller.create)
router.get('/:id', auth.requireLogin, controller.show)
router.patch('/update/:id', auth.requireLogin, controller.update)
router.post('/delete/:id', auth.requireLogin, controller.remove)

// router.get('/', controller.index)
// router.post('/create' ,controller.create)
// router.get('/:id', controller.show)
// router.patch('/update/:id', controller.update)
// router.post('/delete/:id', controller.remove)

module.exports = router