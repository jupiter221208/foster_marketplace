import React, { useEffect, useRef, useState } from 'react'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'

// third party components
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/solid'

// functions
import { getPercentValue } from 'utils/strings'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'

// styles
import styles from './index.module.scss'
import { Router } from 'next/router'

const MarketplacesAccordion = props => {
  const { data } = props
  const router = useRouter()

  const buttonRefs = useRef([])
  const openedRef = useRef(null)
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
                      <Image src={item.category[0].icon} alt="" width={52} height={52} className="rounded-[4px]" />
                    </div>
                    <div className="block text-left">
                      <div className={styles.subTitle}>{item.category[0].name}</div>
                      <div className={`${styles.greenText} mt-1`}>{getPercentValue(item.volume)}</div>
                    </div>
                  </div>
                  {!open && (
                    <ChevronUpIcon
                      className={`${!open ? 'rotate-180 transform' : ''} h-6 w-6`}
                      style={{ color: open ? '#5AC3BA' : '#378287' }}
                    />
                  )}
                  {open && (
                    <div className={styles.brand01Text} onClick={() => router.push(`/stats/view-chart?id=${item.id}`)}>
                      View Chart
                    </div>
                  )}
                </Disclosure.Button>
                <Disclosure.Panel className={styles.panel}>
                  <div className={styles.firstRow}>
                    <div className={styles.title}>Total Volume</div>
                    <div className={styles.text}>
                      <div className="flex items-center gap-[10px]">
                        <Image src={SolanaLogoIcon} width={20} height={20} alt="" />
                        {item.totalVolume}
                      </div>
                    </div>
                  </div>
                  <div className={styles.secondRow}>
                    <div className={styles.title}>Transactions</div>
                    <div className={styles.text}>{item.transactions}</div>
                  </div>
                  <div className={styles.firstRow}>
                    <div className={styles.title}>Active Listings</div>
                    <div className={styles.text}>{item.activeListings}</div>
                  </div>
                  <div className={styles.secondRow}>
                    <div className={styles.title}>Single Mints</div>
                    <div className={styles.text}>{item.singleMints}</div>
                  </div>
                  <div className={styles.firstRow}>
                    <div className={styles.title}>Collections</div>
                    <div className={styles.text}>{item.collections}</div>
                  </div>
                  <div className={styles.secondRow}>
                    <div className={styles.title}>Primary</div>
                    <div className={styles.text}>{item.creators}</div>
                  </div>
                  <div className={styles.firstRow}>
                    <div className={styles.title}>Secondary</div>
                    <div className={styles.text}>{item.collectors}</div>
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

export default MarketplacesAccordion
