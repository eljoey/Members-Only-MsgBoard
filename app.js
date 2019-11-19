require('dotenv').config()

const createError = require('http-errors')
const express = require('express')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const path = require('path')

const app = express()

// Routers
const loginRouter = require('./routes/login')
const signupRouter = require('./routes/signup')
const messagesRouter = require('./routes/messages')

// Mongoose
const mongoose = require('mongoose')
const mongoDB = process.env.MONGODB_URI

console.log('Connecting to MongoDB...')
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error: '))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, 'public')))

// Views
app.get('/', (req, res) => res.render('index'))
app.use('/login', loginRouter)
app.use('/signup', signupRouter)
app.use('/messages', messagesRouter)

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
