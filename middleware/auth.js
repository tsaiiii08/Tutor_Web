const { ensureAuthenticated, getUser } = require('../helpers/auth-helpers')
const authenticated = (req, res, next) => {
  if (ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('users/signIn')
}
const authenticatedAdmin = (req, res, next) => {
  if (ensureAuthenticated(req)) {
    if (getUser(req).isAdmin) return next()
    res.redirect('/lessons')
  } else {
    res.redirect('users/signIn')
  }
}
module.exports = {
  authenticated,
  authenticatedAdmin
}