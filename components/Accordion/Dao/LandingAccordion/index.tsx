import React from 'react'

// next components

// images and icons
import RightArrowIcon from 'assets/icons/right-icon.svg?component'

// styles
import styles from './index.module.scss'
import DaoPendingButton from 'components/Table/Dao/LandingTable/DaoPendingButton'
import DaoClosedButton from 'components/Table/Dao/LandingTable/DaoClosedButton'
import DaoLiveButton from 'components/Table/Dao/LandingTable/DaoLiveButton'

const LandingAccordion = props => {
  const { data, onDetail } = props

  return (
    <div className="w-full flex flex-wrap gap-[10px]">
      {data.map((item, index) => (
        <div key={index} className="w-full flex flex-wrap">
          <div className={styles.button}>
            <div className={styles.proposal}>{item.title}</div>
            <div className="w-full flex justify-between mt-[15px]">
              {/* <div className={styles.liveBtn}>Live</div> */}
              <div className="flex justify-center">
                {item.status === 'pending' ? (
                  <DaoPendingButton label="Pending" onDetail={() => onDetail(item)} />
                ) : item.status === 'closed' ? (
                  <DaoClosedButton label="Closed" onDetail={() => onDetail(item)} />
                ) : (
                  <DaoLiveButton
                    label={item.status === 'closed' ? 'Closed' : item.status === 'pending' ? 'Pending' : 'Live'}
                    onDetail={() => onDetail(item)}
                  />
                )}
              </div>
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

export default LandingAccordion
