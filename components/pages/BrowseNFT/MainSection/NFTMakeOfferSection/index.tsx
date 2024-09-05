import React from 'react'

// components
import OutlineButton from 'components/Button/OutlineButton'
import GradientButton from 'components/Button/GradientButton'
import LoadingPrimaryButton from 'components/Button/LoadingPrimaryButton'

// resources
import SolanaLogoMobileIcon from 'assets/icons/solana-logo-dark-small.svg?component'

// styles
import styles from './index.module.scss'

const NFTMakeOfferSection = props => {
  const {
    nftPrice,
    solToUsdRate,
    isOwnNft,
    viewport,
    connected,
    setVisible,
    setOpenOfferModal,
    tradeStateAddress,
    buyLoading,
    quickBuy,
    setShowUpdateListNFTModal,
  } = props

  return (
    <div className="w-full mt-[30px]">
      <div className={`w-full flex gap-[6px] ${styles.border_top}`}>
        <div className="flex items-center">
          <div className="flex items-center mt-[4px]">
            <SolanaLogoMobileIcon alt="" />
          </div>
          <div className={`${styles.solPrice} ml-[4px]`}>{nftPrice.toFixed(2)}</div>
          <div className={`${styles.dollarPrice} ml-[8px]`}>${(nftPrice * solToUsdRate).toFixed(2)}</div>
        </div>
      </div>

      {(isOwnNft === false || isOwnNft === null) && (
        <div className="w-full flex flex-col lg:flex-row mt-[15px] lg:mt-[15px] gap-[15px] lg:gap-[15px]">
          <OutlineButton
            label="Make Offer"
            fullWidth
            height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 50 : 45}
            backgroundColor="var(--bg-151515-EEEDEB)"
            fontSize={16}
            borderRadius={23}
            onClick={() => {
              if (!connected) {
                setVisible(true)
                return
              }
              setOpenOfferModal(true)
            }}
          />
          {tradeStateAddress && !buyLoading ? (
            <GradientButton
              fullWidth
              height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 50 : 45}
              fontSize={16}
              borderRadius={23}
              label="Buy Now"
              disabled={!tradeStateAddress}
              onClick={() => quickBuy()}
            />
          ) : (
            <LoadingPrimaryButton
              fullWidth
              height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 50 : 45}
              borderRadius={23}
            />
          )}
        </div>
      )}

      {isOwnNft === true ? (
        <div className="w-full flex content-none mt-[15px] lg:mt-[15px]">
          <GradientButton
            label="Delist or Update"
            fullWidth
            height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 50 : 45}
            fontSize={16}
            borderRadius={23}
            onClick={() => setShowUpdateListNFTModal(true)}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default NFTMakeOfferSection
