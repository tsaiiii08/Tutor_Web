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

const datesInPeriod = (date, day) => {
  const PERIOD = 14 // 可選課時間目前設定為14天內
  const datesInPeriod = []
  for (let i = 1; i <= PERIOD; i++) {
    const targetDate = (date.setDate(date.getDate() + 1))
    if (day.includes(date.getDay(targetDate))) {
      datesInPeriod.push(new Date(targetDate))
    }
  }
  return datesInPeriod
}

const avaiLessons = (dates, timePerClass) => {
  const avaiLessons = []
  if (timePerClass === 30) {
    let index = 0
    dates.forEach(date => {
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

module.exports = { randomAvaiDay, datesInPeriod, avaiLessons }
