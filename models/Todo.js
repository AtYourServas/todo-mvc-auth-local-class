const mongoose = require('mongoose')

const TodoSchema = new mongoose.Schema({  // set up schema (blueprint) in mongoose
  todo: {    // task description
    type: String,  // set type that must be a string to be valid
    required: true,  // can't send to database if this is empty
  },
  completed: {  // mark if task is completed
    type: Boolean,  // can only be true/false
    required: true,  // can't send to database if this is empty
  },
  userId: {  // link task to user 
    type: String,  // set type that must be a string to be valid
    required: true  // can't send to database if this is empty
  }
})

module.exports = mongoose.model('Todo', TodoSchema)  // export as a model to help us build our documents.  named as 'Todo' and assigning to 'TodoSchema' object we just built
