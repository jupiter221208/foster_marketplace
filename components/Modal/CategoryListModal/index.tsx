import React from 'react'

// custom components
import Checkbox from 'components/Checkbox'
import OutlineButton from 'components/Button/OutlineButton'

// styles
import styles from './index.module.scss'
import IconButtonWithSVG from 'components/Button/IconButtonWithSVG'
import GradientButton from 'components/Button/GradientButton'

const CategoryListModal = props => {
  const { categoryList, onChange, onClick, onClickCancel } = props

  return (
    <div className={styles.menu}>
      <div className={styles.container}>
        <div className="w-full h-[68px] flex justify-between items-center">
          <div>Categories</div>
          {/* <IconButtonWithSVG
            icon={
              <div className="mr-8">
                <svg xmlns="http://www.w3.org/2000/svg" width="17.323" height="17.321" viewBox="0 0 17.323 17.321">
                  <path
                    id="times-7"
                    d="M16.689,14.655l6.2-6.187A1.448,1.448,0,1,0,20.843,6.42l-6.187,6.2L8.469,6.42A1.448,1.448,0,0,0,6.421,8.468l6.2,6.187-6.2,6.187A1.448,1.448,0,1,0,8.469,22.89l6.187-6.2,6.187,6.2a1.448,1.448,0,1,0,2.048-2.048Z"
                    transform="translate(-5.994 -5.996)"
                    fill="var(--filter-close-color)"
                  />
                </svg>
              </div>
            }
            onClick={() => onClick()}
            backgroundColor="transparent"
          /> */}
        </div>
        <div className={styles.content}>
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
