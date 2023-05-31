import React, { useEffect, useRef, useState } from 'react'

// next components
import Image from 'next/image'

// third party components
import { Disclosure } from '@headlessui/react'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo-dark-small.svg?component'
import DownArrowIcon from 'assets/icons/down-arrow-icon.svg?component'
import DefaultAvatar from 'assets/images/dashboard-avatar.png'

// styles
import styles from './index.module.scss'

const CollectorsAccordion = props => {
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
                    <div className={styles.imageArea}>
                      <Image
                        src={item.pfp_url ?? DefaultAvatar}
                        alt=""
                        width={36}
                        height={36}
                        className="rounded-full"
                      />
                    </div>
                    <div className="block">
                      <div className={styles.subTitle}>{item.collector_name}</div>
                      <div className="flex gap-1 mt-1 items-center">
                        <div className={styles.priceText}>Unique Collectors</div>
                        <div className={styles.priceValue}>{item.items_collected}</div>
                      </div>
                    </div>
                  </div>
                  <DownArrowIcon className={`${open ? 'rotate-180 transform' : ''} mt-1 mr-1`} />
                </Disclosure.Button>
                <Disclosure.Panel className={styles.panel}>
                  <div className={styles.secondRow}>
                    <div className={styles.title}>Purchase Volume</div>
                    <div className={styles.text}>
                      <div className="flex items-center gap-[10px]">
                        <SolanaLogoIcon alt="" />
                        {item.purchase_volume}
                      </div>
                    </div>
                  </div>
                  <div className={styles.firstRow}>
                    <div className={styles.title}>Highest Purchase</div>
                    <div className={styles.text}>
                      <div className="flex items-center gap-[10px]">
                        <Image src={SolanaLogoIcon} width={20} height={20} alt="" />
                        {item.highest_purchase}
                      </div>
                    </div>
                  </div>
                  <div className={styles.secondRow}>
                    <div className={styles.title}>Favorite Category</div>
                    <div className={styles.text}>{item.favorite_category}</div>
                  </div>
                  <div className={styles.firstRow}>
                    <div className={styles.title}>Creators Supported</div>
                    <div className={styles.text}>{item.creators_supported}</div>
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

export default CollectorsAccordion
