import React, { useEffect, useRef, useState } from 'react'

// next components
import Image from 'next/image'

// third party components
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/solid'

// functions
import { getPercentValue } from 'utils/strings'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'

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
                      <Image src={item.rankImage} alt="" width={52} height={52} className="rounded-[4px]" />
                    </div>
                    <div className="block">
                      <div className={styles.subTitle}>Collection Name</div>
                      <div className="flex gap-1 mt-1 items-center">
                        <div className={styles.priceText}>Sale Price</div>
                        <Image src={SolanaLogoIcon} width={16} height={16} alt="" />
                        <div className={styles.priceValue}>1200</div>
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
                    <div className={styles.title}>Total Sale</div>
                    <div className={styles.text}>
                      <div className="flex items-center gap-[10px]">
                        <Image src={SolanaLogoIcon} width={20} height={20} alt="" />
                        {item.totalSale.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className={styles.secondRow}>
                    <div className={styles.title}>% Volume</div>
                    <div className={styles.text}>{getPercentValue(item.volume)}</div>
                  </div>
                  <div className={styles.firstRow}>
                    <div className={styles.title}>Floor Price</div>
                    <div className={styles.text}>
                      <div className="flex items-center gap-[10px]">
                        <Image src={SolanaLogoIcon} width={20} height={20} alt="" />
                        {item.floorPrice.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className={styles.secondRow}>
                    <div className={styles.title}>Average Price</div>
                    <div className={styles.text}>
                      <div className="flex items-center gap-[10px]">
                        <Image src={SolanaLogoIcon} width={20} height={20} alt="" />
                        {item.averagePrice.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className={styles.firstRow}>
                    <div className={styles.title}>Highest Sale</div>
                    <div className={styles.text}>
                      <div className="flex items-center gap-[10px]">
                        <Image src={SolanaLogoIcon} width={20} height={20} alt="" />
                        {item.highestSale.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className={styles.secondRow}>
                    <div className={styles.title}>Collectors</div>
                    <div className={styles.text}>{item.collectors}</div>
                  </div>
                  <div className={styles.firstRow}>
                    <div className={styles.title}>NFTs Sold</div>
                    <div className={styles.text}>{item.nftsSold}</div>
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
