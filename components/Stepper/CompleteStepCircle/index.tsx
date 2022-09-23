import React from 'react'

// next components
import Image from 'next/image'

// custom functions
import { useViewport } from 'utils'

// images and icons
import CompleteStepGreenIcon from 'assets/icons/complete-step-green.svg'

const CompleteStepCirce = () => {
  const viewport = useViewport()

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
