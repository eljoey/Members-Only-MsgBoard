require('dotenv').config()

const createError = require('http-errors')
const express = require('express')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const path = require('path')
const bcrypt = require('bcryptjs')

const User = require('./models/user')

const app = express()

// Routers
const loginRouter = require('./routes/login')
const signupRouter = require('./routes/signup')
const messagesRouter = require('./routes/messages')
const logoutRouter = require('./routes/logout')

// Mongoose
const mongoose = require('mongoose')
const mongoDB = process.env.MONGODB_URI

console.log('Connecting to MongoDB...')
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error: '))

// Views Settings
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// Setup for Password Auth
passport.use(
  new LocalStrategy((username, password, done) => {
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
)

// Sessions and serialization
passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user)
  })
})

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, 'public')))

// Make logged in user available to app
app.use((req, res, next) => {
  res.locals.currentUser = req.user
  next()
})

// Views
app.get('/', (req, res) => res.render('index', { user: req.user }))
app.use('/login', loginRouter)
app.use('/signup', signupRouter)
app.use('/messages', messagesRouter)
app.use('/logout', logoutRouter)

// Error handling
app.use((req, res, next) => {
  next(createError(404))
})

app.use((err, req, res, next) => {
  // set locals only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

app.listen(3000, () => console.log('applistening on port 3000!'))
