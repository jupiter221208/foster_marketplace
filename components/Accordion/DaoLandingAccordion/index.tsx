import React from 'react'

// next components

// images and icons
import RightArrowIcon from 'assets/icons/right-icon.svg?component'

// styles
import styles from './index.module.scss'

const DaoLandingAccordion = props => {
  const { data, onDetail } = props

  return (
    <div className="w-full flex flex-wrap gap-[10px]">
      {data.map((item, index) => (
        <div key={index} className="w-full flex flex-wrap">
          <div className={styles.button}>
            <div className={styles.proposal}>{item.title}</div>
            <div className="w-full flex justify-between mt-[15px]">
              <div className={styles.liveBtn}>Live</div>
              <div className={styles.view} onClick={() => onDetail(item)}>
                View
                <RightArrowIcon />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DaoLandingAccordion
