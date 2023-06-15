import React, { useState, useEffect } from 'react'

// next components
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

// custom functions
import { useViewport } from 'utils'

// json

// images

// styles
import styles from './index.module.scss'

// api

const ApparelSection = props => {
  const { apparel, nftCoverUrl } = props
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()

  return (
    <div className={styles.container}>
      <img src={apparel} alt="" className="h-full" />
      <div className="absolute top-[20%] w-[30%] h-[30%]">
        <img src={nftCoverUrl} alt="" className="w-full h-full object-cover" />
      </div>
    </div>
  )
}

export default ApparelSection
