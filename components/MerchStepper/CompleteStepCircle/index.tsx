import React from 'react'

// custom functions
import { useViewport } from 'utils'

// images and icons
import CompleteStepGreenIcon from 'assets/icons/complete-step-green.svg?component'
import CompleteStepGreenMobileIcon from 'assets/icons/complete-step-green-mobile.svg?component'

const CompleteStepCirce = () => {
  const viewport = useViewport()

  return (
    <div className="w-[32px] lg:w-[48px] h-[32px] lg:h-[48px]">
      {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
        <CompleteStepGreenMobileIcon />
      ) : (
        <CompleteStepGreenIcon />
      )}
    </div>
  )
}

export default CompleteStepCirce
