export const limit = (string = '', limit = 0) => {
  return string.substring(0, limit)
}

export const getShortAddress = address => {
  return address.slice(0, 4) + '..' + address.slice(-4) || ''
}

export const stringLengthValidate = (string = '', length = 2) => {
  const regex = '^[a-zA-Z]{2,}$'
  return string.match(regex)
}
