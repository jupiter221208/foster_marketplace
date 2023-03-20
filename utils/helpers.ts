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
    doc.style.setProperty('--g-left-container-bg', '#E4E5EB')
    doc.style.setProperty('--background-main-color', '#eff0f6')
    doc.style.setProperty('--background-black-color', '#202427')
    doc.style.setProperty('--background-black-color-rgb', '167, 168, 173')
    doc.style.setProperty('--active-btn-border-color', 'rgba(32, 36, 39, 0.1)')
    doc.style.setProperty('--text-gray-200-color', '#202427')
    doc.style.setProperty('--text-gray-200-color-rgb', '32, 36, 39')
    doc.style.setProperty(
      '--header-bg-color',
      'linear-gradient(90deg, rgba(185, 186, 192, 0.7) 0%, rgba(227, 228, 235, 0.7) 50%, rgba(228, 229, 236, 0.7) 100%)'
    )
    doc.style.setProperty('--header-mobile-bg-color', 'rgba(206, 208, 213, 0.8)')
    doc.style.setProperty('--outline-button-border', '#202427')
    doc.style.setProperty('--outline-button-color', '#202427')
    doc.style.setProperty('--avatar-border-color1', '#202427')
    doc.style.setProperty('--avatar-border-color2', '#6a6c6e')
    doc.style.setProperty('--text-trending-card-color', 'rgba(149, 219, 213, 1)')
    doc.style.setProperty('--dashboard-tab-color', 'rgba(32, 36, 39, 0.6)')
    doc.style.setProperty(
      '--card-bg-color',
      'linear-gradient(to bottom, rgba(239, 240, 246, 1) 0%, rgba(145, 148, 152, 1) 50%, rgba(34, 38, 41, 1) 100%)'
    )
    doc.style.setProperty('--activity-bg-color', 'rgb(239, 240, 247)')
    doc.style.setProperty('--activity-td-color', 'rgba(32, 36, 39, 1)')
    doc.style.setProperty('--activity-border-color', 'rgba(32, 36, 39, 0.1)')
    doc.style.setProperty('--activity-box-color', 'rgba(32, 36, 39, 0.1)')
    doc.style.setProperty('--activity-border-color', 'rgba(32, 36, 39, 0.1)')
    doc.style.setProperty('--accordion-first-row-bg', '#87898D')
    doc.style.setProperty('--accordion-second-row-bg', '#202427')
    doc.style.setProperty('--artwork-bg-color', '#C8C9CF')
    doc.style.setProperty('--step-circle-mobile-color', '#202427')
    doc.style.setProperty('--dimension-bg-color', '239, 240, 247')
    doc.style.setProperty('--radio-check-color', '#202427')
    doc.style.setProperty('--brand-02-color-rgb', '55, 130, 135')
    doc.style.setProperty('--switch-01-color', '149, 219, 213')
    doc.style.setProperty('--switch-02-color', '75, 110, 107')
    doc.style.setProperty('--menu-bg-color', '#D5D6DC')
    doc.style.setProperty('--menu-footer-color', '#CFD0D6')
    doc.style.setProperty('--hero-artist-color', 'rgba(239, 240, 246, 0.75)')
    doc.style.setProperty('--twitter-btn-color1', '#202427')
    doc.style.setProperty('--twitter-btn-color2', '#202427')
    doc.style.setProperty('--notification-card-bg', 'rgba(32, 36, 39, 0.5)')
    doc.style.setProperty('--background-dark-color-rgb', '135, 137, 141')
    doc.style.setProperty('--dao-title-color', '#202427')
    doc.style.setProperty('--nft-detail-artist', '#202427')
    doc.style.setProperty('--dropdown-bg-color', 'rgba(205, 205, 205, 0.8)')
    doc.style.setProperty('--dropdown-border-color', 'rgba(32, 36, 39, 0.1)')
    doc.style.setProperty('--dropdown-menu-bg', 'rgba(32, 36, 39, 1)')
    doc.style.setProperty('--dropdown-menu-hover-color', '#95DBD5')
    doc.style.setProperty('--dropdown-menu-hover-border', '')
    doc.style.setProperty('--wallet-green-text', '#202427')
    doc.style.setProperty('--wallet-error-text', '#202427')
    doc.style.setProperty('--wallet-active-text', '#202427')
    doc.style.setProperty('--follow-text-color', '#202427')
    doc.style.setProperty('--follow-bg-color', 'linear-gradient(to right, #4C706C, #95DBD5)')
    doc.style.setProperty('--artist-switch-color', 'linear-gradient(to right, #4B6E6B, #95DBD5)')
    doc.style.setProperty('--artist-switch-bg', '#CACBD1')
    doc.style.setProperty('--address-btn-color', '#95DBD5')
    doc.style.setProperty('--search-bg-color', '#EFF0F6')
    doc.style.setProperty('--search-category-color', '#202427')
    doc.style.setProperty('--menu-item-bg', 'linear-gradient(to bottom, #EFF0F5, #78787B)')
    doc.style.setProperty('--menu-item-open-bg', '#121212')
    doc.style.setProperty('--menu-item-open-color', '#95DBD5')
    doc.style.setProperty('--menu-item-border', 'linear-gradient(to bottom, transparent, transparent)')
    doc.style.setProperty('--menu-item-right-icon', '#202427')
    doc.style.setProperty('--search-item-bg', '#202427')
    doc.style.setProperty('--search-item-color', '#95DBD5')
    doc.style.setProperty('--resource-card-title', '#eff0f6')
    doc.style.setProperty('--nft-detail-section-bg', 'linear-gradient(to bottom, #95DBD5, #4B6E6B)')
    doc.style.setProperty('--nft-detail-section-border', '#95dbd5')
    doc.style.setProperty('--outline-btn-border', '#202427')
    doc.style.setProperty('--ellipse-btn-shadow', 'rgba(32, 36, 39, 0.3)')
    doc.style.setProperty('--nft-detail-bg', 'linear-gradient(to bottom, #eaebf2, #202427)')
    doc.style.setProperty('--nft-detail-border', '#C5C7CC')
    doc.style.setProperty('--alpha-area-border', '#eff0f6')
    doc.style.setProperty('--profile-menu-item-bg', '#202427')
    doc.style.setProperty('--profile-menu-item-border', '')
    doc.style.setProperty('--profile-menu-item-color', '#95dbd5')
    doc.style.setProperty('--follow-box-shadow', 'rgba(32, 36, 39, 0.3)')
    doc.style.setProperty('--read-more-bg', 'rgba(180, 180, 180, 0.9)')
    doc.style.setProperty('--modal-bg-color', 'rgba(239, 240, 247, 0.4)')
    doc.style.setProperty('--datepicker-bg-color', 'rgba(239, 240, 247, 0.8)')
    doc.style.setProperty('--datepicker-button-bg', 'rgba(239, 240, 247, 1)')
    doc.style.setProperty('--datepicker-date-bg', 'rgba(255, 255, 255, 1)')
    doc.style.setProperty('--price-input-bg', '#DEDEE4')
    doc.style.setProperty('--modal-terms-service', '#202427')
    doc.style.setProperty('--step-text-color', '#95DBD5')
    doc.style.setProperty('--select-collection-text', '#202427')
    doc.style.setProperty('--collection-mint-progress-bg', 'rgba(0, 0, 0, 0.6')
    doc.style.setProperty('--collection-mint-left-bg', '#CFD0D6')
    doc.style.setProperty('--connect-wallet-text', '#95dbd5')
    doc.style.setProperty('--connect-wallet-bg', '#202427')
    doc.style.setProperty('--mint-progress-bg', 'rgba(239, 240, 247, 0.1)')
    doc.style.setProperty('--mint-progress-mobile-bg', 'rgba(12, 12, 12, 0.2)')
    doc.style.setProperty('--connected-wallet-bg', 'linear-gradient(to bottom, #eff0f6, #78787B)')
    doc.style.setProperty('--profile-border-color', '#eff0f6')
    doc.style.setProperty('--stats-accordion-bg', '#eff0f6')
    doc.style.setProperty('--stats-accordion-border', 'rgba(32, 36, 39, 0.1)')
    doc.style.setProperty('--stats-accordion-normal-border', 'rgba(32, 36, 39, 0.1)')
    doc.style.setProperty(
      '--ecosystem-card-bg',
      'linear-gradient(to bottom, rgba(239, 240, 247, 1), rgba(32, 36, 39, 1))'
    )
    doc.style.setProperty('--resource-accordion-dropdown-bg', 'rgba(32, 36, 39, 1)')
    doc.style.setProperty('--resource-accordion-dropdown-color', '#95dbd5')
    doc.style.setProperty('--resource-accordion-close-color', '#eff0f6')
    doc.style.setProperty('--chevron-up-icon-color', '#202427')
    doc.style.setProperty('--collection-filter-title', '#202427')
    doc.style.setProperty('--deposit-btn-bg-1', '#4B6E6B')
    doc.style.setProperty('--deposit-btn-bg-2', '#95DBD5')
    doc.style.setProperty('--wallet-box-shadow', '0px 0px 0px transparent')
    doc.style.setProperty('--wallet-btn-bg', '#202427')
    doc.style.setProperty('--wallet-btn-hover', '#95DBD5')
    doc.style.setProperty(
      '--collection-card-bg',
      'linear-gradient(to bottom, rgba(239, 240, 247, 1), rgba(32, 36, 39, 1)'
    )
    doc.style.setProperty('--collection-card-border', '0px')
    doc.style.setProperty(
      '--profile-card-bg',
      'linear-gradient(to bottom, rgba(32, 36, 39, 1), rgba(239, 240, 247, 1) 70%)'
    )
    doc.style.setProperty('--mynft-outline-border', '#95DBD5')
    doc.style.setProperty('--mynft-outline-color', '#EFF0F6')
    doc.style.setProperty('--filter-close-color', '#202427')
    doc.style.setProperty('--negative-btn-border', '#121212')
  } else {
    // Dark Mode
    doc.style.setProperty('--g-left-container-bg', '#0f1316')
    doc.style.setProperty('--background-main-color', '#0c1013')
    doc.style.setProperty('--background-black-color', '#121212')
    doc.style.setProperty('--background-black-color-rgb', '18, 18, 18')

    doc.style.setProperty('--active-btn-border-color', '#95dbd5')
    doc.style.setProperty('--text-gray-200-color', '#eff0f6')
    doc.style.setProperty('--text-gray-200-color-rgb', '239, 240, 247')
    doc.style.setProperty(
      '--header-bg-color',
      'linear-gradient(90deg, rgba(48, 98, 96, 0.7) 0%, rgba(20, 32, 33, 0.7) 50%, rgba(32, 36, 39, 0.7) 100%)'
    )
    doc.style.setProperty(
      '--header-mobile-bg-color',
      'linear-gradient(90deg, rgba(52, 103, 99, 0.8) 0%, rgba(18, 25, 25, 0.8) 100%)'
    )

    doc.style.setProperty('--outline-button-border', '#5ac3ba')
    doc.style.setProperty('--outline-button-color', '#eff0f6')
    doc.style.setProperty('--avatar-border-color1', '#4ea19b')
    doc.style.setProperty('--avatar-border-color2', '#304e4e')
    doc.style.setProperty('--text-trending-card-color', 'rgba(239, 240, 247, 0.75)')
    doc.style.setProperty('--dashboard-tab-color', 'rgba(239, 240, 247, 0.6)')
    doc.style.setProperty('--card-bg-color', '#121212')
    doc.style.setProperty('--activity-bg-color', '#121212')
    doc.style.setProperty('--activity-td-color', 'rgba(239, 240, 247, 0.8)')
    doc.style.setProperty('--activity-border-color', '#5ac3ba')
    doc.style.setProperty('--activity-box-color', 'transparent')
    doc.style.setProperty('--activity-border-color', 'rgba(239, 240, 247, 0.1)')
    doc.style.setProperty('--accordion-first-row-bg', '#1b1b1b')
    doc.style.setProperty('--accordion-second-row-bg', 'transparent')
    doc.style.setProperty('--artwork-bg-color', '#202427')
    doc.style.setProperty('--step-circle-mobile-color', '#95dbd5')
    doc.style.setProperty('--dimension-bg-color', '12, 12, 12')
    doc.style.setProperty('--radio-check-color', '#95dbd5')
    doc.style.setProperty('--brand-02-color-rgb', '55, 130, 135')
    doc.style.setProperty('--switch-01-color', '55, 130, 135')
    doc.style.setProperty('--switch-02-color', '12, 65, 68')
    doc.style.setProperty('--menu-bg-color', '#0f1316')
    doc.style.setProperty('--menu-footer-color', '#2b2f32')
    doc.style.setProperty('--hero-artist-color', '#63d6cd')
    doc.style.setProperty('--twitter-btn-color1', '#5ac3ba')
    doc.style.setProperty('--twitter-btn-color2', '#2d625d')
    doc.style.setProperty('--notification-card-bg', 'rgba(239, 240, 247, 0.15)')
    doc.style.setProperty('--background-dark-color-rgb', '32, 36, 39')
    doc.style.setProperty('--dao-title-color', '#95dbd5')
    doc.style.setProperty('--nft-detail-artist', '#93bfbb')
    doc.style.setProperty('--dropdown-bg-color', 'rgba(14, 14, 14, 0.8)')
    doc.style.setProperty('--dropdown-border-color', 'rgba(239, 240, 247, 0.1)')
    doc.style.setProperty('--dropdown-menu-bg', 'rgba(55, 130, 135, 0.3)')
    doc.style.setProperty('--dropdown-menu-hover-color', '')
    doc.style.setProperty('--dropdown-menu-hover-border', '#5ac3ba')
    doc.style.setProperty('--wallet-green-text', '#95dbd5')
    doc.style.setProperty('--wallet-error-text', '#deefd0')
    doc.style.setProperty('--wallet-active-text', '#5ac3ba')
    doc.style.setProperty('--follow-text-color', '#95dbd5')
    doc.style.setProperty('--follow-bg-color', 'linear-gradient(to bottom, #121212, #2d625d)')
    doc.style.setProperty('--artist-switch-color', 'linear-gradient(to right, #202427, #173437)')
    doc.style.setProperty('--artist-switch-bg', '#1c2121')
    doc.style.setProperty('--address-btn-color', 'rgba(239, 240, 247, 0.6)')
    doc.style.setProperty('--search-bg-color', '#121212')
    doc.style.setProperty('--menu-item-bg', '#202427')
    doc.style.setProperty('--menu-item-open-bg', 'linear-gradient(to bottom, #378287, #202427)')
    doc.style.setProperty('--search-category-color', 'rgba(239, 240, 247, 0.6)')
    doc.style.setProperty('--menu-item-open-color', '#202427')
    doc.style.setProperty('--menu-item-border', 'rgba(239, 240, 247, 0.1)')
    doc.style.setProperty('--menu-item-right-icon', '#5AC3BA')
    doc.style.setProperty('--search-item-bg', 'linear-gradient(to bottom, #202427, rgba(45, 98, 93, 0.5))')
    doc.style.setProperty('--search-item-color', '#eff0f6')
    doc.style.setProperty('--resource-card-title', '#95dbd5')
    doc.style.setProperty('--nft-detail-section-bg', 'linear-gradient(to bottom, #212626, #253c3a)')
    doc.style.setProperty('--nft-detail-section-border', 'rgba($text-gray-200-color, 0.1)')
    doc.style.setProperty('--outline-btn-border', '#95dbd5')
    doc.style.setProperty('--ellipse-btn-shadow', '#95dbd5')
    doc.style.setProperty('--nft-detail-bg', '#121212')
    doc.style.setProperty('--nft-detail-border', 'rgba(239, 240, 247, 0.1)')
    doc.style.setProperty('--alpha-area-border', '#95dbd5')
    doc.style.setProperty('--profile-menu-item-bg', 'rgba(55, 130, 135, 0.3)')
    doc.style.setProperty('--profile-menu-item-border', '#5ac3ba')
    doc.style.setProperty('--profile-menu-item-color', '#eff0f6')
    doc.style.setProperty('--follow-box-shadow', '#95dbd5')
    doc.style.setProperty('--read-more-bg', 'rgba(18, 18, 18, 0.8)')
    doc.style.setProperty('--modal-bg-color', 'rgba(18, 18, 18, 0.5)')
    doc.style.setProperty('--datepicker-bg-color', 'rgba(32, 36, 39, 0.9)')
    doc.style.setProperty('--datepicker-button-bg', 'rgba(32, 36, 39, 1)')
    doc.style.setProperty('--datepicker-date-bg', 'rgba(32, 36, 39, 1)')
    doc.style.setProperty('--price-input-bg', '#121212')
    doc.style.setProperty('--modal-terms-service', '#9db2b4')
    doc.style.setProperty('--step-text-color', '#202427')
    doc.style.setProperty('--select-collection-text', '#eff0f6')
    doc.style.setProperty(
      '--collection-mint-progress-bg',
      'linear-gradient( 90deg, rgba(48, 88, 86, 0.5) 0%, rgba(20, 32, 33, 0.5) 50%, rgba(32, 36, 39, 0.5) 100%)'
    )
    doc.style.setProperty('--collection-mint-left-bg', '#121212')
    doc.style.setProperty('--connect-wallet-text', '#eff0f6')
    doc.style.setProperty('--connect-wallet-bg', 'linear-gradient(to bottom, rgba(55, 130, 135, 1), rgba(#244246, 1))')
    doc.style.setProperty('--mint-progress-bg', 'rgba(12, 12, 12, 0.5)')
    doc.style.setProperty('--mint-progress-mobile-bg', 'rgba(12, 12, 12, 0.5)')
    doc.style.setProperty(
      '--connected-wallet-bg',
      'linear-gradient(to bottom, rgba(12, 12, 12, 1), rgba(45, 98, 93, 1))'
    )
    doc.style.setProperty('--profile-border-color', '#121212')
    doc.style.setProperty('--stats-accordion-bg', '#121212')
    doc.style.setProperty('--stats-accordion-border', '#95dbd5')
    doc.style.setProperty('--stats-accordion-normal-border', 'rgba(239, 240, 247, 0.1)')
    doc.style.setProperty('--ecosystem-card-bg', 'rgba(18, 18, 18, 1)')
    doc.style.setProperty('--resource-accordion-dropdown-bg', 'rgba(255, 255, 255, 0.2)')
    doc.style.setProperty('--resource-accordion-dropdown-color', '#eff0f6')
    doc.style.setProperty('--resource-accordion-close-color', '#95dbd5')
    doc.style.setProperty('--chevron-up-icon-color', '#95DBD5')
    doc.style.setProperty('--collection-filter-title', '#95DBD5')
    doc.style.setProperty('--deposit-btn-bg-1', '#2B4142')
    doc.style.setProperty('--deposit-btn-bg-2', '#59BFB7')
    doc.style.setProperty(
      '--wallet-box-shadow',
      '0px 5px 10px rgba(153, 69, 255, 0.2), 0px -5px 10px rgba(20, 241, 149, 0.2)'
    )
    doc.style.setProperty('--wallet-btn-bg', '#121212')
    doc.style.setProperty('--wallet-btn-hover', '#14f195')
    doc.style.setProperty('--collection-card-bg', '#121212')
    doc.style.setProperty('--collection-card-border', '1px')
    doc.style.setProperty('--profile-card-bg', '#202427')
    doc.style.setProperty('--mynft-outline-border', '#5ac3ba')
    doc.style.setProperty('--mynft-outline-color', '')
    doc.style.setProperty('--filter-close-color', '#eff0f6')
    doc.style.setProperty('--negative-btn-border', '#95DBD5')
  }
}
