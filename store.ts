import { createStore } from 'redux'

const initialState = {
  lightMode: false,
  profileInfo: null,
  isLoading: false,
  isCollectionMinting: false,
  expired: false,
  openMobileMenu: false,
  openMobileSearchBox: false,
  openConnectWallet: false,
  exploreTab: 0,
  availabilityFilter: 0,
  artworkSort: '',
  collectionSort: '',
  collectionCategory: '',
  artworkCategory: '',
  artistSort: '',
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
  hideNftToken: '',
  unhideNftToken: '',
  markAsRead: false,
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
