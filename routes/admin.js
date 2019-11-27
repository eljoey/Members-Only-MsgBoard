const express = require('express')
const router = express.Router()

const admin_controller = require('../controllers/adminController')

router.get('/', admin_controller.admin_panel_get)

router.post('/', admin_controller.admin_panel_post)

module.exports = router
