import { createStore } from 'redux'

const initialState = {
  viewport: 'lg',
  expired: false,
  openMobileMenu: false,
  openMobileSearchBox: false,
  exploreTab: 0,
  web3: {
    provider: null,
    web3Provider: null,
    address: null,
    chainId: null,
  },
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    default:
      return state
  }
}

const store = createStore(changeState)
export default store
