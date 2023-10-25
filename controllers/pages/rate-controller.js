const { Enrollment, Lesson } = require('../../models')
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
        console.log(enrollment)
        enrollment.time = timeFormater(enrollment.time, enrollment.Lesson.timePerClass)
        res.render('rate', { enrollment })
      })
  }
}

module.exports = rateController
