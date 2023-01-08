export const isBuyerExisting = event => {
  let exist = false
  if (
    event === 'AuctionWon' ||
    event === 'BidPlaced' ||
    event === 'QuickBuy' ||
    event === 'OfferMade' ||
    event === 'ListingSold' ||
    event === 'OfferCanceled'
  )
    exist = true
  return exist
}

export const isAmountExisting = event => {
  let exist = false
  if (
    event === 'AuctionStarted' ||
    event === 'AuctionWon' ||
    event === 'BidPlaced' ||
    event === 'ListingAdded' ||
    event === 'ListingUpdated' ||
    event === 'QuickBuy' ||
    event === 'OfferMade' ||
    event === 'ListingSold'
  )
    exist = true
  return exist
}
