const { Op } = require('sequelize')
const sequelize = require('sequelize')
const { Lesson, User, Enrollment } = require('../../models/index')
const { getOffset, getPagination } = require('../../helpers/pagination-helper')
const { datesInPeriod, allLessonTime, avaiLessonTime, timeFormater } = require('../../helpers/date-helpers')
const lessonController = {
  getLessons: (req, res, next) => {
    const keyword = req.query.keyword || ''
    const DEFAULT_LESSON_LIMIT = 6
    const page = Number(req.query.page) || 1
    const limit = DEFAULT_LESSON_LIMIT
    const offset = getOffset(limit, page)
    Promise.all([User.findAll({ // 算出所有學生目前已上課的分鐘數，並照分鐘數排序
      include: [{ model: Enrollment, include: Lesson }],
      where: {
        [Op.and]:
          [{ isAdmin: false }, { isTeacher: false }, { '$Enrollments.time$': { [Op.lt]: new Date() } }]
      },
      attributes: ['id',
        'name',
        'avatar',
        [sequelize.fn('sum', sequelize.col('Enrollments.Lesson.time_per_class')), 'totalTime']
      ],
      group: ['id'],
      order: [
        ['totalTime', 'DESC']
      ],
      raw: true,
      nest: true
    }),
    Lesson.findAndCountAll({
      include: User,
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${keyword?.toLowerCase()}%` } },
          { '$User.name$': { [Op.like]: `%${keyword?.toLowerCase()}%` } }
        ]
      },
      limit,
      offset,
      raw: true,
      nest: true
    })
    ])
      .then(([Users, lessons]) => {
        const topTenUsers = Users.slice(0, 10) // 只選取學習時數前十的學生
        topTenUsers.forEach((user, index) => {
          user.rank = index + 1
        })
        lessons.rows.forEach(lesson => {
          lesson.introduction = lesson.introduction?.substring(0, 20)
        })
        res.render('lessons', {
          lessons: lessons.rows, keyword, pagination: getPagination(limit, page, lessons.count), topTenUsers
        })
      })
      .catch(err => next(err))
  },
  getLesson: (req, res, next) => {
    Lesson.findByPk(req.params.id, { include: [User, { model: Enrollment, include: User }], nest: true, raw: false })
      .then((lesson) => {
        let noAvaiTime = false
        const lessonTime = allLessonTime(datesInPeriod(new Date(), lesson.availableDay), lesson.timePerClass)
        const enrollTime = []
        lesson.Enrollments.forEach((en) => {
          enrollTime.push(en.time)
        })
        const avaiTimeToRender = []
        const avaiTime = avaiLessonTime(lessonTime, enrollTime)
        avaiTime.forEach(time => {
          avaiTimeToRender.push({ time, formatTime: timeFormater(time, lesson.timePerClass) })
        })
        if (!avaiTime.length) {
          noAvaiTime = true
        }
        res.render('lesson', { lesson: lesson.toJSON(), noAvaiTime, avaiTime: avaiTimeToRender })
      })
      .catch(err => next(err))
  }
}

module.exports = lessonController
