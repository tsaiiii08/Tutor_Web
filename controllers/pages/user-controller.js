const bcrypt = require('bcryptjs')
const { User } = require('../../models')
const userController = {
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res, next) => {
    req.flash('success_message', '成功登入!')
    res.redirect('/lessons')
  },
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.confirmPassword) throw new Error('密碼與確認密碼不相符!')
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('此電子郵件已被註冊過了!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        email: req.body.email,
        name: req.body.name,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！')
        res.redirect('/users/signIn')
      })
      .catch(err => next(err))
  },
  logout: (req, res, next) => {
    req.logout(req.user, (err) => {
      if (err) return next(err)
      req.flash('success_messages', '成功登出!')
      res.redirect('/users/signIn')
    })
  }

}

module.exports = userController
