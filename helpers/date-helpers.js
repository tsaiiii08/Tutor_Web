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

module.exports = { randomAvaiDay }
