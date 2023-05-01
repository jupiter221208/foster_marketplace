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
import { getDateString } from 'utils/strings'

import { isBuyerExisting, isAmountExisting } from 'utils/activity.util'
import { getBuyerName, getOwnerName } from 'utils/helpers'

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
                    <div className={styles.title}>Time</div>
                    <div className={styles.text}>{getDateString(item.created_at)}</div>
                  </div>
                  <div className={styles.secondRow}>
                    <div className={styles.title}>Amount</div>
                    <div className="flex gap-[4px]">
                      <SolanaLogoIcon alt="" />
                      <div className={styles.text}>{isAmountExisting ? parseFloat(item.amount).toFixed(2) : 'N/A'}</div>
                    </div>
                  </div>
                  <div className={styles.firstRow}>
                    <div className={styles.title}>Buyer</div>
                    <div className={styles.text}>{isBuyerExisting(item.action_type) ? getBuyerName(item) : 'N/A'}</div>
                  </div>
                  <div className={styles.secondRow}>
                    <div className={styles.title}>Seller</div>
                    <div className={styles.text}>{getOwnerName(item)}</div>
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
