export const limit = (string = '', limit = 0) => {
  return string.substring(0, limit)
}

export const getShortAddress = address => {
  return address.slice(0, 4) + '..' + address.slice(-4) || ''
}
