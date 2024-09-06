import React, { useState, useEffect } from 'react'

// next components
import Image from 'next/image'

import ImageWithFoster from 'components/ImageWithFoster'

// custom functions
import { useViewport } from 'utils'
import { useRouter } from 'next/router'

// styles
import styles from './index.module.scss'

// resources
import ArrowIcon from 'assets/icons/arrow-right-13x10.svg?component'

const StudioSeasonCard = ({ data }) => {
  const viewport = useViewport()
  const router = useRouter()

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
          <div className={styles.buyButton} onClick={() => router.push('/studio')}>
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
