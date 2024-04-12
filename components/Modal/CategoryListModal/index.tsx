import React from 'react'

// custom components
import Checkbox from 'components/Checkbox'
import OutlineButton from 'components/Button/OutlineButton'

// styles
import styles from './index.module.scss'
import GradientButton from 'components/Button/GradientButton'

const CategoryListModal = props => {
  const { categoryList, onChange, onClick, onClickCancel } = props

  return (
    <div className={styles.menu}>
      <div className={styles.container}>
        <div className={`${styles.content} mt-[30px]`}>
          <Checkbox categoryList={categoryList} onChange={index => onChange(index)} direction="rtl" />
        </div>
        <div className={styles.footer}>
          <div className="w-[228px] flex justify-between gap-10">
            <OutlineButton
              borderColor="var(--outline-btn-border)"
              label="Cancel"
              fullWidth
              borderWidth={2}
              onClick={() => onClickCancel()}
              height="40px"
            />
            <GradientButton label="Done" fullWidth onClick={() => onClick()} height="40px" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryListModal
