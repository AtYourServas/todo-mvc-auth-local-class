const express = require('express')  // setting up express
const router = express.Router()  // setting up router functionality
const todosController = require('../controllers/todos') // declaring controller to be used
const { ensureAuth } = require('../middleware/auth')  // middleware that verifies user is logged in

router.get('/', ensureAuth, todosController.getTodos)  // verifies logged in and gets todos page for user

router.post('/createTodo', todosController.createTodo)  // calls controller for creating todo form submission

router.put('/markComplete', todosController.markComplete)  // calls controller to mark a task as complete

router.put('/markIncomplete', todosController.markIncomplete)  // calls controller to mark a task as incomplete

router.delete('/deleteTodo', todosController.deleteTodo)  // calls controller to delete a task

module.exports = router