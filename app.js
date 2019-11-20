require('dotenv').config()

const createError = require('http-errors')
const express = require('express')
const session = require('express-session')
const passport = require('passport')
const path = require('path')
const middleware = require('./utils/middleware')

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
mongoose
  .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB')
  })

const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error: '))

// Views Settings
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// Session Handling
passport.use(middleware.loginHandling)
passport.serializeUser(middleware.serializeUser)
passport.deserializeUser(middleware.deserializeUser)

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, 'public')))

// Make logged in user available to app
app.use(middleware.passdownLoggedInUser)

// Views
app.get('/', (req, res) => res.render('index', { user: req.user }))
app.use('/login', loginRouter)
app.use('/signup', signupRouter)
app.use('/messages', messagesRouter)
app.use('/logout', logoutRouter)

// Error handling
app.use(middleware.errorHandling)
app.use(middleware.developmentErrorHandling)

const PORT = process.env.PORT
app.listen(PORT, () => console.log('applistening on port 3000!'))
