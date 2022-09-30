import { createStore } from 'redux'

const initialState = {
  expired: false,
  openMobileMenu: false,
  openMobileSearchBox: false,
  openConnectWallet: false,
  exploreTab: 0,
  connectWalletStatus: false,
  openMyWallet: false,
  openCreateNFTModal: false,
  profileSetup: false,
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
