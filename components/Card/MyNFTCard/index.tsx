import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useResizeDetector } from 'react-resize-detector'

// next components
import Link from 'next/link'

// custom components
import GradientButton from 'components/Button/GradientButton'

// images and icons
import DefaultNftBG from 'assets/images/default-nft-bg.png'

// styles
import styles from './index.module.scss'
import { getShortAddress } from 'utils/strings'
import SecondaryButton from 'components/Button/SecondaryButton'
import { NftData } from 'types/nft'

type MyNFTCardTypes = {
  data: NftData
  onClick?: any
  onClickStartAuction: (item: NftData) => void
  onClickListNFT: (item: NftData) => void
}

const MyNFTCard = ({ data, onClickStartAuction, onClickListNFT }: MyNFTCardTypes) => {
  const [blurMode, setBlurMode] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const dispatch = useDispatch()
  const [nftImage, setNftImage] = useState(data.image)

  const [imgErrorCount, setImgErrorCount] = useState(0)

  const handleImageError = e => {
    setImgErrorCount(prevCount => {
      const newCount = prevCount + 1
      if (newCount === 1) {
        setNftImage(() => data.original.image || '')
      } else if (newCount === 2) {
        setNftImage(DefaultNftBG.src)
      }
      return newCount
    })
  }

  useEffect(() => {
    setImageLoading(true)
  }, [data])

  return (
    <div className={styles.container}>
      <Link href={`/nft/${data.mintAddress.toString()}`} passHref>
        <a>
          <div
            className="w-full rounded-[10px] lg:rounded-[20px] overflow-hidden"
            onClick={() => dispatch({ type: 'set', isLoading: true })}
          >
            {data.json?.category === 'video' || data.json?.properties?.category === 'video' ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: `<video autoplay loop muted webkit-playsinline playsinline class="w-full aspect-[321/321] object-cover">
                  <source src=${data.animation_url} type="video/mp4" /></video>`,
                }}
              />
            ) : (
              <div className={styles.imageArea}>
                <div className={styles.imageContent}>
                  {imageLoading && (
                    <div className={styles.skeletonLoaderOuterBox}>
                      <div className={styles.skeletonLoader} />
                    </div>
                  )}
                  <img
                    src={nftImage}
                    alt={data.name}
                    onError={handleImageError}
                    className="w-full h-full object-cover"
                    onLoad={() => setImageLoading(false)}
                  />
                </div>
              </div>
            )}
          </div>
        </a>
      </Link>

      <div className="w-full mt-[10px] flex flex-wrap justify-center items-center">
        <div className="w-full flex items-center">
          <div className={styles.nftName}>{data.name}</div>
        </div>
        <div className="w-full flex items-center">
          <div className={styles.artistName}>{getShortAddress(data.creators[0].address.toString()) || 'No Artist'}</div>
        </div>
        <div className="w-full hidden lg:flex justify-between items-center mt-4">
          <GradientButton
            label="Start Auction"
            onClick={() => onClickStartAuction(data)}
            height="40px"
            fontSize="14px"
            fontFamily="Muli-SemiBold"
          />
          <SecondaryButton
            backgroundColor="transparent"
            label="List NFT"
            onClick={() => onClickListNFT(data)}
            height="40px"
            fontSize="14px"
            fontFamily="Muli-SemiBold"
          />
        </div>
        <div className="w-full flex lg:hidden justify-between items-center mt-4">
          <GradientButton
            label="Start Auction"
            onClick={() => onClickStartAuction(data)}
            height="26px"
            fontSize="10px"
            borderRadius="6px"
            fontFamily="Muli-SemiBold"
          />
          <SecondaryButton
            label="List NFT"
            onClick={() => onClickListNFT(data)}
            height="26px"
            fontSize="10px"
            borderRadius="6px"
            fontFamily="Muli-SemiBold"
          />
        </div>
      </div>

      {blurMode && (
        <div className={styles.noAuction} onMouseLeave={() => setBlurMode(false)}>
          Auctions can only be
          <br />
          started by the creator.
        </div>
      )}
    </div>
  )
}

export default MyNFTCard
