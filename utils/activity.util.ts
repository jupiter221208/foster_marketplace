export const isFromExisting = event => {
  let exist = false
  if (
    event === 'ListingAdded' ||
    event === 'ListingRemoved' ||
    event === 'QuickBuy' ||
    event === 'OfferPlaced' ||
    event === 'OfferAccepted' ||
    event === 'OfferReceived' ||
    event === 'AuctionStarted' ||
    event === 'BidPlaced' ||
    event === 'SaleFinalized' ||
    event === 'AuctionCanceled'
  )
    exist = true
  return exist
}

export const isToExisting = event => {
  let exist = false
  if (
    event === 'ListingAdded' ||
    event === 'QuickBuy' ||
    event === 'OfferPlaced' ||
    event === 'OfferAccepted' ||
    event === 'OfferReceived' ||
    event === 'BidPlaced' ||
    event === 'SaleFinalized'
  )
    exist = true
  return exist
}

export const isPriceExisting = event => {
  let exist = false
  if (
    event === 'ListingAdded' ||
    event === 'ListingUpdated' ||
    event === 'QuickBuy' ||
    event === 'OfferPlaced' ||
    event === 'OfferAccepted' ||
    event === 'AuctionStarted' ||
    event === 'BidPlaced' ||
    event === 'AuctionEnded' ||
    event === 'SaleFinalized'
  )
    exist = true
  return exist
}

export const isSellerExisting = event => {
  let exist = false
  if (
    event === 'OfferPlaced' ||
    event === 'OfferAccepted' ||
    event === 'OfferReceived' ||
    event === 'ListingAdded' ||
    event === 'ListingUpdated' ||
    event === 'ListingRemoved' ||
    event === 'Purchase' ||
    event === 'Sale' ||
    event === 'AuctionStarted' ||
    event === 'PlacedBid' ||
    event === 'ReceivedBid' ||
    event === 'SaleFinalized'
  )
    exist = true
  return exist
}

export const isBuyerExisting = event => {
  let exist = false
  if (
    event === 'Purchase' ||
    event === 'Sale' ||
    event === 'OfferPlaced' ||
    event === 'OfferAccepted' ||
    event === 'OfferReceived' ||
    event === 'PlacedBid' ||
    event === 'ReceivedBid' ||
    event === 'SaleFinalized'
  )
    exist = true
  return exist
}

export const isAmountExisting = event => {
  let exist = false
  if (
    event === 'OfferPlaced' ||
    event === 'OfferAccepted' ||
    event === 'OfferReceived' ||
    event === 'ListingAdded' ||
    event === 'ListingUpdated' ||
    event === 'ListingRemoved' ||
    event === 'Purchase' ||
    event === 'Sale' ||
    event === 'AuctionStarted' ||
    event === 'PlacedBid' ||
    event === 'ReceivedBid' ||
    event === 'SaleFinalized'
  )
    exist = true
  return exist
}

export const isSellerCollection = event => {
  let exist = false
  if (
    event === 'ListingAdded' ||
    event === 'ListingUpdated' ||
    event === 'Sale' ||
    event === 'AuctionStarted' ||
    event === 'BidPlaced' ||
    event === 'AuctionCanceled' ||
    event === 'SaleFinalized'
  )
    exist = true
  return exist
}

export const isBuyerCollection = event => {
  let exist = false
  if (event === 'Sale' || event === 'BidPlaced' || event === 'SaleFinalized') exist = true
  return exist
}

export const isAmountCollection = event => {
  let exist = false
  if (
    event === 'ListingAdded' ||
    event === 'ListingUpdated' ||
    event === 'Sale' ||
    event === 'AuctionStarted' ||
    event === 'BidPlaced' ||
    event === 'SaleFinalized'
  )
    exist = true
  return exist
}
