import React from 'react'

// next components

// images and icons
import RightArrowIcon from 'assets/icons/right-icon.svg?component'

// styles
import styles from './index.module.scss'
import { getLocalDateWithoutTime } from 'utils/helpers'

const LandingAccordion = props => {
  const { data, onDetail } = props
  return (
    <div className="w-full flex flex-wrap gap-[10px]">
      {data.map((item, index) => (
        <div key={index} className="w-full flex flex-wrap">
          <div className={styles.button}>
            <div className={styles.top}>
              <div className={styles.orderNumber}>01</div>
              <div className={styles.proposal}>{item.title}</div>
            </div>
            <div className="w-full p-[15px]">
              <div className="w-full flex justify-between">
                <div className={styles.label}>Author</div>
                <div className={styles.label}>Submission Date</div>
              </div>
              <div className="w-full flex justify-between mt-[6px]">
                <div className={styles.value}>{item.author}</div>
                <div className={styles.value}>{getLocalDateWithoutTime(item.vote_start)}</div>
              </div>
              <div className="mt-[14px]">
                <div className={styles.label}>Status</div>
              </div>
              <div className="w-full flex justify-between mt-[5px]">
                <div>
                  {item.status === 'pending' ? (
                    <div className={styles.pending}>Pending</div>
                  ) : item.status === 'closed' ? (
                    <div className={styles.closed}>Closed</div>
                  ) : item.status === 'live' ? (
                    <div className={styles.live}>Live</div>
                  ) : (
                    <div></div>
                  )}
                </div>
                <div className={styles.view} onClick={() => onDetail(item)}>
                  View
                  <RightArrowIcon />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default LandingAccordion
