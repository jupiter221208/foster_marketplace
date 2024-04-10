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
import MintButton from 'components/Button/MintButton'

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
      ) : currentStep === labels.length ? (
        <MintButton onClick={onNext} disabled={nextDisabled} />
      ) : (
        <NextButton onClick={onNext} disabled={nextDisabled} />
      )}
    </div>
  )
}

export default ProgressSection
