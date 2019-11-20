const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/', (req, res, next) => {
  // console.log(req.msg)
  res.render('login', {
    title: 'Please Log In'
  })
})

router.post('/', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err)
    }

    if (!user) {
      return res.render('login', {
        title: 'Please Log In',
        info: info
      })
    }

    req.logIn(user, err => {
      if (err) {
        return next(err)
      }

      return res.redirect('/')
    })
  })(req, res, next)
})

module.exports = router
