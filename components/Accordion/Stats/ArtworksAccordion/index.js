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

const ArtworksAccordion = props => {
  const { data } = props

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
                      <Image src={item.rankImage} alt="" width={52} height={52} className="rounded-[4px]" />
                    </div>
                    <div className="block">
                      <div className={styles.subTitle}>{item.artworkName01}</div>
                      <div className={styles.subTitle}>{item.artworkName02}</div>
                    </div>
                  </div>
                  <ChevronUpIcon
                    className={`${!open ? 'rotate-180 transform' : ''} h-6 w-6`}
                    style={{ color: open ? '#5AC3BA' : '#378287' }}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className={styles.panel}>
                  <div className={styles.firstRow}>
                    <div className={styles.title}>Sale Price</div>
                    <div className={styles.text}>
                      <div className="flex items-center gap-[10px]">
                        <Image src={SolanaLogoIcon} width={20} height={20} alt="" />
                        {item.salePrice.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className={styles.secondRow}>
                    <div className={styles.title}>Category</div>
                    <div className={styles.text}>{item.category[0]?.name}</div>
                  </div>
                  <div className={styles.firstRow}>
                    <div className={styles.title}>Views</div>
                    <div className={styles.text}>{item.views}</div>
                  </div>
                  <div className={styles.secondRow}>
                    <div className={styles.title}>Shares</div>
                    <div className={styles.text}>{item.shares}</div>
                  </div>
                  <div className={styles.firstRow}>
                    <div className={styles.title}>Likes</div>
                    <div className={styles.text}>{item.likes}</div>
                  </div>
                  <div className={styles.secondRow}>
                    <div className={styles.title}>Saves</div>
                    <div className={styles.text}>{item.saves}</div>
                  </div>
                  <div className={styles.firstRow}>
                    <div className={styles.title}>Offers</div>
                    <div className={styles.text}>{item.offers}</div>
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
