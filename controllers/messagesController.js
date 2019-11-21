const Message = require('../models/message')

const { body, validationResult, sanitizeBody } = require('express-validator')

exports.messages_get = (req, res, next) => {
  Message.find({})
    .populate('user')
    .exec((err, list_messages) => {
      if (err) return next(err)

      res.render('messages', {
        title: 'List of Messages',
        messages: list_messages
      })
    })
}

exports.message_create_get = (req, res, next) => {
  // Redirects to login if user is not logged in.
  if (res.locals.currentUser) {
    res.render('message_form', {
      title: 'Create New Message'
    })
  } else {
    res.redirect('/login')
  }
}

exports.message_create_post = [
  body('title', 'Title must not be empty')
    .trim()
    .isLength({ min: 1 }),
  body('message', 'Message must not be empty')
    .trim()
    .isLength({ min: 1 }),

  sanitizeBody('title').escape(),
  sanitizeBody('message').escape(),

  (req, res, next) => {
    const errors = validationResult(req)

    const message = new Message({
      title: req.body.title,
      text: req.body.message,
      user: res.locals.currentUser
    })

    if (!errors.isEmpty()) {
      res.render('message_form', {
        title: 'Create New Message',
        info: message,
        errors: errors.array()
      })
      return
    } else {
      message.save(err => {
        if (err) return next(err)

        res.redirect('/messages')
      })
    }
  }
]
