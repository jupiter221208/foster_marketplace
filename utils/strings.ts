export const limit = (string = '', limit = 0) => {
  return string.substring(0, limit)
}

export const getDisplayUserName = name => {
  if (name?.length >= 32) {
    return getShortAddress(name)
  } else {
    return name
  }
}
export const getShortAddress = address => {
  if (address === null || address === undefined || address.length < 5) return address
  return address.slice(0, 3) + '***' + address.slice(-3) || ''
}

export const stringLengthValidate = (string = '', length = 2) => {
  const regex = '^[a-zA-Z0-9]{2,}$'
  return string.match(regex)
}

export const getPercentValue = value => {
  let string = ''
  if (value >= 0) {
    string += '+'
  }
  string += value.toFixed(2) + '%'

  return string
}

export const getPriceValue = price => {
  if (typeof price === 'number') return (price * 0.000000001).toFixed(2)
  return (price.toNumber() * 0.000000001).toFixed(2)
}

export const timeSince = (date: number) => {
  const now = new Date()
  let seconds = Math.floor((now.getTime() - date * 1000) / 1000)

  let interval = seconds / 31536000

  if (interval > 1) {
    return Math.floor(interval) + ' years'
  }
  interval = seconds / 2592000
  if (interval > 1) {
    return Math.floor(interval) + ' months ago'
  }
  interval = seconds / 86400
  if (interval > 1) {
    return Math.floor(interval) + ' days ago'
  }
  interval = seconds / 3600
  if (interval > 1) {
    return Math.floor(interval) + ' hours ago'
  }
  interval = seconds / 60
  if (interval > 1) {
    return Math.floor(interval) + ' minutes ago'
  }
  return Math.floor(seconds) + ' seconds ago'
}

export const getShortDescription = (viewport, description) => {
  if (description === null || description === undefined) return ''
  if (viewport === 'xs') {
    if (description.length > 120) return description.slice(0, 120) + '...'
  } else if (viewport === 'sm') {
    if (description.length > 200) return description.slice(0, 200) + '...'
  } else if (viewport === 'md') {
    if (description.length > 200) return description.slice(0, 200) + '...'
  } else {
    if (description.length > 200) return description
  }
  return description
}

export const getDateString = date => {
  const nowDate: any = new Date()
  const prevDate: any = new Date(date)
  const diffTime = Math.abs(nowDate - prevDate)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays + ' days '
}

export function getShortName(name, limit) {
  if (name.length > limit) {
    return name.substring(0, limit) + '...'
  } else {
    return name
  }
}
