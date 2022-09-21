import React from 'react'

// next components
import Image from 'next/image'

// images and icons
import CompleteStepGreenIcon from 'assets/icons/complete-step-green.svg'

const CompleteStepCirce = props => {
  const { viewport } = props

  return (
    <Image
      src={CompleteStepGreenIcon}
      width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 32 : 48}
      height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 32 : 48}
      alt=""
    />
  )
}

export default CompleteStepCirce
