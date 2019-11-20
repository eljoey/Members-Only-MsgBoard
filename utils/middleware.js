const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const User = require('../models/user')

const loginHandling = new LocalStrategy((username, password, done) => {
  User.findOne({ username: username }, (err, user) => {
    if (err) return done(err)

    if (!user) {
      return done(null, false, { msg: 'Incorrect Username' })
    }

    bcrypt.compare(password, user.password, (err, res) => {
      if (res) {
        // Passwords match.  Login user

        return done(null, user)
      } else {
        // Passwords dont match.
        return done(null, false, { msg: 'Incorrect Password' })
      }
    })
  })
})

const passdownLoggedInUser = (req, res, next) => {
  res.locals.currentUser = req.user
  next()
}

const errorHandling = (req, res, next) => {
  next(createError(404))
}

const developmentErrorHandling = (err, req, res, next) => {
  // set locals only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
}

module.exports = {
  loginHandling,
  passdownLoggedInUser,
  errorHandling,
  developmentErrorHandling
}
