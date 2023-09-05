import React, { useRef, useState } from 'react'

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
import { getBuyerName, getFirstUpperString, getLocalDate, getOwnerName } from 'utils/helpers'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import ImageWithFallback from 'components/ImageWithFallback'

const ArtworksAccordion = props => {
  const { data } = props
  const dispatch = useDispatch()
  const router = useRouter()
  const buttonRefs = useRef<any>([])
  const openedRef = useRef<any | null>(null)
  const [loaded, setLoaded] = useState(false)

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

  const gotoUserDetail = link => {
    dispatch({ type: 'set', isLoading: true })
    router.push(`/${link}`)
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
                      <ImageWithFallback src={item.asset_url} alt="" width={52} height={52} className="rounded-[4px]" />
                    </div>
                    <div className="block">
                      <div className={styles.subTitle} onClick={() => router.push(`/nft/${item.mint_address}`)}>
                        {item.asset_name}
                      </div>
                      <div className="flex gap-1 mt-1 items-center">
                        <SolanaLogoIcon alt="" />
                        <div className={styles.priceValue}>{item.amount}</div>
                      </div>
                    </div>
                  </div>
                  <DownArrowIcon className={`${open ? 'rotate-180 transform' : ''} mt-1 mr-1`} />
                </Disclosure.Button>
                <Disclosure.Panel className={styles.panel}>
                  <div className={styles.firstRow}>
                    <div className={styles.title}>Method of Sale</div>
                    <div className={styles.text}>{item.action_type.replace(/([A-Z])/g, ' $1').trim()}</div>
                  </div>
                  <div className={styles.secondRow}>
                    <div className={styles.secondTitle}>Date</div>
                    <div className={styles.secondText}>{getLocalDate(item.created_at)}</div>
                  </div>
                  <div className={styles.firstRow}>
                    <div className={styles.title}>Seller</div>
                    <div className={styles.text} onClick={() => gotoUserDetail(getOwnerName(item))}>
                      {getOwnerName(item)}
                    </div>
                  </div>
                  <div className={styles.secondRow}>
                    <div className={styles.secondTitle}>Buyer</div>
                    <div className={styles.secondText} onClick={() => gotoUserDetail(getBuyerName(item))}>
                      {getBuyerName(item)}
                    </div>
                  </div>
                  <div className={styles.firstRow}>
                    <div className={styles.title}>Market</div>
                    <div className={styles.text}>{getFirstUpperString(item.market)}</div>
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
