import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

// next components
import Link from 'next/link'

// custom components
import GradientButton from 'components/Button/GradientButton'

// images and icons
import AudioPlayerBackground from 'assets/images/audio-player.png'

// styles
import styles from './index.module.scss'
import { getShortAddress } from 'utils/strings'
import SecondaryButton from 'components/Button/SecondaryButton'
import { NftData } from 'types/nft'

type MyNFTCardTypes = {
  data: NftData
  onClickStartAuction: (item: NftData) => void
  onClickListNFT: (item: NftData) => void
}

const MyNFTCard = ({ data, onClickStartAuction, onClickListNFT }: MyNFTCardTypes) => {
  const [blurMode, setBlurMode] = useState(false)
  const dispatch = useDispatch()

  return (
    <div className={styles.container}>
      <Link href={`/nft/${data.mintAddress.toString()}`} passHref>
        <a>
          <div
            className="w-full rounded-[10px] lg:rounded-[20px] overflow-hidden"
            onClick={() => dispatch({ type: 'set', isLoading: true })}
          >
            {data.category === 'video' ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: `<video autoplay loop muted webkit-playsinline playsinline class="w-full aspect-[321/321] object-cover">
                  <source src=${data.animation_url} type="video/mp4" /></video>`,
                }}
              />
            ) : (
              <div className={styles.imageArea}>
                <div className={styles.imageContent}>
                  <img src={data.image} alt={data.name} className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </div>
        </a>
      </Link>

      <div className="w-full mt-[10px] flex flex-wrap justify-center items-center">
        <div className="w-full flex items-center">
          <div className={styles.nftName}>{data.name || data.name}</div>
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
