import React from 'react'

// components
import CurrentStepCircle from './CurrentStepCircle'
import CompleteStepCirce from './CompleteStepCircle'
import NextStepCircle from './NextStepCircle'

// styles
import styles from './index.module.scss'

const Stepper = props => {
  const { currentStep } = props

  return (
    <div className="w-full flex h-[66px] lg:h-[65px] flex-col justify-between">
      <div className={styles.container}>
        <div className="relative h-[30px] flex items-center">
          <div
            className={`${styles.greenText} ${
              currentStep === 1 ? styles.boldText : styles.regularText
            } absolute top-[45px] -left-6 -right-16`}
          >
            Artwork&nbsp;Details
          </div>
        </div>

        <div className={currentStep === 1 ? styles.grayLine : styles.greenLine} />

        <div className="relative h-[30px] flex items-center">
          <div
            className={`${currentStep < 2 ? styles.grayText : styles.greenText} ${
              currentStep === 2 ? styles.boldText : styles.regularText
            } absolute top-[45px] -left-16 -right-16`}
          >
            Additional&nbsp;details
          </div>
        </div>

        <div className={currentStep < 3 ? styles.grayLine : styles.greenLine} />

        <div className="relative h-[30px] flex items-center">
          <div
            className={`${currentStep < 3 ? styles.grayText : styles.greenText}  ${
              currentStep === 3 ? styles.boldText : styles.regularText
            } absolute top-[45px] -left-16 -right-16`}
          >
            Review
          </div>
        </div>
      </div>
    </div>
  )
}

export default Stepper
