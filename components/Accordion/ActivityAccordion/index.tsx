import React, { useEffect, useRef, useState } from 'react'

// next components
import Image from 'next/image'

// third party components
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/solid'

// components

// images and icons

// json

// styles
import styles from './index.module.scss'
import { getDateString } from 'utils/strings'

import {
  isSellerExisting,
  isBuyerExisting,
  isAmountExisting,
  isSellerCollection,
  isBuyerCollection,
  isAmountCollection,
} from 'utils/activity.util'

const ActivityAccordion = props => {
  const { data, type } = props

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

  const isVisibleSeller = event => {
    if (type === 'collection') return isSellerCollection(event)

    return isSellerExisting(event)
  }

  const isVisibleBuyer = event => {
    if (type === 'collection') return isBuyerCollection(event)

    return isBuyerExisting(event)
  }

  const isVisibleAmount = event => {
    if (type === 'collection') return isAmountCollection(event)

    return isAmountExisting(event)
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
                    <div className={styles.imageArea}>
                      <img src={item.asset_url} alt="" width={52} height={52} className="rounded-[4px]" />
                    </div>
                    <div className="block">
                      <div className={styles.subTitle}>{item.asset_name}</div>
                      <div className={styles.subType}>{item.action_type.replace(/([A-Z])/g, ' $1').trim()}</div>
                      {/* <div className={styles.subTitle}>{item.name02}</div> */}
                    </div>
                  </div>
                  <ChevronUpIcon
                    className={`${!open ? 'rotate-180 transform' : ''} h-6 w-6`}
                    style={{ color: '#95DBD5' }}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className={styles.panel}>
                  <div className={styles.firstRow}>
                    <div className={styles.title}>Type</div>
                    <div className={styles.text}>{item.action_type.replace(/([A-Z])/g, ' $1').trim()}</div>
                  </div>
                  {/* <div className={styles.secondRow}>
                    <div className={styles.title}>Transaction ID</div>
                    <div className={styles.text}>
                      {item.transactionID.length > 11
                        ? item.transactionID.slice(0, 5) + '...' + item.transactionID.slice(-3)
                        : item.transactionID}
                    </div>
                  </div> */}
                  <div className={styles.firstRow}>
                    <div className={styles.title}>Time</div>
                    <div className={styles.text}>{getDateString(item.created_at)}</div>
                  </div>
                  <div className={styles.secondRow}>
                    <div className={styles.title}>Amount</div>
                    <div className={styles.text}>{isVisibleAmount ? item.amount : 'N/A'}</div>
                  </div>
                  <div className={styles.firstRow}>
                    <div className={styles.title}>Mint Address</div>
                    <div className={styles.text}>
                      {item.mint_address.length > 11
                        ? item.mint_address.slice(0, 5) + '...' + item.mint_address.slice(-3)
                        : item.mint_address}
                    </div>
                  </div>
                  <div className={styles.secondRow}>
                    <div className={styles.title}>Buyer</div>
                    <div className={styles.text}>
                      {isVisibleBuyer(item.auction_type)
                        ? item.reference_address.length > 11
                          ? item.reference_address.slice(0, 5) + '...' + item.reference_address.slice(-3)
                          : item.reference_address
                        : 'N/A'}
                    </div>
                  </div>
                  <div className={styles.firstRow}>
                    <div className={styles.title}>Seller</div>
                    <div className={styles.text}>
                      {isVisibleSeller(item.auction_type)
                        ? item.minter_address.length > 11
                          ? item.minter_address.slice(0, 5) + '...' + item.minter_address.slice(-3)
                          : item.minter_address
                        : 'N/A'}
                    </div>
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
