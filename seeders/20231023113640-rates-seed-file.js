'use strict'

const { ifNotPast } = require('../helpers/date-helpers')

/** @type {import('sequelize-cli').Migration} */

module.exports = {

  async up (queryInterface, Sequelize) {
    const enrollments = await queryInterface.sequelize.query(
      'SELECT * FROM Enrollments ', { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const rates = [{ score: 1, comment: '老師教的都聽不懂' }, { score: 2, comment: '能吸收得有點少，老師教太快' }, { score: 3, comment: '老師算是有耐心，但上課有點枯燥乏味' }, { score: 4, comment: '上課內容很有趣且實用' }, { score: 5, comment: '老師很有教學熱忱，很會引導學生，內容也很有趣' }]
    let lessonsRec = [] // 紀錄該lesson的enrollment已被選取幾次
    let completedRec = []// 將每個課程找到的兩個已完課紀錄存進去
    for (let i = 0; i < enrollments.length; i++) {
      // 找出enrollments內已經上完課的紀錄
      if (!(ifNotPast(enrollments[i].time))) {
        const index = lessonsRec?.findIndex(l => {
          return (l?.lessonId === enrollments[i].lesson_id)
        })
        if (index === -1) {
          lessonsRec.push({ lessonId: enrollments[i].lesson_id, count: 1 })
          completedRec.push(enrollments[i].id)
        } else if (index > -1 && lessonsRec[index]?.count < 2) {
          completedRec.push(enrollments[i].id)
          lessonsRec[index].count++
        }
      }
    }
    await queryInterface.bulkInsert('Rates',

      Array.from({ length: 20 }, (_, i) => ({ // 一個課程兩個評價，共十個課程
        enrollment_id: completedRec[i],
        score: rates[i % 5].score,
        comment: rates[i % 5].comment,
        created_at: new Date(),
        updated_at: new Date()
      }))

    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Rates', {})
  }

}
