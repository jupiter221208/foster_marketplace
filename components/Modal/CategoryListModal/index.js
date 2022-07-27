import React from 'react'

// custom components
import Checkbox from 'components/Checkbox'
import IconButton from 'components/Button/IconButton'
import OutlineButton from 'components/Button/OutlineButton'
import Button from 'components/Button'

// images and icons
import CloseWhiteIcon from 'assets/icons/close-white.svg'

// styles
import styles from './index.module.scss'

const CategoryListModal = props => {
  const { categoryList, onChange, onClick, onClickCancel } = props

  return (
    <div className={styles.menu}>
      <div className={styles.container}>
        <div className="w-full h-[68px] flex justify-between items-center">
          <div>Categories</div>
          <IconButton icon={CloseWhiteIcon} onClick={() => onClick()} backgroundColor="transparent" />
        </div>
        <div className={styles.content}>
          <Checkbox categoryList={categoryList} onChange={index => onChange(index)} direction="rtl" />
        </div>
        <div className={styles.footer}>
          <div className="w-[228px] flex justify-between gap-10">
            <OutlineButton label="Cancel" fullWidth onClick={() => onClickCancel()} height="40px" />
            <Button label="Done" fullWidth onClick={() => onClick()} height="40px" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryListModal
