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
import { NftData } from 'types/nft'
import ImageWithFoster from 'components/ImageWithFoster'
import OutlineButton from 'components/Button/OutlineButton'

type MyNFTCardTypes = {
  data: NftData
  onClick?: any
  onClickStartAuction: (item: NftData) => void
  onClickListEdition: (item: NftData) => void
  onClickListNFT: (item: NftData) => void
  active: any
}

const MyNFTCard = ({ data, onClickStartAuction, onClickListEdition, onClickListNFT, active }: MyNFTCardTypes) => {
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
    setNftImage(data.image)
  }, [data])

  return (
    <div className={styles.container}>
      <Link href={`/nft/${data.mintAddress.toString()}`} passHref>
        <a>
          <div className="w-full overflow-hidden" onClick={() => dispatch({ type: 'set', isLoading: true })}>
            <div className={active === 0 ? styles.imageArea : styles.imageAreaForEdition}>
              <div className={styles.imageContent}>
                {data.category.toString().includes('video') ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `<video autoplay loop muted webkit-playsinline playsinline class="w-full object-cover">
                  <source src=${data.animation_url} type="video/mp4" /></video>`,
                    }}
                  />
                ) : (
                  <div>
                    <ImageWithFoster src={nftImage} width={340} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </a>
      </Link>

      <div className={styles.bottomSection}>
        <div className="w-full flex items-center">
          <div className={styles.nftName}>{data.name}</div>
        </div>
        {/* <div className="w-full flex items-center">
          <div className={styles.artistName}>{getShortAddress(data.creators[0].address.toString()) || 'No Artist'}</div>
        </div> */}
        {active === 0 ? (
          <div className="w-full hidden lg:flex flex-wrap gap-[8px] mt-[15px]">
            <GradientButton
              label="Start Auction"
              onClick={() => onClickStartAuction(data)}
              fullWidth
              borderRadius={10}
            />
            <OutlineButton
              backgroundColor="transparent"
              fullWidth
              label="List Artwork"
              onClick={() => onClickListNFT(data)}
              fontFamily="Muli-SemiBold"
            />
          </div>
        ) : (
          <div className="w-full hidden lg:flex justify-between items-center mt-[15px]">
            <GradientButton
              label="List Edition"
              onClick={() => onClickListEdition(data)}
              height="50px"
              fontSize="18px"
              borderWidth={1}
              fullWidth
              borderRadius={10}
            />
          </div>
        )}

        {active === 0 ? (
          <div className="w-full flex flex-wrap lg:hidden justify-between items-center mt-[6px] gap-[5px]">
            <GradientButton
              label="Start Auction"
              onClick={() => onClickStartAuction(data)}
              fullWidth
              height="28px"
              fontSize="12px"
              borderRadius="5px"
            />
            <OutlineButton
              label="List Artwork"
              onClick={() => onClickListNFT(data)}
              fontSize="12px"
              fullWidth
              height="28px"
              borderRadius="5px"
              fontFamily="Muli-SemiBold"
            />
          </div>
        ) : (
          <div className="w-full flex lg:hidden justify-between items-center mt-[8px] mb-[2px]">
            <GradientButton
              label="List Edition"
              onClick={() => onClickListEdition(data)}
              height="28px"
              fontSize="12px"
              fullWidth
              borderRadius={6}
              borderWidth={1}
            />
          </div>
        )}
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
