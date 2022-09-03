const passport = require('passport')  // passport for authentication
const validator = require('validator')  // validator used for validation of forms
const User = require('../models/User')  // calls in User model

 exports.getLogin = (req, res) => {
    if (req.user) {
      return res.redirect('/todos')  // if saved session and valid user, send to todos page
    }
    res.render('login', {  // send to login page if not logged in
      title: 'Login'
    })
  }
  
  exports.postLogin = (req, res, next) => {
    const validationErrors = []
    if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' })  // confirms valid email address entered
    if (validator.isEmpty(req.body.password)) validationErrors.push({ msg: 'Password cannot be blank.' })  // confirms password field is not empty
  
    if (validationErrors.length) {
      req.flash('errors', validationErrors)
      return res.redirect('/login')
    }
    req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false })
  
    passport.authenticate('local', (err, user, info) => {  // authenticate user against what is stored in database
      if (err) { return next(err) }
      if (!user) {  // if they are not a user or login doesn't work, redirect to login page
        req.flash('errors', info)
        return res.redirect('/login')
      }
      req.logIn(user, (err) => {  // if successful, send to todos page
        if (err) { return next(err) }
        req.flash('success', { msg: 'Success! You are logged in.' })
        res.redirect(req.session.returnTo || '/todos')
      })
    })(req, res, next)
  }
  
  exports.logout = (req, res) => {
    req.logout(() => {
      console.log('User has logged out.')
    })
    req.session.destroy((err) => {  // destroys session
      if (err) console.log('Error : Failed to destroy the session during logout.', err)
      req.user = null  
      res.redirect('/')  // redirect to home page
    })
  }
  
  exports.getSignup = (req, res) => {
    if (req.user) {
      return res.redirect('/todos')  // if already a user, send to todo page
    }
    res.render('signup', {  // render signup page if not already a user
      title: 'Create Account'
    })
  }
  
  exports.postSignup = (req, res, next) => {
    const validationErrors = []  // empty array to hold validation errors
    if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' })  // check if email is valid
    if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' })  // check if password is at least 8 characters
    if (req.body.password !== req.body.confirmPassword) validationErrors.push({ msg: 'Passwords do not match' })  // check if password fields match
  
    if (validationErrors.length) {
      req.flash('errors', validationErrors)
      return res.redirect('../signup')
    }
    req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false })
  
    const user = new User({  // using User model, create a new user
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password
    })
  
    User.findOne({$or: [  // check to see if user already exists
      {email: req.body.email},
      {userName: req.body.userName}
    ]}, (err, existingUser) => {  // identifies what to do if user already exists
      if (err) { return next(err) }
      if (existingUser) {
        req.flash('errors', { msg: 'Account with that email address or username already exists.' })  // pass message that user already exists
        return res.redirect('../signup')  // redirect to sign up page again
      }
      user.save((err) => {  // if user does not exist, save as new user
        if (err) { return next(err) }
        req.logIn(user, (err) => {  // log in the new user
          if (err) {
            return next(err)
          }
          res.redirect('/todos')  // send the new user to the todos page
        })
      })
    })
  }