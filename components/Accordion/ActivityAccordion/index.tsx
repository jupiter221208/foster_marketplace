import React, { useRef } from 'react'

// next components

// third party components
import { Disclosure } from '@headlessui/react'

// components

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo-dark-small.svg?component'
import DownArrowIcon from 'assets/icons/down-arrow-icon.svg?component'

// json

// styles
import styles from './index.module.scss'
import { getDateString, getDisplayUserName } from 'utils/strings'

import { isBuyerExisting, isAmountExisting } from 'utils/activity.util'
import { countDecimals, getBuyerName, getLocalDate, getOwnerName } from 'utils/helpers'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { useSolToUsdRate } from 'hooks/useSolToUsdRate'

const ActivityAccordion = props => {
  const { data } = props
  const dispatch = useDispatch()
  const router = useRouter()
  const { solToUsdRate } = useSolToUsdRate()

  const buttonRefs = useRef<any>([])
  const openedRef = useRef<any | null>(null)
  const clickRecent = index => {
    const clickedButton = buttonRefs.current[index]
    if (clickedButton === openedRef.current) {
      openedRef.current = null
      return
    }
    if (Boolean(openedRef.current?.getAttribute('data-value'))) {
      openedRef.current?.click()
    }
    openedRef.current = clickedButton
  }

  const getUserName = item => {
    let user = ''
    switch (item.action_type) {
      case 'AuctionStarted':
      case 'AuctionCancelled':
      case 'ListingAdded':
      case 'ListingCancelled':
        user = getOwnerName(item)
        break
      case 'OfferMade':
      case 'OfferCancelled':
      case 'QuickBuy':
      case 'AuctionWon':
      case 'BidPlaced':
        user = getBuyerName(item)
        break
    }
    return user
  }

  const getActionType = item => {
    let type = ''
    switch (item.action_type) {
      case 'AuctionStarted':
        type = 'published an auction'
        break
      case 'AuctionCancelled':
        type = 'canceled an auction'
        break
      case 'ListingAdded':
        type = 'listed'
        break
      case 'ListingCancelled':
        type = 'canceled listing'
        break
      case 'OfferMade':
        type = 'made an offer'
        break
      case 'OfferCancelled':
        type = 'canceled an offer'
        break
      case 'QuickBuy':
        type = 'purchased'
        break
      case 'AuctionWon':
        type = 'won an auction'
        break
      case 'BidPlaced':
        type = 'placed a bid'
        break
    }
    return type
  }

  return (
    <div className="w-full flex flex-wrap gap-[10px]">
      {data.map((item, index) => (
        <div key={index} className="w-full flex flex-wrap">
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button
                  className={open ? styles.activeButton : styles.button}
                  data-value={open}
                  ref={ref => {
                    buttonRefs.current[index] = ref
                  }}
                  onClick={() => clickRecent(index)}
                >
                  <div className="flex items-center gap-x-4">
                    <div className={styles.imageContainer}>
                      <img src={item.asset_url} alt="" className="w-full h-full rounded-[4px] object-cover" />
                    </div>
                    <div className="block">
                      <div className={styles.subTitle}>{item.asset_name}</div>
                      <div className={styles.subType}>{item.action_type.replace(/([A-Z])/g, ' $1').trim()}</div>
                    </div>
                  </div>
                  <DownArrowIcon className={`${open ? 'rotate-180 transform' : ''} mt-1 mr-1`} />
                </Disclosure.Button>
                <Disclosure.Panel className={styles.panel}>
                  <div className={styles.firstRow}>
                    <div>
                      <div className="flex gap-[4px] mb-[5px]">
                        <div className={styles.title}>{getDisplayUserName(getUserName(item))}</div>
                        <div className={styles.text}>{getActionType(item)}</div>
                      </div>
                      <div className={styles.date}>{getLocalDate(item.created_at)}</div>
                    </div>
                    {isAmountExisting(item.action_type) && (
                      <div>
                        <div className="flex justify-center items-center gap-[5px] mb-[3px]">
                          <SolanaLogoIcon />
                          <div className={styles.text}>{parseFloat(item.amount).toFixed(2)}</div>
                        </div>
                        <div className={`${styles.date} text-end`}>
                          ${(parseFloat(item.amount) * solToUsdRate).toFixed(2)}
                        </div>
                      </div>
                    )}
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
      ))}
    </div>
  )
}

export default ActivityAccordion
