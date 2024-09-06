import React, { useState, useEffect } from 'react'

// next components
import Image from 'next/image'

import ImageWithFoster from 'components/ImageWithFoster'

// custom functions
import { useViewport } from 'utils'
import { useRouter } from 'next/router'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useAuthentication } from 'hooks/useAuthentication'

// styles
import styles from './index.module.scss'

// resources
import ArrowIcon from 'assets/icons/arrow-right-13x10.svg?component'

const StudioSeasonCard = ({ data }) => {
  const viewport = useViewport()
  const { profileInfo } = useAuthentication()

  const router = useRouter()
  const { connected, publicKey } = useWallet()
  const { setVisible } = useWalletModal()

  const gotoPage = () => {
    if (data.id === 0) {
      window.open('https://foster-marketplace.gitbook.io/foster-studio')
    } else if (data.id === 1) {
      if (connected) {
        if (profileInfo && profileInfo.username) {
          router.push(`/${profileInfo.username}/merch`)
        }
      } else {
        setVisible(true)
      }
    } else if (data.id === 2) {
      router.push('/studio')
    } else if (data.id === 3) {
      if (connected) {
        if (profileInfo && profileInfo.username) {
          router.push(`/${profileInfo.username}/merch/new`)
        }
      } else {
        setVisible(true)
      }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.imageArea}>
        <ImageWithFoster
          src={viewport === 'xs' ? data.mobile_image : data.desktop_image}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div className={styles.infoBox}>
        <div>
          <div className={styles.studioTitle}>
            <p>{data.title}</p>
            <p dangerouslySetInnerHTML={{ __html: viewport === 'xs' ? data.descMobile : data.description }} />
          </div>
        </div>
        <div className="w-full flex justify-center sm:justify-start">
          <div className={styles.buyButton} onClick={() => gotoPage()}>
            <div>{data.button}</div>
            <div className={styles.buttonIcon}>
              <ArrowIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudioSeasonCard
