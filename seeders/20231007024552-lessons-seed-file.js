'use strict'
const { randomAvaiDay } = require('../helpers/date-helpers')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE is_teacher = ?',
      {
        replacements: ['1'],
        type: queryInterface.sequelize.QueryTypes.SELECT
      })
    const name = ['多益', '雃思', '全民英檢', '托福']
    const classTime = [30, 60]

    await queryInterface.bulkInsert('Lessons',
      Array.from({ length: users.length }, (_, i) => ({
        name: name[Math.floor(Math.random() * name.length)],
        time_per_class: classTime[Math.floor(Math.random() * classTime.length)],
        available_day: randomAvaiDay(),
        link: 'https://meet.google.com/umz-hhen-etn',
        created_at: new Date(),
        updated_at: new Date(),
        teacher_id: users[i].id
      }))
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Lessons', {})
  }
}
