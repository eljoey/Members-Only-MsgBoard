const User = require('../models/user')
const bcrypt = require('bcryptjs')

const { body, validationResult, sanitizeBody } = require('express-validator')

exports.signup_get = (req, res, next) => {
  res.render('signup', {
    title: 'Sign Up'
  })
}

exports.signup_post = [
  // Validate
  body('first_name', 'First Name must not be empty')
    .trim()
    .isLength({ min: 2 }),
  body('last_name', 'Last Name must not be empty')
    .trim()
    .isLength({ min: 2 }),
  body('username', 'Username must not be empty')
    .trim()
    .isLength({ min: 2 }),
  body('password', 'Password must be atleast 7 characters long')
    .trim()
    .isLength({ min: 7 }),
  body('confirm-pass', 'Passwords must match')
    .trim()
    .custom((value, { req }) => value === req.body.password),

  // Sanitize
  sanitizeBody('first_name').escape(),
  sanitizeBody('last_name').escape(),
  sanitizeBody('username').escape(),
  sanitizeBody('password').escape(),
  sanitizeBody('confirm-pass').escape(),

  // Process
  (req, res, next) => {
    const errors = validationResult(req)

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(req.body.password, salt)

    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      password: hash
    })

    if (!errors.isEmpty()) {
      res.render('signup', {
        title: 'Sign Up',
        user: user,
        errors: errors.array()
      })
      return
    } else {
      User.findOne({ username: req.body.email }).exec((err, found_user) => {
        if (err) return next(err)

        if (found_user) {
          const duplicateUser = { msg: 'Username already in use' }
          errors.errors.push(duplicateUser)

          res.render('signup', {
            title: 'Sign Up',
            user: user,
            errors: errors.array()
          })
          return
        } else {
          user.save(err => {
            if (err) return next(err)

            res.redirect('/')
          })
        }
      })
    }
  }
]
