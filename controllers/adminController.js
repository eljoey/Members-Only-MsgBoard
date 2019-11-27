const User = require('../models/user')

const {
  body,
  oneOf,
  validationResult,
  sanitizeBody
} = require('express-validator')

exports.admin_panel_get = (req, res, next) => {
  // Check if there is a currentUser and if they're an admin
  if (!res.locals.currentUser || !res.locals.currentUser.admin) {
    res.redirect('/')
  }

  // Find all non admin users
  User.find({ admin: false }).exec((err, userList) => {
    if (err) return next(err)

    userList.sort((a, b) => a.username.localeCompare(b.username))

    res.render('admin_panel', {
      title: 'Admin Panel',
      users: userList
    })
  })
}

exports.admin_panel_post = [
  oneOf([
    body('membership').equals('non-member'),
    body('membership').equals('member')
  ]),

  sanitizeBody('membership').escape(),
  sanitizeBody('userid').escape(),

  (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      res.redirect('/admin')
      return
    } else {
      // Find out if this is bad practice(having a update inside of a find)
      User.findById(req.body.userid).exec((err, foundUser) => {
        if (err) return next(err)

        const user = new User({
          ...foundUser.toObject(),
          membership: req.body.membership
        })

        User.findByIdAndUpdate(
          req.body.userid,
          user,
          {},
          (err, updatedUser) => {
            if (err) return next(err)

            res.redirect('/admin')
          }
        )
      })
    }
  }
]
