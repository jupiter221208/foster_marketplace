import React from 'react'

// components
import PriceInput from 'components/Input/PriceInput'
import LoadingPrimaryButton from 'components/Button/LoadingPrimaryButton'
import GradientButton from 'components/Button/GradientButton'
import InfoGreenIcon from 'assets/icons/info-gray-18x18.svg?component'

// resources

// styles
import styles from './index.module.scss'

const NFTPlaceBidSection = props => {
  const {
    publicKey,
    highBidder,
    price,
    setPrice,
    isEnded,
    connected,
    setVisible,
    mainWalletBalance,
    minBidAmount,
    biddingBalance,
    bidWalletLock,
    endPhaseBidIncrement,
    showAlert,
    placeBidAndSave,
    auctionLoading,
    viewport,
    endPhaseDuration,
    auctionInfoFocus,
    setAuctionInfoFocus,
  } = props

  return (
    <div>
      {publicKey?.toBase58() === highBidder ? (
        <>
          <div className={styles.highBidText}>You are currently the highest bidder!</div>
        </>
      ) : (
        <div className="relative mt-[0px] mt-[10px] lg:mt-[10px]">
          <div className="w-full flex gap-[15px] sm:flex-row flex-col">
            <div className="w-full sm:min-w-[50%] flex justify-center">
              <PriceInput
                value={price}
                placeholder="Enter Bid amount"
                backgroundColor={'var(--bg-151515-EEEDEB)'}
                borderColor={'rgba(var(--main-bg-color-rgb), 0.1)'}
                borderWidth={1}
                borderRadius={23}
                fullWidth
                min={0}
                height={45}
                onChange={value => {
                  if (value < 0) {
                    setPrice('')
                  } else {
                    setPrice(value)
                  }
                }}
              />
            </div>
            <div
              className={`${styles.placeBidBG} sm:w-[50%]`}
              onClick={async () => {
                if (price === '' || parseFloat(price) < parseFloat(minBidAmount.toFixed(2))) return

                if (isEnded) return

                if (!connected) {
                  setVisible(true)
                  return
                }

                if (parseFloat(price) > mainWalletBalance + biddingBalance - bidWalletLock) {
                  showAlert()
                  return
                }

                placeBidAndSave(price)
              }}
            >
              {auctionLoading ? (
                <LoadingPrimaryButton
                  text={'Processing...'}
                  fullWidth
                  height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 50 : 45}
                  borderRadius={23}
                />
              ) : (
                <GradientButton
                  label="Place Bid"
                  fullWidth
                  height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 50 : 45}
                  fontSize={16}
                  borderRadius={23}
                  disabled={price === '' || parseFloat(price) < parseFloat(minBidAmount.toFixed(2))}
                  onClick={() => {}}
                />
              )}
            </div>
          </div>
          <div className="w-full flex items-center justify-between">
            <div className={styles.minText}>Minimum Bid:&nbsp;{minBidAmount.toFixed(2)}&nbsp;SOL</div>
            {endPhaseDuration > 0 && (
              <div
                className="flex gap-[6px] items-center"
                onClick={() => {
                  setAuctionInfoFocus(true)
                  setTimeout(() => {
                    setAuctionInfoFocus(false)
                  }, 2000)
                }}
              >
                <div className={styles.endPhaseText}>End Phase</div>
                <div
                  onMouseEnter={() => {
                    setAuctionInfoFocus(true)
                    setTimeout(() => {
                      setAuctionInfoFocus(false)
                    }, 3000)
                  }}
                >
                  <InfoGreenIcon />
                </div>
              </div>
            )}
          </div>
          {auctionInfoFocus && (
            <div className="absolute w-full flex justify-end top-[10px]">
              <div className={styles.auctionInfoText}>
                <div className={styles.auctionInfoTitle}>End Phase</div>
                Auction uses
                <span>&nbsp;{endPhaseBidIncrement} SOL&nbsp;</span>
                bid increments in the last
                <span>&nbsp;{Math.floor(endPhaseDuration / 60)} mins.&nbsp;</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default NFTPlaceBidSection
