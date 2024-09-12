import React from 'react'

// images and icons
import MakeOfferIcon from 'assets/icons/make-offer-icon.svg?component'
import FinalizeSaleIcon from 'assets/icons/finalize-sale-icon.svg?component'
import ListArtworkIcon from 'assets/icons/list-artwork-icon.svg?component'
import AddCartIcon from 'assets/icons/add-cart-icon.svg?component'
import BackIcon from 'assets/icons/back-icon.svg?component'
import CancelIcon from 'assets/icons/cancel-icon.svg?component'
import UnsaveIcon from 'assets/icons/unsave-icon.svg?component'
import UnhideIcon from 'assets/icons/unhide-button-icon.svg?component'
import UpdateRelistIcon from 'assets/icons/update-relist-icon.svg?component'
import NextArrowIcon from 'assets/icons/next-arrow-icon.svg?component'
import OrderDetailIcon from 'assets/icons/order-details-icon.svg?component'

// styles
import styles from './index.module.scss'

const SecondaryDashboardButton = props => {
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
        <div className="mt-[2px]">
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
          ) : type === 'cancel' ? (
            <CancelIcon />
          ) : type === 'unsave' ? (
            <UnsaveIcon />
          ) : type === 'unhide' ? (
            <UnhideIcon />
          ) : type === 'update-relist' ? (
            <UpdateRelistIcon />
          ) : type === 'next' ? (
            <NextArrowIcon />
          ) : type === 'order-details' ? (
            <OrderDetailIcon />
          ) : (
            <></>
          )}
        </div>
        {label}
      </div>
    </button>
  )
}

export default SecondaryDashboardButton
