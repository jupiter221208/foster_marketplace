export const isFromExisting = event => {
  let exist = false
  if (
    event === 'ListingAdded' ||
    event === 'ListingRemoved' ||
    event === 'QuickBuy' ||
    event === 'OfferPlaced' ||
    event === 'OfferAccepted' ||
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
