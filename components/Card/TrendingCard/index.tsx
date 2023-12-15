import React, { useEffect, useState } from 'react'
import ReactPlaceholder from 'react-placeholder'
import 'react-placeholder/lib/reactPlaceholder.css'
import Link from 'next/link'

// next components
import Image from 'next/image'

// custom functions
import { useViewport } from 'utils'

// images and icons
import StudioSelectionColor from 'components/StudioSelectionColor'
import SolanaIcon from 'assets/icons/solana-logo-dark.svg?component'
import ColorType from 'assets/json/print/color.json'

// styles
import styles from './index.module.scss'

import { useDispatch } from 'react-redux'
import { useSolToUsdRate } from 'hooks/useSolToUsdRate'
import OutlineButton from 'components/Button/OutlineButton'

const TrendingCard = props => {
  const { token_id, imagedata, nftName, assetUrl, onClick, userName } = props
  const viewport = useViewport()
  const dispatch = useDispatch()
  const { solToUsdRate } = useSolToUsdRate()
  const [apparelList, setApparelList] = useState(null)
  const [imagePath, setImagepath] = useState('')
  const [color, setColor] = useState({
    id: 0,
    name: '#000000',
    type: 'black',
    asset_url: '/images/apparel-color-black.png',
  })
  const [colorNumber, setColorNumber] = useState(-1)

  useEffect(() => {
    if (imagedata) {
      setApparelList(imagedata)
    }
  }, [imagedata])

  useEffect(() => {
    if (apparelList) {
      setImagepath(apparelList.black.image.front)
    }
  }, [apparelList])

  useEffect(() => {
    if (color && apparelList) {
      switch (color.type) {
        case 'black':
          setImagepath(apparelList.black.image.front)
          break
        case 'white':
          setImagepath(apparelList.white.image.front)
          break
        case 'gray':
          setImagepath(apparelList.gray.image.front)
          break
        case 'navy':
          setImagepath(apparelList.navy.image.front)
          break
        default:
          break
      }
    }
  }, [color])

  useEffect(() => {
    switch (color.type) {
      case 'black':
        setColorNumber(1)
        break
      case 'white':
        setColorNumber(0)
        break
      case 'gray':
        setColorNumber(2)
        break
      case 'navy':
        setColorNumber(3)
        break
      default:
        break
    }
  }, [color])

  return (
    <div className="w-full h-full relative p-[10px] lg:p-[12px]">
      <div className={styles.imageArea}>
        <div className={styles.imageContent} onClick={() => onClick(colorNumber)}>
          {apparelList !== null && apparelList !== '' && (
            <>
              <img src={imagePath} className={styles.imageNft} />
              <div className={styles.nftImage}>
                <div className="w-[30%] h-[30%] lg:-mt-[12%] -mt-[12%] flex justify-center items-start opacity-80">
                  <img src={assetUrl} alt="" className="w-auto h-auto max-w-full max-h-full object-contain" />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
        <>
          <div className="w-full flex flex-row justify-between">
            <div className={styles.apparelTitle}>
              <div className={styles.overText}>{nftName}</div>
              <div>
                {apparelList?.name === "Women's Short Sleeve"
                  ? 'Womens T-Shirt'
                  : apparelList?.name === 'Youth Short Sleeve'
                  ? 'Youth T-Shirt'
                  : apparelList?.name}
              </div>
            </div>
            <div className="flex relative mt-[-10px]">
              <StudioSelectionColor
                label={''}
                data={ColorType}
                selected={color?.type}
                onSelect={itemData => setColor(itemData)}
                newStudio={true}
              />
            </div>
          </div>
          <div className="flex flex-row items-baseline justify-between">
            <div className={styles.nftName}>{userName}</div>
            <div className="flex flex-row mt-[5px] items-center">
              <div className={styles.cost}>
                <span className={styles.dollar}>$&nbsp;</span>
                {apparelList?.black.cost}
              </div>
              <div className={styles.costDivider} />
              <div className="flex items-center ml-[10px]">
                <SolanaIcon alt="" />
                &nbsp;
                <div className={styles.cost}>
                  {apparelList?.black.cost ? (apparelList?.black.cost / solToUsdRate).toFixed(2) : ''}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col justify-center">
            <div className={styles.apparelTitle}>
              <div className={styles.overText}>{nftName}</div>
              <div>
                {apparelList?.name === "Women's Short Sleeve"
                  ? 'Womens T-Shirt'
                  : apparelList?.name === 'Youth Short Sleeve'
                  ? 'Youth T-Shirt'
                  : apparelList?.name}
              </div>
            </div>
          </div>
          <div className={styles.nftName}>{userName}</div>
          <div className="flex flex-row mt-[5px] items-center lg:justify-center">
            <div className={styles.cost}>$&nbsp;{apparelList?.black.cost}</div>
            <div className={styles.costDivider} />
            <div className="flex items-center ml-[10px]">
              <SolanaIcon alt="" />
              &nbsp;
              <div className={styles.cost}>
                {apparelList?.black.cost ? (apparelList?.black.cost / solToUsdRate).toFixed(2) : ''}
              </div>
            </div>
          </div>
          <div className="w-full mt-[10px] relative">
            <StudioSelectionColor
              label={''}
              data={ColorType}
              selected={color?.type}
              onSelect={itemData => setColor(itemData)}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default TrendingCard
