import React from 'react'

// images and icons
import BuyIcon from 'assets/icons/buy-now-icon.svg?component'
import PlaceBidIcon from 'assets/icons/place-bid-icon.svg?component'
import StartAuctionIcon from 'assets/icons/start-auction-icon.svg?component'
import UpdateRelistIcon from 'assets/icons/update-relist-icon.svg?component'
import SelectShippingIcon from 'assets/icons/select-shipping-icon.svg?component'
import NextArrowIcon from 'assets/icons/next-arrow-icon.svg?component'
import TweetIcon from 'assets/icons/tweet-icon.svg?component'
import PaymentIcon from 'assets/icons/make-payment-icon.svg?component'
import WithdrawIcon from 'assets/icons/withdraw-button-icon.svg?component'
import DepositIcon from 'assets/icons/deposit-button-icon.svg?component'
import SaveIcon from 'assets/icons/save-button-icon.svg?component'
import MerchIcon from 'assets/icons/merch-icon.svg?component'

// styles
import styles from './index.module.scss'

const PrimaryDashboardButton = props => {
  const { label, type, fullWidth, width, onClick } = props

  return (
    <button
      type="button"
      onClick={() => onClick()}
      className={`${styles.container}`}
      style={{
        width: fullWidth ? '100%' : width,
      }}
    >
      <div className="flex gap-[9px] items-center">
        <div>
          {type === 'buy-now' ? (
            <BuyIcon />
          ) : type === 'place-bid' ? (
            <PlaceBidIcon />
          ) : type === 'start-auction' ? (
            <StartAuctionIcon />
          ) : type === 'update-relist' ? (
            <UpdateRelistIcon />
          ) : type === 'shipping' ? (
            <SelectShippingIcon />
          ) : type === 'payment' ? (
            <PaymentIcon />
          ) : type === 'next' ? (
            <NextArrowIcon />
          ) : type === 'tweet' ? (
            <TweetIcon />
          ) : type === 'deposit' ? (
            <DepositIcon />
          ) : type === 'withdraw' ? (
            <WithdrawIcon />
          ) : type === 'save' ? (
            <SaveIcon />
          ) : type === 'merch' ? (
            <MerchIcon />
          ) : (
            <></>
          )}
        </div>
        {label}
      </div>
    </button>
  )
}

export default PrimaryDashboardButton
