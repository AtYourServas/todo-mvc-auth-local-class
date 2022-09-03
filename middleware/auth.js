module.exports = {
    ensureAuth: function (req, res, next) {
      if (req.isAuthenticated()) {  // check if authenticated
        return next()  // if so, passes on next function
      } else {
        res.redirect('/')  // if not authenticated, redirect to homepage
      }
    },
    ensureGuest: function (req, res, next) {
      if (req.isAuthenticated()) {  // check if authenticated
        res.redirect('/home')  // if not authenticated, send to login page 
      } else {
        return next()  // if so, redirected to home.ejs landing page
      }
    }
  }
  