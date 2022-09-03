const express = require('express')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('express-flash')
const logger = require('morgan')
const connectDB = require('./config/database')  // set up connection to database in another file so we can call upon later
const mainRoutes = require('./routes/main')  // location of additional paths you can send data too
const todoRoutes = require('./routes/todos')  // location of additiona routes for todo page

require('dotenv').config({path: './config/.env'})  // identifies where environment variables are stored

// Passport config
require('./config/passport')(passport)

connectDB()  // starts connection to database

app.set('view engine', 'ejs')  // identifying EJS for views
app.use(express.static('public'))  // identifying location of pu blic folder
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(logger('dev'))
// Sessions
app.use(  // when a user logs in they are given a session... this session is stored in the database
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
  )
  
// Passport middleware for authentication
app.use(passport.initialize())  
app.use(passport.session())

app.use(flash())  // initializing flash for error messages

// Routes
app.use('/', mainRoutes)
app.use('/todos', todoRoutes)


// Set up server on port
app.listen(process.env.PORT, ()=>{
    console.log('Server is running, you better catch it!')
})    