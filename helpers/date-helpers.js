const randomAvaiDay = () => {
  const day = [0, 1, 2, 3, 4, 5, 6] // 0代表星期日，6則代表星期六
  let randomAvaiDay = ''
  // 隨機選出可上課的時間
  for (let i = 0; i < day.length; i++) {
    if (Math.floor(Math.random() * 2) === 1) {
      randomAvaiDay = randomAvaiDay + day[i]
    }
    // 若for loop已跑到最後且randomAvaiDay依舊是空字串，則需隨機加入0到6其中一個
    if ((i === 6) && (randomAvaiDay === '')) {
      randomAvaiDay = randomAvaiDay + day[Math.floor(Math.random() * day.length)]
    }
  }
  return randomAvaiDay
}

const datesInPeriod = (date, day) => { // 算出14內可預約的所有日期
  const PERIOD = 14 // 可選課時間目前設定為14天內
  const datesInPeriod = []
  for (let i = 1; i <= PERIOD; i++) {
    const targetDate = (date.setDate(date.getDate() + 1)) // date為lesson最近一次更新時間
    if (day.includes(date.getDay(targetDate))) { // day為老師選定的可預約星期x
      datesInPeriod.push(new Date(targetDate))
    }
  }
  return datesInPeriod
}

const avaiLessons = (dates, timePerClass) => { // 算出14內可預約的所有時段
  const avaiLessons = []
  if (timePerClass === 30) {
    let index = 0
    dates.forEach(date => { // dates是老師選定的兩周內可上課日期
      for (let i = 18; i < 22; i++) {
        date.setHours(i)
        avaiLessons.push({
          start: new Date(date.setMinutes(0)),
          end: new Date(date.setMinutes(30))
        })
        date.setHours(i + 1)
        avaiLessons.push({ start: avaiLessons[index].end, end: new Date(date.setMinutes(0)) })
        index = index + 2
      }
    })
  } else {
    dates.forEach(date => {
      for (let i = 18; i < 22; i++) {
        date.setMinutes(0)
        avaiLessons.push({
          start: new Date(date.setHours(i)),
          end: new Date(date.setHours(i + 1))
        })
      }
    })
  }
  return avaiLessons
}

const dateForward = (date) => {
  const d = new Date(date) // 不希望更改到date本身
  const FOREARD_RANGE = 21 // 需固定老師選定的星期，故是七的倍數，又想確認是已上完的課故至少要比十四天長
  return new Date(d.setDate(d.getDate() - FOREARD_RANGE))
}

const ifPast = (time) => {
  const today = new Date()
  return time.getTime() > today.getTime()
}

const timeFormater = (time, timePerClass) => {
  const start = new Date(time)
  let end = new Date(time)
  end.setMinutes(end.getMinutes() + timePerClass)
  // 若時間取得的時間數字大於等於十代表有二位數，沒有二位數的話則前面多加一個0
  let startHour = start.getHours() >= 10 ? start.getHours() : '0' + start.getHours()
  let endHour = end.getHours() >= 10 ? end.getHours() : '0' + end.getHours()
  let startMin = start.getMinutes() >= 10 ? start.getMinutes() : '0' + start.getMinutes()
  let endMin = end.getMinutes() >= 10 ? end.getMinutes() : '0' + end.getMinutes()

  return `${time.getFullYear()}/${time.getMonth() + 1}/${time.getDate()}   ${startHour}:${startMin} - ${endHour}:${endMin}` //因getMonth是根據月份回傳0-11，故在顯示上需加一才是數字月份

}

module.exports = { randomAvaiDay, datesInPeriod, avaiLessons, dateForward, ifPast, timeFormater }
