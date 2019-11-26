const express = require('express')
const router = express.Router()

const message_controller = require('../controllers/messagesController')

router.get('/', message_controller.messages_get)

router.post('/', message_controller.messages_post)

// GET, Create post
router.get('/create', message_controller.message_create_get)

// POST, Create post
router.post('/create', message_controller.message_create_post)

module.exports = router
