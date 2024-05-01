import React, { useState } from 'react'

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

// styles
import styles from './index.module.scss'

const PrimaryButton = props => {
  const { label, type, fullWidth, width, disabled, onClick } = props
  const [hover, setHover] = useState(false)

  return (
    <button
      type="button"
      onClick={() => !disabled && onClick()}
      className={`${styles.container} ${disabled ? styles.disabled : ''} ${!disabled && hover ? styles.hoverBtn : ''}`}
      style={{
        width: fullWidth ? '100%' : width,
      }}
    >
      <div className={'w-full h-full absolute top-0 left-0 flex justify-center items-center'}>
        <div
          className={`absolute top-0 right-0 w-[60px] h-[50px] flex justify-center items-center ${styles.iconBG} `}
        />
        {label}
      </div>

      <div
        className={`absolute w-[calc(100%+10px)] h-full left-[-10px] top-0 ${!disabled && styles.iconArea}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className={`absolute top-0 right-0 w-[60px] h-[50px] flex justify-center items-center`}>
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
          ) : (
            <></>
          )}
        </div>
      </div>
    </button>
  )
}

export default PrimaryButton
