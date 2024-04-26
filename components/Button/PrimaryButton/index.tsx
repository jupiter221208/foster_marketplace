import React, { useState } from 'react'

// next components
import Image from 'next/image'

// images and icons
import ButtonDivider from 'assets/icons/button-divider.svg?component'
import HoverButtonDivider from 'assets/icons/hover-button-divider.svg?component'
import BuyIcon from 'assets/icons/buy-now-icon.svg?component'
import BuyHoverIcon from 'assets/icons/buy-now-icon-hover.svg?component'
import PlaceBidIcon from 'assets/icons/place-bid-icon.svg?component'
import PlaceBidHoverIcon from 'assets/icons/place-bid-hover-icon.svg?component'
import StartAuctionIcon from 'assets/icons/start-auction-icon.svg?component'
import StartAuctionHoverIcon from 'assets/icons/start-auction-hover-icon.svg?component'
import UpdateRelistIcon from 'assets/icons/update-relist-icon.svg?component'
import UpdateRelistHoverIcon from 'assets/icons/update-relist-hover-icon.svg?component'
import SelectShippingIcon from 'assets/icons/select-shipping-icon.svg?component'
import SelectShippingHoverIcon from 'assets/icons/select-shipping-hover-icon.svg?component'

// styles
import styles from './index.module.scss'

const PrimaryButton = props => {
  const { label, type, fullWidth, width, disabled, onClick } = props
  const [hover, setHover] = useState(false)

  return (
    <button
      type="button"
      onClick={() => !disabled && onClick()}
      className={styles.container}
      style={{
        width: fullWidth ? '100%' : width,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className={'w-full h-full absolute top-0 left-0 flex justify-center items-center'}>
        <div
          className={`absolute top-0 right-0 w-[60px] h-[50px] flex justify-center items-center ${styles.iconBG} `}
        />
        {label}
      </div>

      <div className={`absolute w-[calc(100%+10px)] h-full left-[-10px] top-0 ${styles.iconArea}`}>
        <div className={`absolute top-0 right-0 w-[60px] h-[50px] flex justify-center items-center`}>
          {type === 'buy-now' ? (
            hover ? (
              <BuyIcon />
            ) : (
              <BuyIcon />
            )
          ) : type === 'place-bid' ? (
            hover ? (
              <PlaceBidIcon />
            ) : (
              <PlaceBidIcon />
            )
          ) : type === 'start-auction' ? (
            hover ? (
              <StartAuctionIcon />
            ) : (
              <StartAuctionIcon />
            )
          ) : type === 'update-relist' ? (
            hover ? (
              <UpdateRelistIcon />
            ) : (
              <UpdateRelistIcon />
            )
          ) : type === 'shipping' ? (
            hover ? (
              <SelectShippingIcon />
            ) : (
              <SelectShippingIcon />
            )
          ) : (
            <></>
          )}
        </div>
      </div>
    </button>
  )
}

export default PrimaryButton
