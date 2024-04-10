import React from 'react'

// next components
import Image from 'next/image'

// assets
import RightArrow from '/assets/icons/arrow-right-black.svg?component'
import RightGrayArrow from '/assets/icons/arrow-right-gray.svg?component'

// styles
import styles from './index.module.scss'
import BackButton from 'components/Button/BackButton'
import Stepper from 'components/Stepper'
import NextButton from 'components/Button/NextButton'
import LoadingButton from 'components/Button/LoadingButton'

const ProgressSection = props => {
  const { onBack, onNext, nextDisabled, currentStep, loading, labels } = props

  return (
    <div className="w-full flex justify-between">
      <BackButton onClick={onBack} />
      <div className="w-[60%]">
        <Stepper currentStep={currentStep} labels={labels} />
      </div>
      {loading ? (
        <LoadingButton width={122} height={53} borderRadius={30} />
      ) : (
        <NextButton onClick={onNext} disabled={nextDisabled} />
      )}
    </div>
  )
}

export default ProgressSection
