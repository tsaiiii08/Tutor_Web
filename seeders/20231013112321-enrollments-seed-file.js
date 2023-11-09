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
      const random1 = Math.floor(Math.random() * avaiLessonTime.length)
      const random2 = avaiLessonTime[random1 + 1] ? random1 + 1 : random1 - 1
      const randomLessonTime = avaiLessonTime[random1].start // 將上面該lesson可預約時段中隨機選一個時段 (因預設的lesson總長度為10，選一個時段後，將該時段和下一個(或上一個)時段當作新的預約以及將此時段的日期往前推以製作三個已上完課紀錄，這樣所有時段量就會是10*5 =50)
      randomLessonsTime.push({ id: lessons[j].id, time: randomLessonTime }, { id: lessons[j].id, time: avaiLessonTime[random2].start }, { id: lessons[j].id, time: dateForward(randomLessonTime, 15) }, { id: lessons[j].id, time: dateForward(randomLessonTime, 16) }, { id: lessons[j].id, time: dateForward(randomLessonTime, 17) }) // 將上面隨機時段存進randomLessonsTime
     //以及將上面隨機時段再往前推並存進randomLessonsTime，因為希望有已上完課的紀錄(往前推的天數要大於十四)
    }
   

    await queryInterface.bulkInsert('Enrollments',
      Array.from({ length: 50 }, (_, i) => ({ // 五個學生，因每個人至少要六個(兩個是已上完課未評價，四個是預計寫入rate種子資料的)已上課紀錄和四個新預約課程紀錄(因每個老師要有兩個，而老師人數為學生兩倍)，故// 總長度為50
        lesson_id: randomLessonsTime[i].id,
        student_id: students[Math.floor(i / 10)].id, // 一個學生有十筆enrollment
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
