const { getUser } = require('../../helpers/auth-helpers')
const adminController = {
  getUsers: (req, res) => {
    const user = getUser(req)
    res.render('admin/users', { user })

  }
}

module.exports = adminController