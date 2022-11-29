import { createStore } from 'redux'

const initialState = {
  isLoading: false,
  expired: false,
  openMobileMenu: false,
  openMobileSearchBox: false,
  openConnectWallet: false,
  exploreTab: 0,
  connectWalletStatus: false,
  openCreateNFTModal: false,
  profileSetup: false,
  isGetMyNFTs: false,
  myNftList: [],
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
