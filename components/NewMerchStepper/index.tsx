import React from 'react'

// styles
import styles from './index.module.scss'

const NewMerchStepper = props => {
  const { currentStep } = props

  return (
    <div className="w-full flex h-[66px] lg:h-[95px] flex-col justify-between">
      <div className={styles.container}>
        <div className="relative h-[40px] lg:h-[30px] flex items-center">
          <div className={`${styles.greenText} absolute top-[25px] lg:top-[50px] -left-6 -right-16`}>
            Product&nbsp;&&nbsp;Design
          </div>
        </div>

        <div className={currentStep === 1 ? styles.grayLine : styles.greenLine} />

        <div className="relative h-[40px] lg:h-[30px] flex items-center">
          <div
            className={`${
              currentStep < 2 ? styles.grayText : styles.greenText
            } absolute top-[52px] lg:top-[50px] -left-16 -right-16`}
          >
            Commissions
          </div>
        </div>

        <div className={currentStep < 3 ? styles.grayLine : styles.greenLine} />

        <div className="relative h-[40px] lg:h-[30px] flex items-center">
          <div
            className={`${
              currentStep < 3 ? styles.grayText : styles.greenText
            } absolute top-[52px] lg:top-[50px] -left-16 -right-16`}
          >
            Preview
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewMerchStepper
