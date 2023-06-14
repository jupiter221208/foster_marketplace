import React, { useState, useEffect } from 'react'

// next components
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

// components

// custom functions
import { useViewport } from 'utils'

// json

// images
import SolanaLogoIcon from 'assets/icons/solana-logo-dark.svg?component'
import ArrowLeftIcon from 'assets/icons/arrow-left-medium.svg?component'

// styles
import styles from './index.module.scss'
import SecondaryButton from 'components/Button/SecondaryButton'

// api

const PhysicalShipping = props => {
  const { image, onBack, onPrint, onShipping, previewMode } = props
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()
  const [enabled, setEnabled] = useState(false)

  return (
    <section className={styles.container}>
      <div className="flex gap-[15px] mt-[20px] items-center">
        <div className={styles.backBG} onClick={onBack}>
          <ArrowLeftIcon alt="" />
        </div>
        <div className={styles.selecteCategory}>Add Shipping Details</div>
      </div>

      <div className="w-full mt-[50px] flex gap-[30px]">
        <SecondaryButton
          backgroundColor="transparent"
          label="Generate Preview"
          fullWidth
          height="53px"
          fontSize="18px"
          color={enabled ? '#eff0f6' : '#818181'}
          borderColor={'#202427'}
          onClick={() => {}}
        />
      </div>
    </section>
  )
}

export default PhysicalShipping
