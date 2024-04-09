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
        <div className="relative h-[40px] lg:h-[45px] flex items-center">
          {/* {currentStep === 1 ? <CurrentStepCircle step={1} /> : <CompleteStepCirce />} */}
          <div className={`${styles.greenText} absolute top-[25px] lg:top-[60px] -left-6 -right-16`}>
            Artwork&nbsp;Details
          </div>
        </div>

        <div className={currentStep === 1 ? styles.grayLine : styles.greenLine} />

        <div className="relative h-[40px] lg:h-[45px] flex items-center">
          {/* {currentStep === 1 ? (
            <NextStepCircle step={2} />
          ) : currentStep === 2 ? (
            <CurrentStepCircle step={2} />
          ) : (
            <CompleteStepCirce />
          )} */}
          <div
            className={`${
              currentStep < 2 ? styles.grayText : styles.greenText
            } absolute top-[52px] lg:top-[60px] -left-16 -right-16`}
          >
            Additional&nbsp;details
          </div>
        </div>

        <div className={currentStep < 3 ? styles.grayLine : styles.greenLine} />

        <div className="relative h-[40px] lg:h-[30px] flex items-center">
          {/* {currentStep === 1 || currentStep === 2 ? (
            <NextStepCircle step={3} />
          ) : currentStep === 3 ? (
            <CurrentStepCircle step={3} />
          ) : (
            <CompleteStepCirce />
          )} */}
          <div
            className={`${
              currentStep < 3 ? styles.grayText : styles.greenText
            } absolute top-[52px] lg:top-[60px] -left-16 -right-16`}
          >
            Review
          </div>
        </div>
      </div>
    </div>
  )
}

export default Stepper
