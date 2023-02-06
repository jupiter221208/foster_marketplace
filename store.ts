import { createStore } from 'redux'

const initialState = {
  profileInfo: null,
  isLoading: false,
  isCollectionMinting: false,
  expired: false,
  openMobileMenu: false,
  openMobileSearchBox: false,
  openConnectWallet: false,
  exploreTab: 0,
  connectWalletStatus: false,
  openCreateNFTModal: false,
  openSellNFTModal: false,
  profileSetup: false,
  isGetMyNFTs: false,
  myNftList: [],
  isGetListedNFTs: false,
  fixedPriceNFTs: [],
  liveAuctionNFTs: [],
  bidWalletLock: 0,
  offerWalletLock: 0,
  loginAndRefresh: false,
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
