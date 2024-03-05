import React, { useEffect, useState } from 'react'

// next components
import Image from 'next/image'

// custom functions
import { useViewport } from 'utils'

// images and icons
import DefaultNftBG from 'assets/images/default-nft-bg.png'
import StudioSelectionColor from 'components/StudioSelectionColor'
import SolanaIcon from 'assets/icons/solana-logo-dark-medium.svg?component'
import ColorType from 'assets/json/print/color.json'
import { useSolToUsdRate } from 'hooks/useSolToUsdRate'

// styles
import styles from './index.module.scss'
import { getDisplayUserName } from 'utils/strings'
import ImageWithFoster from 'components/ImageWithFoster'

const StudioReleaseCard = props => {
  const { type = 'release', image, userName = '', nftName, onClick, nftImage } = props
  const viewport = useViewport()
  const { solToUsdRate } = useSolToUsdRate()
  const [apparelList, setApparelList] = useState(null)
  const [imagePath, setImagepath] = useState('')
  const [color, setColor] = useState(null)
  const [colorNumber, setColorNumber] = useState(-1)

  useEffect(() => {
    if (Math.floor(Math.random() * 1000) % 2 === 0) {
      setColor({
        id: 0,
        name: '#000000',
        type: 'black',
        asset_url: '/images/apparel-color-black.png',
      })
    } else {
      setColor({
        id: 1,
        name: '#fff',
        type: 'white',
        asset_url: '/images/apparel-color-white.png',
      })
    }
  }, [image])

  useEffect(() => {
    if (image) {
      setApparelList(image)
    }
  }, [image])

  useEffect(() => {
    if (apparelList) {
      setImagepath(apparelList.black.image.thumb)
    }
  }, [apparelList])

  useEffect(() => {
    if (color && apparelList) {
      switch (color?.type) {
        case 'black':
          setImagepath(apparelList.black.image.thumb)
          break
        case 'white':
          setImagepath(apparelList.white.image.thumb)
          break
        default:
          break
      }
    }
  }, [color])

  useEffect(() => {
    switch (color?.type) {
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
    <div className="w-full h-full relative p-[2px] lg:p-[3px]">
      <div className={styles.imageArea}>
        <div
          className={styles.imageContent}
          onClick={() => {
            onClick(colorNumber)
          }}
        >
          {apparelList !== null && apparelList !== '' ? (
            <>
              <img src={imagePath} className={styles.imageNft} />
              <div className={styles.nftImage}>
                <div className="w-[25%] h-[25%] mt-[29%] flex justify-center items-center">
                  <ImageWithFoster src={nftImage} className="w-auto h-auto max-w-full max-h-full object-contain" />
                </div>
              </div>
            </>
          ) : (
            <Image src={DefaultNftBG} alt="" className={styles.imageNft} onClick={() => onClick()} />
          )}
        </div>
      </div>
      <div className="w-full flex justify-center">
        <div className={styles.apparelTitle}>
          <div className="w-full">
            <div className="flex justify-center mx-[20px]">
              <div
                className={`${styles.overText} ${
                  type === 'release'
                    ? viewport === 'xs' || viewport === 'sm' || viewport === 'md'
                      ? 'max-w-[140px]'
                      : 'max-w-[250px]'
                    : ''
                }`}
              >
                {getDisplayUserName(nftName)}
              </div>
            </div>
            <div>
              {apparelList?.name === "Women's Short Sleeve"
                ? 'Womens T-Shirt'
                : apparelList?.name === 'Youth Short Sleeve'
                ? 'Youth T-Shirt'
                : apparelList?.name}
            </div>
          </div>
        </div>
      </div>
      {userName.length > 0 && <div className={styles.nftName}>{userName}</div>}
      <div className="flex flex-row mt-[5px] items-center justify-center">
        {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
          <div className={styles.cost}>
            <span className={styles.dollar}>$&nbsp;</span>
            {apparelList?.black.cost}
          </div>
        ) : (
          <div className={styles.cost}>$&nbsp;{apparelList?.black.cost}</div>
        )}
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
          newStudio={true}
        />
      </div>
    </div>
  )
}

export default StudioReleaseCard
