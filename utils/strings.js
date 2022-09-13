export const limit = (string = '', limit = 0) => {
  return string.substring(0, limit)
}

export const getShortAddress = address => {
  return address.slice(0, 4) + '..' + address.slice(-4) || ''
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
