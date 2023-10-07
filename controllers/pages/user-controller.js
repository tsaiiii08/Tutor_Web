const bcrypt = require('bcryptjs')
const { User, Lesson } = require('../../models')
const userController = {
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res, next) => {
    req.flash('success_messages', '成功登入!')
    res.redirect('/lessons')
  },
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (!req.body.name || !req.body.email || !req.body.password || !req.body.confirmPassword) throw new Error('所有欄位皆為必填！')
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('此電子郵件此被註冊過了！')
        if (req.body.password !== req.body.confirmPassword) throw new Error('密碼與確認密碼不相符！')
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
  },
  becTeacherPage: (req, res, next) => {
    res.render('becTeacher')
  },
  becTeacher: (req, res, next) => {
    if (!req.body.name || !req.body.link || !req.body.timePerClass || !req.body.availableDay) throw new Error('除了課程介紹外，其餘欄位皆為必填！')
    Promise.all([
      Lesson.findOne({ where: { teacherId: req.user.id } }),
      User.findByPk(req.user.id)
    ])
      .then(([lesson, user]) => {
        if (lesson) {
          throw new Error('你已經有課程了!')
        }
        Lesson.create({
          teacherId: req.user.id,
          name: req.body.name,
          introduction: req.body.introduction,
          link: req.body.link,
          timePerClass: req.body.timePerClass,
          availableDay: req.body.availableDay.join('')
        })
        return user.update({ isTeacher: true })
      })
      .then(() => {
        req.flash('success_messages', '已成功成為老師!')
        res.redirect('/lessons')
      })
      .catch(err => next(err))
  }
}

module.exports = userController
