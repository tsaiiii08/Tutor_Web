const bcrypt = require('bcryptjs')
const { User, Lesson, Enrollment } = require('../../models')
const { imgurFileHandler } = require('../../helpers/file-helpers')
const { ifNotPast, timeFormater } = require('../../helpers/date-helpers')
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
    res.render('users/becTeacher')
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
  },
  getUser: (req, res, next) => {
    let canEdit = false
    if (req.user.id.toString() === req.params.id) {
      canEdit = true
    }
    User.findByPk(req.params.id, { raw: true })
      .then((user) => {
        if (!user) throw new Error('無此使用者!')
        const thisUser = user
        return thisUser
      })
      .then((thisUser) => {
        if (thisUser.isTeacher === 1) {
          Lesson.findOne({ where: { teacherId: req.params.id }, include: [{ model: Enrollment, include: User }], raw: false, nest: true })

            .then((lesson) => {
              const newSchedule = lesson.toJSON().Enrollments.filter((enrollment) => ifNotPast(enrollment.time))
              const scheduleToRender = newSchedule.map(en => ({
                ...en,
                time: timeFormater(en.time, lesson.dataValues.timePerClass)
              }))
              return res.render('users/profile', { thisUser, lesson: lesson.toJSON(), canEdit, schedule: scheduleToRender })
            })
        } else {
          Enrollment.findAll({ where: { studentId: thisUser.id }, include: [{ model: Lesson, include: User }], raw: true, nest: true })
            .then((enrollments) => {
              const newSchedule = enrollments.filter((enrollment) => ifNotPast(enrollment.time))
              const scheduleToRender = newSchedule.map(en => ({
                ...en,
                time: timeFormater(en.time, en.Lesson.timePerClass)
              }))
              res.render('users/profile', { thisUser, canEdit, schedule: scheduleToRender })
            })
        }
      })
      .catch(err => next(err))
  },
  editUserPage: (req, res, next) => {
    if (req.params.id !== (req.user.id.toString())) {
      return res.redirect(`users/${req.user.id}`)
    }
    Lesson.findOne({ where: { teacherId: req.user.id }, raw: true })
      .then(lesson => {
        res.render('users/edit', { lesson })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    if (req.params.id !== (req.user.id.toString())) {
      return res.redirect(`users/${req.user.id}`)
    }
    const { file } = req
    if (req.user.isTeacher === false) {
      if (!req.body.name) throw new Error('姓名為必填')
      Promise.all([
        User.findByPk(req.user.id),
        imgurFileHandler(file)
      ])
        .then(([user, filepath]) => {
          return user.update({
            name: req.body.name,
            nation: req.body.nation,
            introduction: req.body.introduction,
            avatar: filepath || user.avatar
          })
        })
        .then(() => {
          res.redirect(`/users/${req.user.id}`)
        })
        .catch(err => next(err))
    } else {
      if (!req.body.name || !req.body.lessonName || !req.body.link || !req.body.timePerClass || !req.body.availableDay) throw new Error('姓名、課程名稱、上課視訊連結、每堂課時間長度以及可以上課時間皆為必填！')
      console.log('yyy')
      Promise.all([
        Lesson.findOne({ where: { teacherId: req.user.id }, include: Enrollment, nest: true }),
        User.findByPk(req.user.id),
        imgurFileHandler(file)
      ])
        .then(([lesson, user, filepath]) => {
          console.log(lesson)
          return Promise.all([
            lesson.update({
              name: req.body.lessonName,
              introduction: req.body.lessonIntro,
              link: req.body.link,
              timePerClass: req.body.timePerClass,
              availableDay: req.body.availableDay.join('')
            }),
            user.update({
              name: req.body.name,
              nation: req.body.nation,
              introduction: req.body.introduction,
              avatar: filepath || user.avatar
            })
          ])
            .then(() => {
              res.redirect(`/users/${req.user.id}`)
            })
        })
        .catch(err => next(err))
    }
  }
}

module.exports = userController
