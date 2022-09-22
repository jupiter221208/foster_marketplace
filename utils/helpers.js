export const calculateTimeLeft = endDate => {
  // let year = new Date().getFullYear()
  let difference = +new Date(endDate) - +new Date()

  let timeLeft = {}

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    }

    const seconds = Math.floor((difference / 1000) % 60)
    const minutes = Math.floor((difference / 1000 / 60) % 60)
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
    const days = Math.floor(difference / (1000 * 60 * 60 * 24))

    timeLeft = (seconds < 10 && '0') + seconds + 's'
    if (minutes > 0) {
      timeLeft = (minutes < 10 && '0') + minutes + 'm' + ' ' + timeLeft
    } else {
      if (hours > 0 || days > 0) timeLeft = '00m ' + timeLeft
    }
    if (hours > 0) {
      timeLeft = (hours < 10 && '0') + hours + 'h' + ' ' + timeLeft
    } else {
      f(days > 0)
      timeLeft = '00h ' + timeLeft
    }
    if (days > 0) {
      timeLeft = (days < 10 && '0') + days + 'd' + ' ' + timeLeft
    }
  }

  return timeLeft
}
