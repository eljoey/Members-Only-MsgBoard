const User = require('../models/user')

const async = require('async')
const { body, validationResult, sanitizeBody } = require('express-validator')

exports.login_get = (req, res, next) => {
  res.send('Login: GET')
}

exports.login_post = (req, res, next) => {
  res.send('Login: POST')
}
