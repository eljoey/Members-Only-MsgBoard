const Message = require('../models/message')

const async = require('async')
const { body, validationResult, sanitizeBody } = require('express-validator')

exports.messages_get = (req, res, next) => {
  res.send('Messages: GET')
}

exports.message_create_get = (req, res, next) => {
  res.render('message_form')
}

exports.message_create_post = (req, res, next) => {
  res.send('Create Message: POST')
}
