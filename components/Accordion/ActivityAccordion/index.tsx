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

const ActivityAccordion = props => {
  const { data } = props

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
                    <div className={open ? styles.activeImageArea : styles.imageArea}>
                      <Image src={item.avatar} alt="" width={52} height={52} className="rounded-[4px]" />
                    </div>
                    <div className="block">
                      <div className={styles.subTitle}>{item.name01}</div>
                      <div className={styles.subTitle}>{item.name02}</div>
                    </div>
                  </div>
                  <ChevronUpIcon
                    className={`${!open ? 'rotate-180 transform' : ''} h-6 w-6`}
                    style={{ color: open ? '#5AC3BA' : '#378287' }}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className={styles.panel}>
                  <div className={styles.firstRow}>
                    <div className={styles.title}>Type</div>
                    <div className={styles.text}>{item.type}</div>
                  </div>
                  <div className={styles.secondRow}>
                    <div className={styles.title}>Transaction ID</div>
                    <div className={styles.text}>
                      {item.transactionID.length > 11
                        ? item.transactionID.slice(0, 5) + '...' + item.transactionID.slice(-3)
                        : item.transactionID}
                    </div>
                  </div>
                  <div className={styles.firstRow}>
                    <div className={styles.title}>Time</div>
                    <div className={styles.text}>{item.time}</div>
                  </div>
                  <div className={styles.secondRow}>
                    <div className={styles.title}>Amount</div>
                    <div className={styles.text}>{item.amount}</div>
                  </div>
                  <div className={styles.firstRow}>
                    <div className={styles.title}>Mint Address</div>
                    <div className={styles.text}>
                      {item.mintAddress.length > 11
                        ? item.mintAddress.slice(0, 5) + '...' + item.mintAddress.slice(-3)
                        : item.mintAddress}
                    </div>
                  </div>
                  <div className={styles.secondRow}>
                    <div className={styles.title}>Buyer</div>
                    <div className={styles.text}>
                      {item.buyer.length > 11 ? item.buyer.slice(0, 5) + '...' + item.buyer.slice(-3) : item.buyer}
                    </div>
                  </div>
                  <div className={styles.firstRow}>
                    <div className={styles.title}>Seller</div>
                    <div className={styles.text}>
                      {item.seller.length > 11 ? item.seller.slice(0, 5) + '...' + item.seller.slice(-3) : item.seller}
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
