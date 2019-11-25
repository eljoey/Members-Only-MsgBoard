const express = require('express')
const router = express.Router()

const member_controller = require('../controllers/memberController')

router.get('/join', member_controller.member_join_get)

router.post('/join', member_controller.member_join_post)

module.exports = router
