import React, { useRef } from 'react'

// third party components
import { Disclosure } from '@headlessui/react'

// images and icons
import DownArrowIcon from 'assets/icons/down-arrow-icon.svg?component'

// styles
import styles from './index.module.scss'
import { getFirstUpperString } from 'utils/helpers'

const VoteHistoryAccordion = props => {
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

  const getLocalDate = date => {
    let voteDate = new Date(date)
    let year = voteDate.getFullYear()
    let month = voteDate.getMonth() + 1
    let day = voteDate.getDate()
    return year + '-' + month + '-' + day
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
                      <div className={styles.subTitle}>{item.username}</div>
                      <div className="flex">
                        <div className={styles.priceValue}>{getFirstUpperString(item.vote_status)}</div>
                      </div>
                    </div>
                  </div>
                  <DownArrowIcon className={`${open ? 'rotate-180 transform' : ''} mt-1 mr-1`} />
                </Disclosure.Button>
                <Disclosure.Panel className={styles.panel}>
                  <div className={styles.firstRow}>
                    <div className={styles.title}>Governance Weight</div>
                    <div className={styles.text}>{item.weight} votes</div>
                  </div>
                  <div className={styles.secondRow}>
                    <div className={styles.secondTitle}>Date</div>
                    <div className={styles.secondText}>{getLocalDate(item.created_at)}</div>
                  </div>
                  <div className={styles.firstRow}>
                    <div className={styles.title}>Recorded Vote</div>
                    <div
                      className={styles.text}
                      onClick={() => window.open(`https://explorer.solana.com/tx/${item.signature}`)}
                    >
                      View
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

export default VoteHistoryAccordion
