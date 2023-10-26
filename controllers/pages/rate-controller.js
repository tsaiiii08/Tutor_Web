const { Enrollment, Lesson, Rate } = require('../../models')
const { timeFormater } = require('../../helpers/date-helpers')
const rateController = {
  ratePage: (req, res) => {
    Enrollment.findOne({
      where: { id: req.params.enrollmentId },
      include: Lesson,
      raw: true,
      nest: true

    })
      .then((enrollment) => {
        enrollment.time = timeFormater(enrollment.time, enrollment.Lesson.timePerClass)
        res.render('rate', { enrollment })
      })
  },
  rate: (req, res, next) => {
    if (!req.body.score) throw Error('要選擇分數')
    Enrollment.findOne({
      where: { id: req.params.enrollmentId },
      raw: true
    })
      .then((enrollment) => {
        if (req.user.id !== enrollment.studentId) throw Error('非該次課程上課者，不得評價')
        Rate.create({
          enrollmentId: req.params.enrollmentId,
          score: req.body.score,
          comment: req.body.comment
        })
      })
      .then(() => {
        req.flash('success_messages', `已成功送出評價!`)
        res.redirect(`/users/${req.user.id}`)
      })
      .catch(err => next(err))
  }
}

module.exports = rateController
