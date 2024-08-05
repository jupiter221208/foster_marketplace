import { createStore } from 'redux'

const initialState = {
  lightMode: null,
  profileInfo: null,
  isLoading: false,
  isCollectionMinting: false,
  expired: false,
  openShoppingCart: false,
  openMobileMenu: false,
  openMobileSearchBox: false,
  openConnectWallet: false,
  createTab: null,
  exploreTab: 0,
  availabilityFilter: 3,
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
  removeCollectionId: '',
  markAsRead: false,
  expiryDate: 0,
  loginSignedFlag: false,
  printImageUrl: '',
  merchData: null,
  firstLoaded: true,
  activeTab: 0,
  isAddToCart: false,
  mintCollectionStep: 1,
  collectionMintAddress: '',
  collectionMintCategories: [],
  collectionMintName: '',
  collectionCoverUrl: '',
  collectionKind: 'foster',
  merchBy: '',
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
