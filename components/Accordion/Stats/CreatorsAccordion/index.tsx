import React, { useRef } from 'react'

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
import { useRouter } from 'next/router'
import ImageWithFallback from 'components/ImageWithFallback'

const CreatorsAccordion = props => {
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
                    <div className={styles.imageArea}>
                      <ImageWithFallback
                        src={item.pfp_url !== null && item.pfp_url !== '' ? item.pfp_url : DefaultAvatar}
                        alt=""
                        width={36}
                        height={36}
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div className="block">
                      <div
                        className={styles.subTitle}
                        onClick={() => router.push(`/${item.creator_name.replaceAll(' ', '%20')}`)}
                      >
                        {item.creator_name}
                      </div>
                      <div className="flex gap-2 mt-1 items-center">
                        <div className={styles.priceText}>Total Sales</div>
                        <div className="flex items-center gap-[4px]">
                          <SolanaLogoIcon alt="" />
                          <div className={styles.priceValue}>{parseFloat(item.total_sales).toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DownArrowIcon className={`${open ? 'rotate-180 transform' : ''} mt-1 mr-1`} />
                </Disclosure.Button>
                <Disclosure.Panel className={styles.panel}>
                  <div className={styles.firstRow}>
                    <div className={styles.title}>Unique Collectors</div>
                    <div className={styles.text}>{item.unique_collectors}</div>
                  </div>
                  <div className={styles.secondRow}>
                    <div className={styles.title}>Total Sales</div>
                    <div className={styles.text}>
                      <div className="flex items-center gap-[4px]">
                        <SolanaLogoIcon alt="" />
                        {parseFloat(item.total_sales).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className={styles.firstRow}>
                    <div className={styles.title}>Highest Sale</div>
                    <div className={styles.text}>
                      <div className="flex items-center gap-[4px]">
                        <SolanaLogoIcon alt="" />
                        {parseFloat(item.highest_sale).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className={styles.secondRow}>
                    <div className={styles.title}>Collections</div>
                    <div className={styles.text}>{item.collection_published}</div>
                  </div>
                  <div className={styles.firstRow}>
                    <div className={styles.title}>Created</div>
                    <div className={styles.text}>{item.items_created}</div>
                  </div>
                  <div className={styles.secondRow}>
                    <div className={styles.title}>Sold</div>
                    <div className={styles.text}>{item.items_sold}</div>
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

export default CreatorsAccordion
