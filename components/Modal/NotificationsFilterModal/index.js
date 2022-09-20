import React, { useEffect, useState } from 'react'

// next components
import Image from 'next/image'

// custom components
import Checkbox from 'components/Checkbox'
import OutlineButton from 'components/Button/OutlineButton'
import GradientButton from 'components/Button/GradientButton'

// images and icons
import CloseWhiteIcon from 'assets/icons/close-white.svg'

// styles
import styles from './index.module.scss'

const NotificationsFilterModal = props => {
  const { filterList, onChange, onClickSelectAll, onClickApply } = props

  const [status, setStatus] = useState('selectAll')

  useEffect(() => {
    let count = 0
    filterList.map(item => {
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
      <div className={styles.content}>
        <div className="w-full h-[68px] flex justify-between items-center mb-[17px]">
          <div className={styles.title}>Filter</div>
          <Image src={CloseWhiteIcon} alt="" className="cursor-pointer" onClick={() => onClickApply()} />
        </div>
        <Checkbox categoryList={filterList} onChange={index => onChange(index)} direction="rtl" />
      </div>
      <div className={styles.bottomArea}>
        <div className="w-[94px]">
          <OutlineButton
            label={status}
            onClick={() => onClickSelectAll(status)}
            color="#EFF0F6"
            borderWidth={2}
            borderColor="#5AC3BA"
            fullWidth
          />
        </div>
        <div className="w-[94px]">
          <GradientButton label="Apply" onClick={() => onClickApply()} color="#202427" fullWidth />
        </div>
      </div>
    </div>
  )
}

export default NotificationsFilterModal
