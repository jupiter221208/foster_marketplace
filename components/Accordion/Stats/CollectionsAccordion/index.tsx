import React, { useEffect, useRef, useState } from 'react'

// next components
import Image from 'next/image'

// third party components
import { Disclosure } from '@headlessui/react'

// functions
import { getPercentValue } from 'utils/strings'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo-dark-small.svg?component'
import DownArrowIcon from 'assets/icons/down-arrow-icon.svg?component'

// styles
import styles from './index.module.scss'

const CollectionsAccordion = props => {
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
                      <Image src={item.cover_image} alt="" width={52} height={52} className="rounded-[4px]" />
                    </div>
                    <div className="block">
                      <div className={styles.subTitle}>{item.collection_name}</div>
                      <div className="flex gap-1 mt-1 items-center">
                        <div className={styles.priceText}>Total Sales</div>
                        <div className="mt-[2px]">
                          <SolanaLogoIcon alt="" />
                        </div>
                        <div className={styles.priceValue}> {item.total_sales.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                  <DownArrowIcon className={`${open ? 'rotate-180 transform' : ''} mt-1 mr-1`} />
                </Disclosure.Button>
                <Disclosure.Panel className={styles.panel}>
                  <div className={styles.firstRow}>
                    <div className={styles.title}>Total Sales</div>
                    <div className={styles.text}>
                      <div className="flex items-center gap-[10px]">
                        <SolanaLogoIcon alt="" />
                        {item.total_sales.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className={styles.secondRow}>
                    <div className={styles.title}>Floor Price</div>
                    <div className={styles.text}>
                      <div className="flex items-center gap-[10px]">
                        <SolanaLogoIcon alt="" />
                        {item.floor_price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className={styles.firstRow}>
                    <div className={styles.title}>Average Price</div>
                    <div className={styles.text}>
                      <div className="flex items-center gap-[10px]">
                        <SolanaLogoIcon alt="" />
                        {item.average_sale.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className={styles.secondRow}>
                    <div className={styles.title}>Highest Sale</div>
                    <div className={styles.text}>
                      <div className="flex items-center gap-[10px]">
                        <SolanaLogoIcon alt="" />
                        {item.highest_sale.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className={styles.firstRow}>
                    <div className={styles.title}>Collectors</div>
                    <div className={styles.text}>{item.unique_holders}</div>
                  </div>
                  <div className={styles.secondRow}>
                    <div className={styles.title}>NFTs Sold</div>
                    <div className={styles.text}>{item.creator_username}</div>
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

export default CollectionsAccordion
