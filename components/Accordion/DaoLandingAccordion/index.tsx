import React from 'react'

// next components

// images and icons
import RightArrowIcon from 'assets/icons/right-icon.svg?component'

// styles
import styles from './index.module.scss'

const DaoLandingAccordion = props => {
  const { data } = props

  return (
    <div className="w-full flex flex-wrap gap-[10px]">
      {data.map((item, index) => (
        <div key={index} className="w-full flex flex-wrap">
          <div className={styles.button}>
            <div className={styles.proposal}>{item.proposal}</div>
            <div className="w-full flex justify-between mt-[15px]">
              <div className={styles.liveBtn}>Live</div>
              <div className={styles.view}>
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
