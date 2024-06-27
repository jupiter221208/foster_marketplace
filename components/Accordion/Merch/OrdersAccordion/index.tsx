import React, { useRef, useState } from 'react'

// images and icons
import RightIcon from 'assets/icons/right-icon-white.svg?component'

// styles
import styles from './index.module.scss'
import { useRouter } from 'next/router'

const OrdersAccordion = props => {
  const { data, type } = props
  const router = useRouter()
  const buttonRefs = useRef<any>([])
  const openedRef = useRef<any | null>(null)

  return (
    <div className="w-full flex flex-wrap mt-[30px]">
      {data.map((item, index) => (
        <div key={index} className="w-full flex flex-wrap mt-[-2px]">
          <div className={styles.button}>
            <div className="w-full flex items-center justify-between">
              <div className={styles.subTitle}>Order #{item.id}</div>
              <div
                className={styles.viewDetail}
                onClick={() => {
                  router.push(`merch-logs/${item.id}`)
                }}
              >
                View Details
                <RightIcon />
              </div>
            </div>
          </div>
          {/* <Disclosure>
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
                      <div className={styles.subTitle}>Order #{item.id}</div>
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
                  <div className={styles.secondRow}>
                    <div className={styles.title}>{type === 'purchases' ? 'Creator' : 'Buyer'}</div>
                    <div className={styles.text}>{getSliceAddress(item.creator)}</div>
                  </div>
                  <div className={styles.thirdRow}>
                    <OutlineButton
                      width={300}
                      label="View Order"
                      onClick={() => {
                        router.push(`merch-logs/${item.id}`)
                      }}
                    />
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure> */}
        </div>
      ))}
    </div>
  )
}

export default OrdersAccordion
