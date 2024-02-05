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
    <div className="w-full flex h-[66px] lg:h-[95px] flex-col justify-between">
      <div className={styles.container}>
        <div className="relative h-[40px] lg:h-[30px] flex items-center">
          {/* {currentStep === 1 ? <CurrentStepCircle step={1} /> : <CompleteStepCirce />} */}
          <div className={`${styles.greenText} absolute top-[25px] lg:top-[50px] -left-6 -right-16`}>Upload file</div>
        </div>

        <div className={currentStep === 1 ? styles.grayLine : styles.greenLine} />

        <div className="relative h-[40px] lg:h-[30px] flex items-center">
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
            } absolute top-[52px] lg:top-[50px] -left-16 -right-16`}
          >
            Add details
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
            } absolute top-[52px] lg:top-[50px] -left-16 -right-16`}
          >
            Mint
          </div>
        </div>
      </div>
    </div>
  )
}

export default Stepper
