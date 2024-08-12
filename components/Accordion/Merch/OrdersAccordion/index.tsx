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
          <div
            className={styles.button}
            onClick={() => {
              router.push(`merch-logs/${item.id}`)
            }}
          >
            <div className="w-full flex items-center justify-between">
              <div className={styles.subTitle}>Order #{item.id}</div>
              <div className={styles.viewDetail}>
                View Details
                <RightIcon />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default OrdersAccordion
