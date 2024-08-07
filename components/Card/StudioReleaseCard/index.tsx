import React, { useEffect, useState } from 'react'

// next components
import Image from 'next/image'

// custom functions
import { useViewport } from 'utils'

// images and icons
import DefaultNftBG from 'assets/images/default-nft-bg.png'
import StudioSelectionColor from 'components/StudioSelectionColor'
import SolanaIcon from 'assets/icons/solana-logo-dark-small.svg?component'
import ColorType from 'assets/json/print/color.json'
import { useSolToUsdRate } from 'hooks/useSolToUsdRate'

// styles
import styles from './index.module.scss'
import { getDisplayUserName } from 'utils/strings'
import ImageWithFoster from 'components/ImageWithFoster'

import SweatshirtW from '../../../public/images/apparel/man_sweat_white.png'
import ShortSleeveW from '../../../public/images/apparel/man_t_white.png'
import HoodieW from '../../../public/images/apparel/man_hoodie_white.png'
import WomenShortSleeveW from '../../../public/images/apparel/women_t_white.png'
import ManLongsLeeveW from '../../../public/images/apparel/man_longsleeve_white.png'

import SweatshirtB from '../../../public/images/apparel/man_sweat_black.png'
import ShortSleeveB from '../../../public/images/apparel/man_t_black.png'
import HoodieB from '../../../public/images/apparel/man_hoodie_black.png'
import WomenShortSleeveB from '../../../public/images/apparel/women_t_black.png'
import ManLongsLeeveB from '../../../public/images/apparel/man_longsleeve_black.png'

const StudioReleaseCard = props => {
  const { type = 'release', image, userName = '', nftName, onClick, nftImage, size = null } = props
  const viewport = useViewport()
  const { solToUsdRate } = useSolToUsdRate()
  const [apparelList, setApparelList] = useState(null)
  const [imagePath, setImagePath] = useState('')
  const [color, setColor] = useState(null)
  const [colorNumber, setColorNumber] = useState(-1)

  useEffect(() => {
    if (Math.floor(Math.random() * 1000) % 2 === 0) {
      setColor({
        id: 0,
        name: '#000000',
        type: 'black',
        asset_url: '/images/apparel-color-black.png',
        blendMode: 'screen',
      })
    } else {
      setColor({
        id: 1,
        name: '#fff',
        type: 'white',
        asset_url: '/images/apparel-color-white.png',
        blendMode: 'multiply',
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
      setImagePath(apparelList.black.image.front)
    }
  }, [apparelList])

  useEffect(() => {
    if (color && apparelList) {
      switch (color?.type) {
        case 'black':
          setImagePath(apparelList.black.image.front)
          break
        case 'white':
          setImagePath(apparelList.white.image.front)
          break
        default:
          break
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className="w-full h-full relative">
      <div className={styles.imageArea}>
        <div
          className={`${styles.imageContent} ${type === 'nft' ? '' : styles.contentBG}`}
          onClick={() => {
            onClick(colorNumber, userName, image)
          }}
        >
          {apparelList !== null && apparelList !== '' ? (
            <>
              <ImageWithFoster
                src={
                  imagePath.endsWith('man_sweat_white.png')
                    ? SweatshirtW.src
                    : imagePath.endsWith('man_t_white.png')
                    ? ShortSleeveW.src
                    : imagePath.endsWith('man_hoodie_white.png')
                    ? HoodieW.src
                    : imagePath.endsWith('women_t_white.png')
                    ? WomenShortSleeveW.src
                    : imagePath.endsWith('man_longsleeve_white.png')
                    ? ManLongsLeeveW.src
                    : imagePath.endsWith('man_sweat_black.png')
                    ? SweatshirtB.src
                    : imagePath.endsWith('man_t_black.png')
                    ? ShortSleeveB.src
                    : imagePath.endsWith('man_hoodie_black.png')
                    ? HoodieB.src
                    : imagePath.endsWith('women_t_black.png')
                    ? WomenShortSleeveB.src
                    : imagePath.endsWith('man_longsleeve_black.png')
                    ? ManLongsLeeveB.src
                    : ''
                }
                width={350}
                className={styles.imageNft}
              />
              <div className={styles.nftImage}>
                {apparelList.name === 'Hoodie' ? (
                  <div className={`w-[30%] h-[30%] mt-[28%] flex justify-center items-start overflow-hidden`}>
                    <ImageWithFoster
                      style={{
                        mixBlendMode: color.blendMode,
                      }}
                      src={nftImage}
                      width={200}
                      className="max-w-full max-h-full object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className={`${styles.noHeightFull} w-[32%] max-h-[43%] mt-[22%] flex justify-center items-start overflow-hidden`}
                  >
                    <ImageWithFoster
                      style={{
                        mixBlendMode: color.blendMode,
                      }}
                      width={200}
                      src={nftImage}
                      className="w-full object-contain flex items-start"
                    />
                  </div>
                )}
              </div>
            </>
          ) : (
            <Image src={DefaultNftBG} alt="" className={styles.imageNft} onClick={() => onClick()} />
          )}
        </div>
      </div>
      <div className="w-full flex justify-center mt-[15px]">
        <div className={styles.apparelTitle}>
          <div className="w-full">
            <div className="flex justify-center mx-[20px]">
              <div
                className={`${styles.overText} ${
                  type === 'release' || type === 'nft'
                    ? viewport === 'xs' || viewport === 'sm' || viewport === 'md'
                      ? 'max-w-[140px]'
                      : 'max-w-[250px]'
                    : ''
                }`}
              >
                {getDisplayUserName(nftName)}
              </div>
            </div>
            {/* <div>
              {apparelList?.name === "Women's Short Sleeve"
                ? 'Womens T-Shirt'
                : apparelList?.name === 'Youth Short Sleeve'
                ? 'Youth T-Shirt'
                : apparelList?.name}
            </div> */}
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
          <SolanaIcon alt="" className="mt-[4px]" />
          &nbsp;
          <div className={styles.cost}>
            {apparelList?.black.cost ? (apparelList?.black.cost / solToUsdRate).toFixed(2) : ''}
          </div>
        </div>
      </div>
      <div className="w-full mt-[10px] flex justify-center">
        <div className="flex gap-[25px] items-center">
          <StudioSelectionColor
            label={''}
            data={ColorType}
            selected={color?.type}
            onSelect={itemData => setColor(itemData)}
            newStudio={true}
          />
          {size && <div className={styles.size}>{size}</div>}
        </div>
      </div>
    </div>
  )
}

export default StudioReleaseCard
