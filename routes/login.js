const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/', (req, res, next) => {
  res.render('login', {
    title: 'Please Log In'
  })
})

router.post('/', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err)
    }

    // Allows showing of why user login failed.
    if (!user) {
      return res.render('login', {
        title: 'Please Log In',
        info: info
      })
    }

    // Login was successfull, redirect to homepage.
    req.logIn(user, err => {
      if (err) {
        return next(err)
      }

      return res.redirect('/')
    })
  })(req, res, next)
})

module.exports = router
