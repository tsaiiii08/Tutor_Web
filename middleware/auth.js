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
const authenticatedStudent = (req, res, next) => {
  if (ensureAuthenticated(req)) {
    if (!(getUser(req).isTeacher)) return next()
    req.flash('error_messages', '你已經是老師身份了!')
    res.redirect('/lessons')
  } else {
    res.redirect('users/signIn')
  }
}
module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedStudent
}
