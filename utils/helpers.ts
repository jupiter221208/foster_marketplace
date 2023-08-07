import * as moment from 'moment'

export const calculateTimeLeft = endDate => {
  let difference = getTimeDifference(endDate)
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

export const getTimeDifference = endTime => {
  let endListingTime = new Date(endTime)
  let offset = endListingTime.getTimezoneOffset() * 60 * 1000
  let endLocalTime = endListingTime.getTime() - offset
  let nowDate = new Date().getTime()
  let difference = endLocalTime - nowDate
  return difference
}

export const isExpiredDate = (start, duration) => {
  // for testing
  let proposalTime = new Date(start)
  let offset = proposalTime.getTimezoneOffset() * 60 * 1000
  let proposalLocalTime = proposalTime.getTime() - offset
  let nowDate = new Date().getTime()
  let difference = nowDate - proposalLocalTime

  if (difference < duration * 3600 * 1000) return false
  else return true
}

export const isAvailableDate = (start, end) => {
  // for testing
  let startTime = new Date(start)
  let offset = startTime.getTimezoneOffset() * 60 * 1000
  let proposalStartTime = startTime.getTime() - offset

  let endTime = new Date(end)
  let offsetEnd = startTime.getTimezoneOffset() * 60 * 1000
  let proposalEndTime = endTime.getTime() - offsetEnd

  let nowDate = new Date().getTime()
  let diffStart = nowDate - proposalStartTime
  let diffEnd = proposalEndTime - nowDate
  if (diffStart > 0 && diffEnd > 0) return true
  else return false
}

export const dataURLtoFile = (dataurl, filename) => {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

export const getDateLabel = date => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  let month = months[date.getMonth()]
  let day = date.getDate()
  let year = date.getFullYear()
  return month + ' ' + day + ', ' + year
}

export const getTimeLabel = date => {
  var localDate = new Date(date)
  let hours = localDate.getHours()
  let mins = localDate.getMinutes()

  return hours + ':' + mins
}

export const findElement = (arr, propName, propValue) => {
  for (var i = 0; i < arr.length; i++) if (arr[i][propName] == propValue) return arr[i]
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

export const isValidUrl = (urlString, socialType) => {
  var inputElement = document.createElement('input')
  inputElement.type = 'url'
  inputElement.value = urlString

  if (!inputElement.checkValidity() || urlString.includes(socialType) <= 0) {
    return false
  } else {
    return true
  }
}

export const copyToClipboard = value => {
  navigator.clipboard.writeText(value.replaceAll(' ', '%20'))
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
    doc.style.setProperty('--main-bg-color', '#202427')
    doc.style.setProperty('--main-bg-color-rgb', '32, 36, 39')
    doc.style.setProperty('--main-icon-color', '#202427')
    doc.style.setProperty('--main-icon-color-rgb', '32, 36, 39')
    doc.style.setProperty('--g-left-container-bg', '#EFF0F6')
    doc.style.setProperty('--background-main-color', '#eff0f6')
    doc.style.setProperty('--background-black-color', '#202427')
    doc.style.setProperty('--background-black-color-rgb', '239, 240, 247')
    doc.style.setProperty('--preload-back-color', 'rgba(32, 36, 39, 0.7)')
    doc.style.setProperty('--active-btn-border-color', 'rgba(32, 36, 39, 0.1)')
    doc.style.setProperty('--background-light-color', '#202427')
    doc.style.setProperty('--background-light-color-rgb', '32, 36, 39')
    doc.style.setProperty('--text-gray-200-color', '#202427')
    doc.style.setProperty('--text-gray-200-color-rgb', '32, 36, 39')
    doc.style.setProperty('--sort-item-color', 'rgba(32, 36, 39, 0.75)')
    doc.style.setProperty('--header-bg-color', 'rgba(239, 240, 247, 0.8)')
    doc.style.setProperty('--header-bottom-color', '#CCCDD4')
    doc.style.setProperty('--header-mobile-bg-color', 'rgba(239, 240, 247, 0.8)')
    doc.style.setProperty('--outline-button-border', '#202427')
    doc.style.setProperty('--outline-button-color', '#202427')
    doc.style.setProperty('--secondary-button-border', '#eff0f6')
    doc.style.setProperty('--avatar-border-color1', '#202427')
    doc.style.setProperty('--avatar-border-color2', '#6a6c6e')
    doc.style.setProperty('--text-trending-card-color', 'rgba(149, 219, 213, 1)')
    doc.style.setProperty('--dashboard-tab-color', 'rgba(32, 36, 39, 0.6)')
    doc.style.setProperty('--activity-bg-color', '#CBCDD2')
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
    doc.style.setProperty('--menu-bg-color', '#eff0f6')
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
    doc.style.setProperty('--dropdown-menu-bg', '#202427')
    doc.style.setProperty('--dropdown-menu-hover-color', '#95DBD5')
    doc.style.setProperty('--dropdown-menu-hover-border', 'rgba(239, 240, 247, 0.1)')
    doc.style.setProperty('--wallet-green-text', '#202427')
    doc.style.setProperty('--wallet-error-text', '#202427')
    doc.style.setProperty('--wallet-active-text', '#202427')
    doc.style.setProperty('--follow-text-color', '#202427')
    doc.style.setProperty('--follow-bg-color', 'linear-gradient(to right, #4C706C, #95DBD5)')
    doc.style.setProperty('--artist-switch-color', 'linear-gradient(to right, #eff0f6, #78787B)')
    doc.style.setProperty('--artist-switch-bg', '#CBCDD2')
    doc.style.setProperty('--address-btn-color', 'rgba(32, 36, 39, 0.75)')
    doc.style.setProperty('--search-bg-color', '#CACBD0')
    doc.style.setProperty('--search-category-color', '#202427')
    doc.style.setProperty('--menu-item-bg', 'linear-gradient(to bottom, #EFF0F5, #78787B)')
    doc.style.setProperty('--menu-item-open-bg', '#121212')
    doc.style.setProperty('--menu-item-open-color', 'rgba(239, 240, 247, 1)')
    doc.style.setProperty('--menu-item-border', 'linear-gradient(to bottom, transparent, transparent)')
    doc.style.setProperty('--menu-open-item-border', 'linear-gradient(to bottom, transparent, transparent)')
    doc.style.setProperty('--menu-item-right-icon', '#202427')
    doc.style.setProperty('--menu-item-right-open-icon', 'rgba(239, 240, 247, 0.75)')
    doc.style.setProperty('--pagination-down-icon', '#202427')
    doc.style.setProperty('--search-item-bg', '#202427')
    doc.style.setProperty('--search-item-color', '#95DBD5')
    doc.style.setProperty('--resource-card-title', '#eff0f6')
    doc.style.setProperty('--nft-detail-section-bg', '#7C7E83')
    doc.style.setProperty('--nft-detail-section-border', '#eff0f6')
    doc.style.setProperty('--gradient-btn-color', '#eff0f6')
    doc.style.setProperty('--outline-btn-border', '#202427')
    doc.style.setProperty('--ellipse-btn-shadow', 'rgba(32, 36, 39, 0.3)')
    doc.style.setProperty('--nft-detail-bg', '#CBCDD2')
    doc.style.setProperty('--nft-detail-border', '#C5C7CC')
    doc.style.setProperty('--alpha-area-border', 'transparent')
    doc.style.setProperty('--alpha-area-bg', '#D8D8DE')
    doc.style.setProperty('--profile-menu-item-bg', '#202427')
    doc.style.setProperty('--profile-menu-item-border', '')
    doc.style.setProperty('--profile-menu-item-color', '#95dbd5')
    doc.style.setProperty('--follow-box-shadow', 'rgba(32, 36, 39, 0.3)')
    doc.style.setProperty('--read-more-bg', 'rgba(180, 180, 180, 0.9)')
    doc.style.setProperty('--modal-bg-color', 'rgba(239, 240, 247, 0.7)')
    doc.style.setProperty('--datepicker-bg-color', 'rgba(239, 240, 247, 0.8)')
    doc.style.setProperty('--datepicker-button-bg', 'rgba(239, 240, 247, 1)')
    doc.style.setProperty('--datepicker-date-bg', 'rgba(255, 255, 255, 1)')
    doc.style.setProperty('--price-input-bg', '#DEDEE4')
    doc.style.setProperty('--modal-terms-service', '#202427')
    doc.style.setProperty('--step-text-color', '#E3E4EA')
    doc.style.setProperty('--select-collection-text', '#202427')
    doc.style.setProperty('--collection-mint-progress-bg', 'rgba(0, 0, 0, 0.6')
    doc.style.setProperty('--collection-mint-left-bg', '#CFD0D6')
    doc.style.setProperty('--connect-wallet-text', '#95dbd5')
    doc.style.setProperty('--connect-wallet-bg', '#202427')
    doc.style.setProperty('--mint-progress-bg', 'rgba(239, 240, 247, 0.1)')
    doc.style.setProperty('--mint-progress-mobile-bg', 'rgba(12, 12, 12, 0.2)')
    doc.style.setProperty('--connected-wallet-bg', 'linear-gradient(to bottom, #E5E6EB, #C5C6CB)')
    doc.style.setProperty('--profile-border-color', '#ADAEB2')
    doc.style.setProperty('--stats-accordion-bg', '#CBCDD2')
    doc.style.setProperty('--stats-accordion-border', 'rgba(32, 36, 39, 0.1)')
    doc.style.setProperty('--stats-accordion-normal-border', 'transparent') //'rgba(32, 36, 39, 0.1)')
    doc.style.setProperty('--resource-accordion-dropdown-bg', 'rgba(32, 36, 39, 1)')
    doc.style.setProperty('--resource-accordion-dropdown-color', '#95dbd5')
    doc.style.setProperty('--resource-accordion-close-color', '#eff0f6')
    doc.style.setProperty('--chevron-up-icon-color', '#202427')
    doc.style.setProperty('--collection-filter-title', '#202427')
    doc.style.setProperty('--deposit-btn-bg-1', '#4B6E6B')
    doc.style.setProperty('--deposit-btn-bg-2', '#95DBD5')
    doc.style.setProperty('--mint-btn-bg-1', '#202427')
    doc.style.setProperty('--mint-btn-bg-2', '#202427')
    doc.style.setProperty('--mint-btn-color', '#95DBD5')
    doc.style.setProperty('--wallet-box-shadow', '0px 0px 0px transparent')
    doc.style.setProperty('--wallet-btn-bg', '#202427')
    doc.style.setProperty('--wallet-btn-hover', '#95DBD5')
    doc.style.setProperty('--collection-card-bg', '#CBCDD2')
    doc.style.setProperty('--collection-card-border', '0px')
    doc.style.setProperty('--profile-card-bg', '#eff0f6')
    doc.style.setProperty('--mynft-outline-border', '#95DBD5')
    doc.style.setProperty('--mynft-outline-color', '#EFF0F6')
    doc.style.setProperty('--filter-close-color', '#202427')
    doc.style.setProperty('--negative-btn-border', '#121212')
    doc.style.setProperty('--checkbox-border', 'transparent')
    doc.style.setProperty('--checkbox-border-color', '#202427')
    doc.style.setProperty('--checkbox-bg-color', 'transparent')
    doc.style.setProperty('--ellipse-menu-bg', '#c1c2c7')
    doc.style.setProperty('--ellipse-report-bg', '#D6D8DD')
    doc.style.setProperty('--mobile-serachbox-bg', '#eff0f6')
    doc.style.setProperty('--mobile-serach-area-bg', 'rgba(239, 240, 247, 0.8')
    doc.style.setProperty('--modal-close-btn-bg', 'rgba(241, 255, 255, 1)')
    doc.style.setProperty('--auction-input-bg', '#202427')
    doc.style.setProperty('--see-more-border', '#D7D8DE')
    doc.style.setProperty('--follow-btn-border', 'D7D8DE')
    doc.style.setProperty('--follow-btn-border-mobile', 'rgba(32, 36, 39, 0.25)')
    doc.style.setProperty('--artist-card-bg', 'linear-gradient(to bottom, rgba(32, 36, 39, 1), rgba(238, 239, 244, 1)')
    doc.style.setProperty('--nft-info-bg', '#202427')
    doc.style.setProperty('--place-bid-close-rect', '#DDF2F5')
    doc.style.setProperty('--place-bid-close-path', '#202427')
    doc.style.setProperty('--input-bg', '#E0E1E7')
    doc.style.setProperty(
      '--browse-nft-blur-bg',
      'linear-gradient(to top,rgba(32, 36, 39, 0.5) 0%,rgba(32, 36, 39, 0.3) 40%,rgba(32, 36, 39, 0.2) 60%,rgba(32, 36, 39, 0.5) 100%)'
    )
    doc.style.setProperty('--resource-card-bg', 'linear-gradient(to bottom, #72A4A0, #202427)')
    doc.style.setProperty('--resource-card-default-bg', '#eff0f6')
    doc.style.setProperty('--home-swiper-bg', '#202427')
    doc.style.setProperty('--explore-btn-bg-1', '#95DBD5')
    doc.style.setProperty('--explore-btn-bg-2', '#4B6E6B')
    doc.style.setProperty('--home-hero-title', '#414144')
    doc.style.setProperty('--profile-user-color', '#202427')
    doc.style.setProperty('--single-nft-btn-bg-1', '#4D706D')
    doc.style.setProperty('--single-nft-btn-bg-2', '#95DBD5')
    doc.style.setProperty('--single-nft-btn-color', '#202427')
    doc.style.setProperty('--drop-zone-bg', '#202427')
    doc.style.setProperty('--filter-btn-bg', '#BBBCC1')
    doc.style.setProperty('--filter-btn-border', '#EFF0F6')
    doc.style.setProperty('--ellipse-svg-1', 'transparent')
    doc.style.setProperty('--ellipse-svg-2', 'transparent')
    doc.style.setProperty('--ellipse-stop-2', '#202427')
    doc.style.setProperty('--tooltip-bg', 'rgba(32, 36, 39, 0.1)')
    doc.style.setProperty('--tooltip-border', 'rgba(32, 36, 39, 0.1)')
    doc.style.setProperty('--back-btn-color', 'transparent')
    doc.style.setProperty('--back-btn-border', 'rgba(32, 36, 39, 0.5)')
    doc.style.setProperty('--back-btn-border-mobile', 'rgba(32, 36, 39, 0.25)')
    doc.style.setProperty('--back-btn-border-width', '2')
    doc.style.setProperty('--artwork-table-border', 'transparent')
    doc.style.setProperty('--artwork-table-tr', '#202427')
    doc.style.setProperty('--artwork-table-tr-hover-bg', '#CBCDD2')
    doc.style.setProperty('--artwork-table-tr-hover-color', '#95DBD5')
    doc.style.setProperty('--deposit-icon-bg', '#95dbd5')
    doc.style.setProperty('--wallet-icon-bg-1', '#95dbd5')
    doc.style.setProperty('--wallet-icon-bg-2', '#95dbd5')
    doc.style.setProperty('--wallet-icon-bg-3', '#95dbd5')
    doc.style.setProperty('--wallet-icon-bg-4', '#95dbd5')
    doc.style.setProperty('--wallet-icon-bg-5', '#95dbd5')
    doc.style.setProperty('--wallet-icon-bg-6', '#95dbd5')
    doc.style.setProperty('--wallet-icon-light-bg-1', '#eff0f6')
    doc.style.setProperty('--wallet-icon-light-bg-2', '#eff0f6')
    doc.style.setProperty('--wallet-icon-light-bg-3', '#eff0f6')
    doc.style.setProperty('--wallet-icon-light-bg-4', '#eff0f6')
    doc.style.setProperty('--wallet-icon-light-bg-5', '#eff0f6')
    doc.style.setProperty('--wallet-icon-light-bg-6', '#eff0f6')
    doc.style.setProperty('--logout-icon-color', '#202427')
    doc.style.setProperty('--trash-icon-color', '#A9ACB1')
    doc.style.setProperty('--day-btn-color', '#202427')
    doc.style.setProperty('--day-btn-bg-1', '#E4E5EB')
    doc.style.setProperty('--day-btn-bg-2', '#BDBEC2')
    doc.style.setProperty('--search-icon-color', '#D1D2D8')
    doc.style.setProperty('--switch-disabled-color', 'rgba(239, 240, 247, 1)')
    doc.style.setProperty('--logo-text-color', '#202427')
    doc.style.setProperty('--logo-text-ballon', '#202427')
    doc.style.setProperty('--activity-tr-bg', 'rgba(239, 240, 247, 0.25)')
    doc.style.setProperty('--banner-image-bg', '#505457')
    doc.style.setProperty('--menu-item-activity-icon', '#202427')
    doc.style.setProperty('--card-border-color', '#C1C2C9')
    doc.style.setProperty('--search-menu-icon-color', '#202427')
    doc.style.setProperty('--social-bg-color', '#E0E1E7')
    doc.style.setProperty('--nft-border-color', '#D7D8DE')
    doc.style.setProperty('--address-btn-bg-color', '#E0E1E7')
    doc.style.setProperty('--stats-bg-color', '#E0E1E7')
    doc.style.setProperty('--tab-bottom-color', '#202427')
    doc.style.setProperty('--artist-card-bg', 'linear-gradient(to bottom, rgba(32, 36, 39, 1), rgba(238, 239, 244, 1)')
    doc.style.setProperty('--top-artist-bg', '#202427')
    doc.style.setProperty('--sell-nft-border', 'transparent')
    doc.style.setProperty('--sell-nft-bg', '#E0E1E7')
    doc.style.setProperty('--setting-input-bg', '#CCCDD4')
    doc.style.setProperty('--search-icon-stop-1', '#95dbd5')
    doc.style.setProperty('--search-icon-stop-2', '#4B6E6B')
    doc.style.setProperty('--search-icon-bg', 'rgba(239, 240, 247, 0.6)')
    doc.style.setProperty('--search-gray-icon', 'rgba(32, 36, 39, 0.75)')
    doc.style.setProperty('--search-gray-icon-disable', 'rgba(255,255,255,0.8)')
    doc.style.setProperty('--profile-banner-overlay', '239, 240, 247')
    doc.style.setProperty('--follow-btn-bg', '#121212')
    doc.style.setProperty('--follow-btn-color', '#E0E1E7')
    doc.style.setProperty('--hero-overlay-color', 'rgba(239, 240, 247, 0.5')
    doc.style.setProperty('--hide-nft-border-color', '#CBCDD2')
    doc.style.setProperty('--category-chip-bg', '#C4C5CA')
    doc.style.setProperty('--live-auction-card', '#D6D8DD')
    doc.style.setProperty('--accordian-header-bg', '#7C7E83')
    doc.style.setProperty('--accordian-area-bg', '#D6D8DD')
    doc.style.setProperty('--social-share-bg', '#ffffff')
    doc.style.setProperty('--social-share-hover', 'rgba(214, 216, 221, 1)')
    doc.style.setProperty('--share-icon-bg', '#D6D8DD')
    doc.style.setProperty('--dao-setup-left', 'linear-gradient(to bottom, #eff0f6, #78787B)')
    doc.style.setProperty('--outline-btn-border', 'rgba(32, 36, 39, 0.25)')
    doc.style.setProperty('--report-menu-bg', 'rgba(239, 240, 247, 0.5)')
    doc.style.setProperty('--stats-label-bg', '#E0E1E7')
    doc.style.setProperty(
      '--category-bottom-mask',
      'linear-gradient(to bottom, rgba(239, 240, 247, 0), rgba(239, 240, 247, 1))'
    )
    doc.style.setProperty('--stats-search-bg', '#E3E4EA')
    doc.style.setProperty('--artwork-tbl-header-bg', 'linear-gradient(to bottom, #E3E4EA, #727275)')
    doc.style.setProperty('--primary-btn-bg-left', '#202427')
    doc.style.setProperty('--primary-btn-bg-right', '#202427')
    doc.style.setProperty('--auction-card-label', '#65686C')
    doc.style.setProperty('--auction-card-bg', 'linear-gradient(to right, #C8C8CD, #939396)')
    doc.style.setProperty('--auction-card-color', '#eff0f6')
    doc.style.setProperty('--dao-connect-border-width', '0px')
    doc.style.setProperty('--dao-connect-bg', 'linear-gradient(to bottom, #eff0f6, #78787B)')
    doc.style.setProperty('--dao-treasury-bg', '#E3E4EA')
    doc.style.setProperty('--g-right-container-bg', '#E3E4EA')
    doc.style.setProperty('--deposit-disabled-color', '#5F6165')
    doc.style.setProperty('--nav-divider-color', '#CCCDD4')
    doc.style.setProperty('--profile-setup-bg', 'linear-gradient(to bottom, #F5F5F8, #202427)')
    doc.style.setProperty('--profile-setup-input-bg', 'rgba(239, 240, 247, 0.15)')
    doc.style.setProperty('--profile-setup-avatar-bg', '#202427')
    doc.style.setProperty('--profile-setup-left-bg', 'linear-gradient(to bottom, #eff0f6, #78787B)')
    doc.style.setProperty('--profile-divider', '#202427')
    doc.style.setProperty('--quick-buy-icon-color', '#eff0f6')
    // =====================================================
    // =====================================================
    // =====================================================
  } else {
    // Dark Mode
    doc.style.setProperty('--main-bg-color', '#eff0f6')
    doc.style.setProperty('--main-bg-color-rgb', '239, 240, 247')
    doc.style.setProperty('--main-icon-color', '#95dbd5')
    doc.style.setProperty('--main-icon-color-rgb', '149, 219, 213')
    doc.style.setProperty('--g-left-container-bg', '#0f1316')
    doc.style.setProperty('--g-right-container-bg', '#121212')
    doc.style.setProperty('--background-main-color', '#121212')
    doc.style.setProperty('--background-black-color', '#121212')
    doc.style.setProperty('--background-black-color-rgb', '18, 18, 18')
    doc.style.setProperty('--preload-back-color', 'rgba(18, 18, 18, 0.3)')
    doc.style.setProperty('--active-btn-border-color', '#95dbd5')
    doc.style.setProperty('--background-light-color', '#eff0f6')
    doc.style.setProperty('--background-light-color-rgb', '239, 240, 247')
    doc.style.setProperty('--text-gray-200-color', '#eff0f6')
    doc.style.setProperty('--text-gray-200-color-rgb', '239, 240, 247')
    doc.style.setProperty('--sort-item-color', '#eff0f6')
    doc.style.setProperty('--header-bg-color', 'rgba(18, 18, 18, 0.7)')
    doc.style.setProperty('--header-bottom-color', 'rgba(239, 240, 247, 0.15)')
    doc.style.setProperty('--header-mobile-bg-color', 'rgba(18, 18, 18, 0.6)')
    doc.style.setProperty('--search-menu-icon-color', '#eff0f6')
    doc.style.setProperty('--outline-button-border', '#5ac3ba')
    doc.style.setProperty('--outline-button-color', '#eff0f6')
    doc.style.setProperty('--secondary-button-border', '#95dbd5')
    doc.style.setProperty('--avatar-border-color1', '#4ea19b')
    doc.style.setProperty('--avatar-border-color2', '#304e4e')
    doc.style.setProperty('--text-trending-card-color', 'rgba(239, 240, 247, 0.75)')
    doc.style.setProperty('--dashboard-tab-color', 'rgba(239, 240, 247, 0.6)')
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
    doc.style.setProperty('--menu-bg-color', '#121212')
    doc.style.setProperty('--menu-footer-color', '#2b2f32')
    doc.style.setProperty('--hero-artist-color', '#95dbd5')
    doc.style.setProperty('--twitter-btn-color1', '#5ac3ba')
    doc.style.setProperty('--twitter-btn-color2', '#2d625d')
    doc.style.setProperty('--notification-card-bg', 'rgba(239, 240, 247, 0.15)')
    doc.style.setProperty('--background-dark-color-rgb', '32, 36, 39')
    doc.style.setProperty('--dao-title-color', '#95dbd5')
    doc.style.setProperty('--nft-detail-artist', '#95dbd5')
    doc.style.setProperty('--dropdown-bg-color', 'rgba(14, 14, 14, 0.8)')
    doc.style.setProperty('--dropdown-border-color', 'rgba(239, 240, 247, 0.1)')
    doc.style.setProperty('--dropdown-menu-bg', '#202427')
    doc.style.setProperty('--dropdown-menu-hover-color', '')
    doc.style.setProperty('--dropdown-menu-hover-border', '')
    doc.style.setProperty('--wallet-green-text', '#95dbd5')
    doc.style.setProperty('--wallet-error-text', '#deefd0')
    doc.style.setProperty('--wallet-active-text', '#95dbd5')
    doc.style.setProperty('--follow-text-color', '#95dbd5')
    doc.style.setProperty('--follow-bg-color', 'linear-gradient(to bottom, #121212, #2d625d)')
    doc.style.setProperty('--artist-switch-color', 'linear-gradient(to right, #202427, #173437)')
    doc.style.setProperty('--artist-switch-bg', '#202427')
    doc.style.setProperty('--address-btn-color', 'rgba(239, 240, 247, 0.75)')
    doc.style.setProperty('--search-bg-color', '#121212')
    doc.style.setProperty('--menu-item-bg', 'linear-gradient(to bottom, #202427, #121212')
    doc.style.setProperty('--menu-item-open-bg', '#202427')
    doc.style.setProperty('--search-category-color', 'rgba(239, 240, 247, 0.6)')
    doc.style.setProperty('--menu-item-open-color', 'rgba(239, 240, 247, 1)')
    doc.style.setProperty('--menu-item-border', 'rgba(239, 240, 247, 0.1)')
    doc.style.setProperty('--menu-open-item-border', '#95dbd5')
    doc.style.setProperty('--menu-item-right-icon', '#95dbd5')
    doc.style.setProperty('--menu-item-right-open-icon', '#ffffff')
    doc.style.setProperty('--pagination-down-icon', '#ffffff')
    doc.style.setProperty('--search-item-bg', '#202427')
    doc.style.setProperty('--search-item-color', '#eff0f6')
    doc.style.setProperty('--resource-card-title', '#95dbd5')
    doc.style.setProperty('--nft-detail-section-bg', '#2b2b2b')
    doc.style.setProperty('--nft-detail-section-border', '#202427')
    doc.style.setProperty('--gradient-btn-color', '#202427')
    doc.style.setProperty('--outline-btn-border', '#95dbd5')
    doc.style.setProperty('--ellipse-btn-shadow', '#95dbd5')
    doc.style.setProperty('--nft-detail-bg', '#121212')
    doc.style.setProperty('--nft-detail-border', 'rgba(239, 240, 247, 0.1)')
    doc.style.setProperty('--alpha-area-border', '#95dbd5')
    doc.style.setProperty('--alpha-area-bg', 'transparent')
    doc.style.setProperty('--profile-menu-item-bg', '#202427')
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
    doc.style.setProperty(
      '--connect-wallet-bg',
      'linear-gradient(to bottom, rgba(55, 130, 135, 1), rgba(36, 66, 70, 1))'
    )
    doc.style.setProperty('--mint-progress-bg', 'rgba(12, 12, 12, 0.5)')
    doc.style.setProperty('--mint-progress-mobile-bg', 'rgba(12, 12, 12, 0.5)')
    doc.style.setProperty('--connected-wallet-bg', 'linear-gradient(to bottom, #202427, #121212)')
    doc.style.setProperty('--profile-border-color', '#95dbd5')
    doc.style.setProperty('--stats-accordion-bg', '#121212')
    doc.style.setProperty('--stats-accordion-border', '#95dbd5')
    doc.style.setProperty('--stats-accordion-normal-border', 'rgba(239, 240, 247, 0.1)')
    doc.style.setProperty('--resource-accordion-dropdown-bg', 'rgba(255, 255, 255, 0.2)')
    doc.style.setProperty('--resource-accordion-dropdown-color', '#eff0f6')
    doc.style.setProperty('--resource-accordion-close-color', '#95dbd5')
    doc.style.setProperty('--chevron-up-icon-color', '#95DBD5')
    doc.style.setProperty('--collection-filter-title', '#95DBD5')
    doc.style.setProperty('--deposit-btn-bg-1', '#2B4142')
    doc.style.setProperty('--deposit-btn-bg-2', '#59BFB7')
    doc.style.setProperty('--mint-btn-bg-1', '#95DBD5')
    doc.style.setProperty('--mint-btn-bg-2', '#4B6E6B')
    doc.style.setProperty('--mint-btn-color', '#202427')
    doc.style.setProperty('--wallet-box-shadow', '0px 3px 6px rgba(18, 18, 18, 0.4)')
    doc.style.setProperty('--wallet-btn-bg', 'linear-gradient(110deg, #121212, #202427)')
    doc.style.setProperty('--wallet-btn-hover', '#95dbd5')
    doc.style.setProperty('--collection-card-bg', '#121212')
    doc.style.setProperty('--collection-card-border', '1px')
    doc.style.setProperty('--profile-card-bg', '#121212')
    doc.style.setProperty('--mynft-outline-border', '#5ac3ba')
    doc.style.setProperty('--mynft-outline-color', '')
    doc.style.setProperty('--filter-close-color', '#eff0f6')
    doc.style.setProperty('--negative-btn-border', '#95DBD5')
    doc.style.setProperty('--checkbox-border-color', '#95DBD5')
    doc.style.setProperty('--checkbox-bg-color', '#95DBD5')
    doc.style.setProperty('--ellipse-menu-bg', '#1b1b1b')
    doc.style.setProperty('--ellipse-report-bg', '#1b1b1b')
    doc.style.setProperty('--mobile-serachbox-bg', '#1b1b1b')
    doc.style.setProperty('--mobile-serach-area-bg', '#313233')
    doc.style.setProperty('--modal-close-btn-bg', 'rgba(239, 240, 246, 0.2)')
    doc.style.setProperty('--auction-input-bg', '#202427')
    doc.style.setProperty('--see-more-border', '#ffffff')
    doc.style.setProperty('--follow-btn-border', '#95dbd5')
    doc.style.setProperty('--follow-btn-border-mobile', 'rgba(239, 240, 247, 0.25)')
    doc.style.setProperty('--artist-card-bg', 'rgba(32, 36, 39, 0.7)')
    doc.style.setProperty('--nft-info-bg', 'rgba(32, 36, 39, 0.5)')
    doc.style.setProperty('--place-bid-close-rect', 'rgba(239, 240, 246, 0.2)')
    doc.style.setProperty('--place-bid-close-path', '#eff0f6')
    doc.style.setProperty('--input-bg', 'rgba(255, 255, 255, 0.25)')
    doc.style.setProperty(
      '--browse-nft-blur-bg',
      'linear-gradient(to top,rgba(32, 36, 39, 0.5) 0%,rgba(32, 36, 39, 0.1) 40%,rgba(32, 36, 39, 0.15) 60%,rgba(32, 36, 39, 0.5) 100%)'
    )
    doc.style.setProperty('--resource-card-bg', 'linear-gradient(to bottom, #101717, #3A6A68)')
    doc.style.setProperty('--resource-card-default-bg', '#202427')
    doc.style.setProperty('--home-swiper-bg', '#95dbd5')
    doc.style.setProperty('--explore-btn-bg-1', '#5ac3ba')
    doc.style.setProperty('--explore-btn-bg-2', '#378287')
    doc.style.setProperty('--home-hero-title', '#eff0f6')
    doc.style.setProperty('--profile-user-color', '#95dbd5')
    doc.style.setProperty('--single-nft-btn-bg-1', '#121212')
    doc.style.setProperty('--single-nft-btn-bg-2', '#2D625D')
    doc.style.setProperty('--single-nft-btn-color', '#95DBD5')
    doc.style.setProperty('--drop-zone-bg', 'rgba(255, 255, 255, 0.05)')
    doc.style.setProperty('--filter-btn-bg', '#272727')
    doc.style.setProperty('--filter-btn-border', 'rgba(239,240,247, 0.1)')
    doc.style.setProperty('--ellipse-svg-1', '#63d6cd')
    doc.style.setProperty('--ellipse-svg-2', '#63d6cd')
    doc.style.setProperty('--tooltip-bg', 'rgba(239, 240, 247, 0.2)')
    doc.style.setProperty('--tooltip-border', 'rgba(239, 240, 247, 0.1)')
    doc.style.setProperty('--back-btn-color', '#378287')
    doc.style.setProperty('--back-btn-border', '#95dbd5')
    doc.style.setProperty('--back-btn-border-mobile', '#95dbd5')
    doc.style.setProperty('--back-btn-border-width', '')
    doc.style.setProperty('--artwork-table-border', 'rgba(239, 240, 247, 0.1)')
    doc.style.setProperty('--artwork-table-tr', 'rgba(239, 240, 247, 0.8)')
    doc.style.setProperty('--artwork-table-tr-hover-bg', '#202427')
    doc.style.setProperty('--artwork-table-tr-hover-color', '#eff0f6')
    doc.style.setProperty('--deposit-icon-bg', '#95dbd5')
    doc.style.setProperty('--wallet-icon-bg-1', '#9945ff')
    doc.style.setProperty('--wallet-icon-bg-2', '#8752f3')
    doc.style.setProperty('--wallet-icon-bg-3', '#5497d5')
    doc.style.setProperty('--wallet-icon-bg-4', '#43b4ca')
    doc.style.setProperty('--wallet-icon-bg-5', '#28e0b9')
    doc.style.setProperty('--wallet-icon-bg-6', '#19fb9b')
    doc.style.setProperty('--wallet-icon-light-bg-1', '#9945ff')
    doc.style.setProperty('--wallet-icon-light-bg-2', '#8752f3')
    doc.style.setProperty('--wallet-icon-light-bg-3', '#5497d5')
    doc.style.setProperty('--wallet-icon-light-bg-4', '#43b4ca')
    doc.style.setProperty('--wallet-icon-light-bg-5', '#28e0b9')
    doc.style.setProperty('--wallet-icon-light-bg-6', '#19fb9b')
    doc.style.setProperty('--logout-icon-color', '#95dbd5')
    doc.style.setProperty('--trash-icon-color', '#eff0f6')
    doc.style.setProperty('--day-btn-color', '#95dbd5')
    doc.style.setProperty('--day-btn-bg-1', '#262627')
    doc.style.setProperty('--day-btn-bg-2', '#2b2b2b')
    doc.style.setProperty('--search-icon-color', '#121212')
    doc.style.setProperty('--switch-disabled-color', 'rgba(239, 240, 247, 0.75)')
    doc.style.setProperty('--logo-text-color', '#fff')
    doc.style.setProperty('--logo-text-ballon', '#95dbd5')
    doc.style.setProperty(
      '--activity-tr-bg',
      'linear-gradient(to bottom, rgba(55, 130, 135, 0.35), rgba(28, 65, 68, 0.35))'
    )
    doc.style.setProperty('--banner-image-bg', '#ffffff')
    doc.style.setProperty('--menu-item-activity-icon', '#95dbd5')
    doc.style.setProperty('--card-border-color', '#333333')
    doc.style.setProperty('--social-bg-color', '#202427')
    doc.style.setProperty('--nft-border-color', '#292929')
    doc.style.setProperty('--address-btn-bg-color', '#2B2B2B')
    doc.style.setProperty('--stats-bg-color', '#1b1b1b')
    doc.style.setProperty('--tab-bottom-color', '#95dbd5')
    doc.style.setProperty('--top-artist-bg', 'linear-gradient(to bottom, rgba(149, 219, 213, 1), rgba(75, 110, 107, 1)')
    doc.style.setProperty('--sell-nft-border', 'rgba(255, 255, 255, 0.1)')
    doc.style.setProperty('--sell-nft-bg', '#121212')
    doc.style.setProperty('--setting-input-bg', '#202427')
    doc.style.setProperty('--search-gray-icon', 'rgba(239, 240, 247, 0.75)')
    doc.style.setProperty('--search-icon-stop-1', '#202427')
    doc.style.setProperty('--search-icon-stop-2', '#2D625D')
    doc.style.setProperty('--search-icon-bg', 'rgba(32, 36, 39, 0.6)')
    doc.style.setProperty('--search-gray-icon-disable', 'rgba(255, 255, 255, 0.2)')
    doc.style.setProperty('--profile-banner-overlay', '18, 18, 18')
    doc.style.setProperty('--follow-btn-bg', '#1b1b1b')
    doc.style.setProperty('--follow-btn-color', '#eff0f6')
    doc.style.setProperty('--hero-overlay-color', 'rgba(18, 18, 18, 0.5)')
    doc.style.setProperty('--hide-nft-border-color', '#95dbd5')
    doc.style.setProperty('--category-chip-bg', 'rgba(239, 240, 247, 0.15)')
    doc.style.setProperty('--live-auction-card', '#1b1b1b')
    doc.style.setProperty('--accordian-header-bg', '#1b1b1b')
    doc.style.setProperty('--accordian-area-bg', '#1b1b1b')
    doc.style.setProperty('--social-share-bg', '#121212')
    doc.style.setProperty(
      '--social-share-hover',
      'linear-gradient(to bottom, rgba(90, 195, 186, 0.3) 0%, rgba(45, 98, 93, 0.3) 100%)'
    )
    doc.style.setProperty('--share-icon-bg', '#2B2B2B')
    doc.style.setProperty('--dao-setup-left', 'linear-gradient(to bottom, #121212, #173639)')
    doc.style.setProperty('--outline-btn-border', '#95dbd5')
    doc.style.setProperty('--report-menu-bg', 'rgba(18, 18, 18, 0.5)')
    doc.style.setProperty('--stats-label-bg', '#17191a')
    doc.style.setProperty(
      '--category-bottom-mask',
      'linear-gradient(to bottom, rgba(18, 18, 18, 0), rgba(18, 18, 18, 1))'
    )
    doc.style.setProperty('--stats-search-bg', '#2b2b2b')
    doc.style.setProperty('--artwork-tbl-header-bg', 'linear-gradient(to bottom, #202427, #121212)')
    doc.style.setProperty('--primary-btn-bg-left', '#4B6E6B')
    doc.style.setProperty('--primary-btn-bg-right', '#95DBD5')
    doc.style.setProperty('--auction-card-label', '#95dbd5')
    doc.style.setProperty('--auction-card-bg', 'linear-gradient(to right, #4b6e6b, #95dbd5)')
    doc.style.setProperty('--auction-card-color', '#202427')
    doc.style.setProperty('--dao-connect-border-width', '1px')
    doc.style.setProperty('--dao-connect-bg', 'transparent')
    doc.style.setProperty('--dao-treasury-bg', '#1b1b1b')
    doc.style.setProperty('--deposit-disabled-color', '#E2E6EA')
    doc.style.setProperty('--nav-divider-color', '#292929')
    doc.style.setProperty('--profile-setup-bg', 'linear-gradient(to bottom, #264e51, #131516)')
    doc.style.setProperty('--profile-setup-input-bg', 'rgba(239, 240, 247, 0.15)')
    doc.style.setProperty('--profile-setup-avatar-bg', 'linear-gradient(300deg, #4a9791 55%, #202427 100%)')
    doc.style.setProperty('--profile-setup-left-bg', 'linear-gradient(to bottom, #121212, #173538)')
    doc.style.setProperty('--profile-divider', 'rgba(239, 240, 247, 0.5)')
    doc.style.setProperty('--quick-buy-icon-color', '#202427')
  }
}
