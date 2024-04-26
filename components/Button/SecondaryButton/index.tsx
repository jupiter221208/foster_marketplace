import React, { useState } from 'react'

// next components

// icons
import MakeOfferIcon from 'assets/icons/make-offer-icon.svg?component'
import FinalizeSaleIcon from 'assets/icons/finalize-sale-icon.svg?component'
import SecondButtonDivider from 'assets/icons/second-button-divider.svg?component'

// styles
import styles from './index.module.scss'

const SecondaryButton = props => {
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
      <div className={`${hover ? 'w-full' : 'w-[56px]'} flex justify-end items-center`}>
        <div className="w-[56px] h-[50px] flex justify-center items-center">
          {type === 'make-offer' ? <MakeOfferIcon /> : type === 'finalize-sale' ? <FinalizeSaleIcon /> : <></>}
        </div>
      </div>
      <div className="min-w-[13px] max-w-[13px]">
        <SecondButtonDivider />
      </div>
      <div className="w-full">
        <div>{label}</div>
      </div>
    </button>
  )
}

export default SecondaryButton
