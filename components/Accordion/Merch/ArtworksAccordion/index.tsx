import React, { useRef, useState } from 'react'

// next components
import Link from 'next/link'

// third party components
import { Disclosure } from '@headlessui/react'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo-dark-small.svg?component'
import DownArrowIcon from 'assets/icons/down-arrow-icon.svg?component'

// styles
import styles from './index.module.scss'
import { getSliceAddress } from 'utils/helpers'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { useSolToUsdRate } from 'hooks/useSolToUsdRate'
import OutlineButton from 'components/Button/OutlineButton'
import { getExplorerUrl } from 'utils/explorer'
import { useConnection } from '@solana/wallet-adapter-react'

const OrdersAccordion = props => {
  const { data, type } = props
  const { solToUsdRate } = useSolToUsdRate()
  const dispatch = useDispatch()
  const router = useRouter()
  const buttonRefs = useRef<any>([])
  const openedRef = useRef<any | null>(null)
  const { connection } = useConnection()

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
                    <div className="block">
                      <div className={styles.subTitle}>{item.id}</div>
                      <div className="flex gap-1 mt-1 items-center">
                        <SolanaLogoIcon alt="" />
                        <div className={styles.priceValue}>{(item.amount / solToUsdRate).toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                  <DownArrowIcon className={`${open ? 'rotate-180 transform' : ''} mt-1 mr-1`} />
                </Disclosure.Button>
                <Disclosure.Panel className={styles.panel}>
                  <div className={styles.firstRow}>
                    <div className={styles.title}>Transaction ID</div>
                    <div
                      className={styles.text}
                      onClick={() => window.open(getExplorerUrl(connection.rpcEndpoint, item.transaction_id, 'tx'))}
                    >
                      {getSliceAddress(item.transaction_id)}
                    </div>
                  </div>
                  {/* <div className={styles.secondRow}>
                    <div className={styles.secondTitle}>Date</div>
                    <div className={styles.secondText}>{'08/16/2023'}</div>
                  </div> */}
                  <div className={styles.secondRow}>
                    <div className={styles.title}>{type === 'purchases' ? 'Creator' : 'Buyer'}</div>
                    <div className={styles.text}>{getSliceAddress(item.buyer_address)}</div>
                  </div>
                  <div className={styles.thirdRow}>
                    <OutlineButton
                      width={335}
                      label="View Order"
                      onClick={() => {
                        router.push(`merch-logs/${item.id}`)
                        dispatch({ type: 'set', isLoading: true })
                      }}
                    />
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

export default OrdersAccordion
