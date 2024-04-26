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
      <div className="w-[45%] absolute left-0 top-0 flex">
        <div className={`${hover ? 'w-full' : 'w-[56px]'} flex justify-end items-center`}>
          <div className="w-[56px] h-[50px] flex justify-center items-center">
            {type === 'buy-now' ? (
              hover ? (
                <BuyHoverIcon />
              ) : (
                <BuyIcon />
              )
            ) : type === 'place-bid' ? (
              hover ? (
                <PlaceBidHoverIcon />
              ) : (
                <PlaceBidIcon />
              )
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="min-w-[13px] max-w-[13px]">{hover ? <HoverButtonDivider /> : <ButtonDivider />}</div>
      </div>
      <div
        className={`absolute top-0  bottom-0 flex  items-center ${
          hover ? 'w-[55%] right-0 pl-[20px]' : 'w-[100%] justify-center left-0'
        }`}
      >
        {label}
      </div>
    </button>
  )
}

export default PrimaryButton
