import React, { useRef, useState } from 'react'
import { useRouter } from 'next/router'

// next components
import Image from 'next/image'
import ReactPlaceholder from 'react-placeholder'
import 'react-placeholder/lib/reactPlaceholder.css'

// third party components
import { Disclosure } from '@headlessui/react'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo-dark-small.svg?component'
import DownArrowIcon from 'assets/icons/down-arrow-icon.svg?component'

// styles
import styles from './index.module.scss'
import ImageWithFallback from 'components/ImageWithFallback'

const CollectionsAccordion = props => {
  const { data } = props
  const router = useRouter()

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
                      <ImageWithFallback
                        src={item.cover_image}
                        alt=""
                        width={52}
                        height={52}
                        className="rounded-[4px] object-cover"
                      />
                    </div>
                    <div className="block">
                      <div
                        className={styles.subTitle}
                        onClick={() => router.push(`/collection/${item.collection_address}`)}
                      >
                        {item.collection_name}
                      </div>
                      <div className="flex gap-1 mt-1 items-center">
                        <div className={styles.priceText}>Total Sales</div>
                        <div className="mt-[2px]">
                          <SolanaLogoIcon alt="" />
                        </div>
                        <div className={styles.priceValue}> {parseFloat(item.total_sales).toFixed(2)}</div>
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
                        {item.floor_price?.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className={styles.firstRow}>
                    <div className={styles.title}>Average Sale</div>
                    <div className={styles.text}>
                      <div className="flex items-center gap-[10px]">
                        <SolanaLogoIcon alt="" />
                        {item.average_sale?.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className={styles.secondRow}>
                    <div className={styles.title}>Highest Sale</div>
                    <div className={styles.text}>
                      <div className="flex items-center gap-[10px]">
                        <SolanaLogoIcon alt="" />
                        {item.highest_sale?.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className={styles.firstRow}>
                    <div className={styles.title}>Collectors</div>
                    <div className={styles.text}>{item.unique_holders}</div>
                  </div>
                  <div className={styles.secondRow}>
                    <div className={styles.title}>Creator</div>
                    <div
                      className={styles.text}
                      onClick={() => {
                        router.push(`/${item.creator_username}`)
                      }}
                    >
                      {item.creator_username}
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

export default CollectionsAccordion
