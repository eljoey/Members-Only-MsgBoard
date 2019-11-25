const User = require('../models/user')

const { body, validationResult, sanitizeBody } = require('express-validator')

exports.member_join_get = (req, res, next) => {
  res.render('join_form', {
    title: 'Secret Club Member Form'
  })
}

exports.member_join_post = [
  body('passcode', 'Wrong passcode! try the numbered version')
    .trim()
    .equals('4'),

  sanitizeBody('passcode').escape(),

  (req, res, next) => {
    // Prevent test user JaneDoe from becoming a member
    if (res.locals.currentUser.username === 'JaneDoe') {
      const errors = [
        {
          msg: 'This Account is Unable to Become a Member!'
        }
      ]

      res.render('join_form', {
        title: 'Secret Club Member Form',
        errors: errors
      })
      return
    }

    const errors = validationResult(req)

    const user = new User({
      ...res.locals.currentUser.toObject(),
      membership: 'member'
    })

    if (!errors.isEmpty()) {
      res.render('join_form', {
        title: 'Secret Club Member Form',
        errors: errors.array()
      })
      return
    } else {
      User.findByIdAndUpdate(
        res.locals.currentUser._id,
        user,
        {},
        (err, updatedUser) => {
          if (err) return next(err)

          res.redirect('/messages')
        }
      )
    }
  }
]
