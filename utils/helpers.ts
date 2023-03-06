import * as moment from 'moment'

export const calculateTimeLeft = endDate => {
  let difference = +new Date(endDate) - +new Date()

  let timeLeft = {}

  if (difference > 0) {
    const seconds = Math.floor((difference / 1000) % 60)
    const minutes = Math.floor((difference / 1000 / 60) % 60)
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
    const days = Math.floor(difference / (1000 * 60 * 60 * 24))
    timeLeft['seconds'] = (seconds < 10 && '0') + seconds + ''
    timeLeft['minutes'] = (minutes < 10 && '0') + minutes + ''
    timeLeft['hours'] = (hours < 10 && '0') + hours + ''
    timeLeft['days'] = (days < 10 && '0') + days + ''
  } else {
    timeLeft = {
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00',
    }
  }

  return timeLeft
}

export const calculateTimeLeftAll = endDate => {
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
      if (days > 0) timeLeft = '00h ' + timeLeft
    }
    if (days > 0) {
      timeLeft = (days < 10 && '0') + days + 'd' + ' ' + timeLeft
    }
  } else {
    timeLeft = '00h 00m 00s'
  }

  return timeLeft
}

export const countDecimals = value => {
  if (Math.floor(value) === value) return 0
  return value.toString().split('.')[1].length || 0
}

export const isString = obj => {
  return obj !== undefined && obj !== null && obj.constructor == String
}

export const formattedAmount = value => {
  const floatValue = parseFloat(value)
  if (Math.floor(floatValue) === floatValue) return value
  let length = value.toString().split('.')[0].length
  if (length === 0) {
    value = '0' + value
  }
  length = value.toString().split('.')[1].length
  if (length > 1) return parseFloat(value).toFixed(2)
  else return value
}

export const isLoggedIn = () => {
  if (typeof window === 'undefined') return false
  const jwt_token = localStorage.getItem('token') || ''
  return jwt_token.length > 0
}

export const validUrl = url => {
  if (!url.includes('http')) {
    return 'https://' + url
  }
  if (!url.includes('https')) {
    return url.replace(/^http:\/\//i, 'https://')
  }
  return url
}

export const copyToClipboard = value => {
  navigator.clipboard.writeText(value)
}

export const copyClipboardAlert = identifier => {
  document.getElementById(identifier).style.display = 'flex'
  setTimeout(function () {
    document.getElementById(identifier).style.display = 'none'
  }, 1000)
}

export const getOwnerName = item => {
  if (item.owner_username !== null && item.owner_username !== '') return item.owner_username

  if (item.owner_address !== null) return item.owner_address.slice(0, 4) + '...' + item.owner_address.slice(-4)

  return 'N/A'
}

export const getBuyerName = item => {
  if (item.reference_username !== null && item.reference_username !== '') return item.reference_username

  if (item.reference_address !== null)
    return item.reference_address.slice(0, 4) + '...' + item.reference_address.slice(-4)

  return 'N/A'
}

export const getLocalDate = dateString => {
  var utcDate = moment.utc(dateString)
  var fmt = 'MM/DD/YYYY hh:mm:ss'
  const localDate = utcDate.local().format(fmt)
  return localDate
}

export const getFirstUpperString = word => {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

export const compareDate = (a, b) => {
  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
}

export const setColorTheme = lightMode => {
  const doc = document.documentElement
  if (lightMode) {
    // Light Mode
    doc.style.setProperty('--background-main-color', '#eff0f6')
    doc.style.setProperty('--text-gray-200-color', '#202427')
    doc.style.setProperty('--header-bg-color1', '185, 186, 192')
    doc.style.setProperty('--header-bg-color2', '227, 228, 235')
    doc.style.setProperty('--header-bg-color3', '228, 229, 236')
    doc.style.setProperty('--outline-button-border', '#202427')
    doc.style.setProperty('--outline-button-color', '#202427')
    doc.style.setProperty('--avatar-border-color1', '#202427')
    doc.style.setProperty('--avatar-border-color2', '#6a6c6e')
    doc.style.setProperty('--text-trending-card-color', 'rgba(149, 219, 213, 1)')
    doc.style.setProperty('--dashboard-tab-color', 'rgba(32, 36, 39, 0.6)')
  } else {
    // Dark Mode
    doc.style.setProperty('--background-main-color', '#0c1013')
    doc.style.setProperty('--text-gray-200-color', '#eff0f6')
    doc.style.setProperty('--header-bg-color1', '48, 98, 96')
    doc.style.setProperty('--header-bg-color2', '20, 32, 33')
    doc.style.setProperty('--header-bg-color3', '32, 36, 39')
    doc.style.setProperty('--outline-button-border', '#5ac3ba')
    doc.style.setProperty('--outline-button-color', '#eff0f6')
    doc.style.setProperty('--avatar-border-color1', '#4ea19b')
    doc.style.setProperty('--avatar-border-color2', '#304e4e')
    doc.style.setProperty('--text-trending-card-color', 'rgba(239, 240, 247, 0.75)')
    doc.style.setProperty('--dashboard-tab-color', 'rgba(239, 240, 247, 0.6)')
  }
}
