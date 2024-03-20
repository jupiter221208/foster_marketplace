import React, { useRef, useState } from 'react'

// next components
import Link from 'next/link'

// third party components
import { Disclosure } from '@headlessui/react'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo-dark-small.svg?component'
import DownArrowIcon from 'assets/icons/down-arrow-icon.svg?component'

// styles
import styles from './index.module.scss'
import { getSliceAddress } from 'utils/helpers'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { useSolToUsdRate } from 'hooks/useSolToUsdRate'
import OutlineButton from 'components/Button/OutlineButton'
import { getExplorerUrl } from 'utils/explorer'
import { useConnection } from '@solana/wallet-adapter-react'
import GradientButton from 'components/Button/GradientButton'

const ProvenanceAccordion = props => {
  const { data } = props
  const dispatch = useDispatch()
  const router = useRouter()
  const buttonRefs = useRef<any>([])
  const openedRef = useRef<any | null>(null)

  const clickRecent = index => {
    const clickedButton = buttonRefs.current[index]
    if (clickedButton === openedRef.current) {
      openedRef.current = null
      return
    }
    if (Boolean(openedRef.current?.getAttribute('data-value'))) {
      openedRef.current?.click()
    }
    openedRef.current = clickedButton
  }

  return (
    <div className="w-full flex flex-wrap gap-[10px]">
      {data.map((item, index) => (
        <div key={index} className="w-full flex flex-wrap">
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button
                  className={styles.button}
                  data-value={open}
                  ref={ref => {
                    buttonRefs.current[index] = ref
                  }}
                  onClick={() => clickRecent(index)}
                >
                  <div className="w-full flex justify-between gap-x-4">
                    <div className="text-start">
                      <div className={styles.title}>Edition #{item.id}</div>
                      <div className={styles.availability}>{item.availability}</div>
                    </div>
                    <div>
                      <GradientButton
                        label="Quick Buy"
                        onClick={() => router.push(`/nft/${item.address}`)}
                        gradientDirection="right"
                        width="124px"
                        height="45px"
                      />
                    </div>
                  </div>
                </Disclosure.Button>
              </>
            )}
          </Disclosure>
        </div>
      ))}
    </div>
  )
}

export default ProvenanceAccordion
