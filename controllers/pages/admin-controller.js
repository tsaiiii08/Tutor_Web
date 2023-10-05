const { User } = require('../../models')
const adminController = {
  getUsers: (req, res) => {
    User.findAll({
      where: { isAdmin: false },
      raw: true

    })
      .then((users) => {
        users.forEach(user => {
          if (user.isTeacher === 0) {
            user.identity = '學生'
          } else {
            user.identity = '老師'
          }
        })
        console.log(users)
        res.render('admin/users', { users })
      })
  }
}

module.exports = adminController
