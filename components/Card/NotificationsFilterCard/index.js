import React from 'react'

// components
import NotificationsCheckbox from 'components/Checkbox/NotificationsCheckbox'
import GradientButton from 'components/Button/GradientButton'
import OutlineButton from 'components/Button/OutlineButton'

// styles
import styles from './index.module.scss'

const NotificationsFilterCard = props => {
  const { filterList } = props

  return (
    <div className={styles.container}>
      <div className={styles.blurContainer}>
        <div className="w-full flex flex-wrap gap-6">
          <div className={styles.title}>Filter</div>
          <div className="w-full">
            <NotificationsCheckbox categoryList={filterList} onChange={() => {}} />
          </div>
        </div>
        <div className="w-full flex justify-between gap-[53px]">
          <OutlineButton label="Select All" onClick={() => {}} fullWidth />
          <GradientButton label="Apply" onClick={() => {}} fullWidth />
        </div>
      </div>
    </div>
  )
}

export default NotificationsFilterCard
