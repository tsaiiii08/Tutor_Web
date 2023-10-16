'use strict'
const { datesInPeriod, allLessonTime, dateForward } = require('../helpers/date-helpers')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const students = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE is_teacher = ? AND is_admin = ?',
      {
        replacements: ['0', '0'],
        type: queryInterface.sequelize.QueryTypes.SELECT
      })
    const lessons = await queryInterface.sequelize.query(
      'SELECT * FROM Lessons',
      { type: queryInterface.sequelize.QueryTypes.SELECT })
    const randomLessonsTime = []
    
    for (let j = 0; j < lessons.length; j++) {
      const avaiLessonTime = allLessonTime(datesInPeriod(lessons[j].updated_at, lessons[j].available_day), lessons[j].time_per_class)
      
      const randomLessonTime = avaiLessonTime[Math.floor(Math.random() * avaiLessonTime.length)].start // 將上面該lesson可預約時段中隨機選一個時段 (因預設的lesson總長度為10，只須選一個時段當作新的預約以及將此時段的日期往前推當作已上完課紀錄，這樣所有時段量就會是10*2 =20)
      randomLessonsTime.push({ id: lessons[j].id, time: randomLessonTime }, { id: lessons[j].id, time: dateForward(randomLessonTime) }) // 將上面隨機時段存進randomLessonsTime
     //以及將上面隨機時段再往前推二十一天存進randomLessonsTime，因為希望有已上完課的紀錄
    }
   

    await queryInterface.bulkInsert('Enrollments',
      Array.from({ length: 20 }, (_, i) => ({ // 五個學生，因每個人至少要兩個已上課紀錄和兩個新預約課程紀錄，故// 總長度為20
        lesson_id: randomLessonsTime[i].id,
        student_id: students[Math.floor(i / 4)].id, // 一個學生有四筆enrollment
        time: randomLessonsTime[i].time,
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Enrollments', {})
  }
}
