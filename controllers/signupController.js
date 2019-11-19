const User = require('../models/user')

const async = require('async')
const { body, validationResult, sanitizeBody } = require('express-validator')

exports.signup_get = (req, res, next) => {
  res.render('signup', {
    title: 'Sign Up'
  })
}

exports.signup_post = (req, res, next) => {
  res.send('Signup: POST')
}
