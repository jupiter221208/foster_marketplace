import React, { useEffect, useRef, useState } from 'react'

// next components
import Image from 'next/image'

// third party components
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/solid'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'

// styles
import styles from './index.module.scss'
import { getBuyerName, getLocalDate, getOwnerName } from 'utils/helpers'

const ArtworksAccordion = props => {
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
                      <Image src={item.asset_url} alt="" width={52} height={52} className="rounded-[4px]" />
                    </div>
                    <div className="block">
                      <div className={styles.subTitle}>{item.asset_name}</div>
                      <div className="flex gap-1 mt-1 items-center">
                        <div className={styles.priceText}>Sale Price</div>
                        <Image src={SolanaLogoIcon} width={16} height={16} alt="" />
                        <div className={styles.priceValue}>{item.amount}</div>
                      </div>
                    </div>
                  </div>
                  <ChevronUpIcon
                    className={`${!open ? 'rotate-180 transform' : ''} h-6 w-6`}
                    style={{ color: open ? '#95DBD5' : '#95DBD5' }}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className={styles.panel}>
                  <div className={styles.firstRow}>
                    <div className={styles.title}>Method of Sale</div>
                    <div className={styles.text}>{item.action_type}</div>
                  </div>
                  <div className={styles.secondRow}>
                    <div className={styles.title}>Date</div>
                    <div className={styles.text}>{getLocalDate(item.created_at)}</div>
                  </div>
                  <div className={styles.firstRow}>
                    <div className={styles.title}>Creator</div>
                    <div className={styles.text}>{getOwnerName(item)}</div>
                  </div>
                  <div className={styles.secondRow}>
                    <div className={styles.title}>Collector</div>
                    <div className={styles.text}>{getBuyerName(item)}</div>
                  </div>
                  <div className={styles.firstRow}>
                    <div className={styles.title}>Primary</div>
                    <div className={styles.text}>{item.market}</div>
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

export default ArtworksAccordion
