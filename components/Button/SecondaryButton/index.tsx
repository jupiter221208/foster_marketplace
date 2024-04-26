import React, { useState } from 'react'

// next components

// icons
import MakeOfferIcon from 'assets/icons/make-offer-icon.svg?component'
import FinalizeSaleIcon from 'assets/icons/finalize-sale-icon.svg?component'
import ListArtworkIcon from 'assets/icons/list-artwork-icon.svg?component'
import AddCartIcon from 'assets/icons/add-cart-icon.svg?component'
import BackIcon from 'assets/icons/back-icon.svg?component'

// styles
import styles from './index.module.scss'

const SecondaryButton = props => {
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
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className={'w-full h-full absolute top-0 left-0 flex justify-center items-center'}>
        <div
          className={`absolute top-0 right-0 w-[60px] h-[50px] flex justify-center items-center ${styles.iconBG} `}
        />
        {label}
      </div>

      <div className={`absolute w-[calc(100%+10px)] h-full left-[-10px] top-0 ${!disabled && styles.iconArea}`}>
        <div className={`absolute top-0 right-0 w-[60px] h-[50px] flex justify-center items-center`}>
          {type === 'make-offer' ? (
            <MakeOfferIcon />
          ) : type === 'finalize-sale' ? (
            <FinalizeSaleIcon />
          ) : type === 'list-artwork' ? (
            <ListArtworkIcon />
          ) : type === 'add-cart' ? (
            <AddCartIcon />
          ) : type === 'back' ? (
            <BackIcon />
          ) : (
            <></>
          )}
        </div>
      </div>
      {/* <div className="w-[45%] absolute left-0 top-0 flex">
        <div className={`${hover ? 'w-full' : 'w-[56px]'} flex justify-end items-center`}>
          <div className="w-[56px] h-[50px] flex justify-center items-center">
            {type === 'make-offer' ? (
              <MakeOfferIcon />
            ) : type === 'finalize-sale' ? (
              <FinalizeSaleIcon />
            ) : type === 'list-artwork' ? (
              <ListArtworkIcon />
            ) : type === 'add-cart' ? (
              <AddCartIcon />
            ) : type === 'back' ? (
              <BackIcon />
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="min-w-[13px] max-w-[13px]">
          <SecondButtonDivider />
        </div>
      </div>
      <div
        className={`absolute top-0  bottom-0 flex  items-center ${
          hover ? 'w-[55%] right-0 pl-[20px]' : 'w-[100%] justify-center left-0'
        }`}
      >
        {label}
      </div> */}
    </button>
  )
}

export default SecondaryButton
