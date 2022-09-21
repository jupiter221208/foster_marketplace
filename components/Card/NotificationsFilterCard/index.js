import React, { useEffect, useState } from 'react'

// components
import NotificationsCheckbox from 'components/Checkbox/NotificationsCheckbox'
import GradientButton from 'components/Button/GradientButton'
import OutlineButton from 'components/Button/OutlineButton'

// styles
import styles from './index.module.scss'

const NotificationsFilterCard = props => {
  const { filterList, onChange, onClickSelectAll, onClickApply } = props

  const [status, setStatus] = useState('selectAll')

  useEffect(() => {
    let count = 0
    filterList.forEach(item => {
      if (item.checked === true) {
        count++
      }
    })
    if (count === filterList.length) {
      setStatus('Unselect All')
    } else {
      setStatus('Select All')
    }
  }, [filterList])

  return (
    <div className={styles.container}>
      <div className={styles.blurContainer}>
        <div className="w-full flex flex-wrap gap-6">
          <div className={styles.title}>Filter</div>
          <div className="w-full">
            <NotificationsCheckbox categoryList={filterList} onChange={index => onChange(index)} />
          </div>
        </div>
        <div className="w-full flex justify-between gap-[53px]">
          <OutlineButton
            label={status}
            onClick={() => onClickSelectAll(status)}
            color="#EFF0F6"
            borderWidth={2}
            borderColor="#5AC3BA"
            fullWidth
          />
          <GradientButton label="Apply" onClick={() => onClickApply()} fullWidth />
        </div>
      </div>
    </div>
  )
}

export default NotificationsFilterCard
