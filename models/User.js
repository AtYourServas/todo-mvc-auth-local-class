const bcrypt = require('bcrypt')  // used to hash passwords
const mongoose = require('mongoose')  // call in mongoose to create schema and model

const UserSchema = new mongoose.Schema({
  userName: { type: String, unique: true },  // require string, must be unique to database
  email: { type: String, unique: true },  // require email, must be unique to database
  password: String  // password must be string
})


// Password hash middleware.
 
 UserSchema.pre('save', function save(next) {
  const user = this
  if (!user.isModified('password')) { return next() }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err) }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) { return next(err) }
      user.password = hash
      next()
    })
  })
})


// Helper method for validating user's password.

UserSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {  // compares password to database and if it is a match, allows login
    cb(err, isMatch)
  })
}


module.exports = mongoose.model('User', UserSchema)  // export as a model to help us build our documents.  named as 'User' and assigning to 'UserSchema' object we just built
