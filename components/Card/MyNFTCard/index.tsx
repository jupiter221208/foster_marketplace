import React, { useState } from 'react'

// next components
import Image from 'next/image'

// custom components
import GradientButton from 'components/Button/GradientButton'

// images and icons
import AudioPlayerBackground from 'assets/images/audio-player.png'

// styles
import styles from './index.module.scss'
import { getShortAddress } from 'utils/strings'
import SecondaryButton from 'components/Button/SecondaryButton'

const MyNFTCard = props => {
  const { data, publicKey, onClick, onClickStartAuction, onClickListNFT } = props
  const [blurMode, setBlurMode] = useState(false)

  return (
    <div className={styles.container}>
      <div className="w-full rounded-[10px] lg:rounded-[20px] overflow-hidden" onClick={() => onClick(data)}>
        {data.json.category === 'video' || data.json.properties?.category === 'video' ? (
          <div
            dangerouslySetInnerHTML={{
              __html: `<video autoplay loop muted webkit-playsinline playsinline class="w-full aspect-[321/321] object-cover">
                  <source src=${data.json.animation_url} type="video/mp4" /></video>`,
            }}
          />
        ) : (
          <div className={styles.imageArea}>
            <div className={styles.imageContent}>
              <Image
                src={
                  data.json.image === undefined || data.json.image === null
                    ? AudioPlayerBackground.src
                    : data.json.image
                }
                layout="fill"
                alt={data.json.name || data.name}
                className="w-full object-cover"
              />
            </div>
          </div>
        )}
      </div>
      <div className="w-full mt-[10px] flex flex-wrap justify-center items-center">
        <div className="w-full flex items-center">
          <div className={styles.nftName}>{data.json.name || data.name}</div>
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
          />
          <SecondaryButton
            backgroundColor="transparent"
            label="List NFT"
            onClick={() => onClickListNFT(data)}
            height="40px"
            fontSize="14px"
          />
        </div>
        <div className="w-full flex lg:hidden justify-between items-center mt-4">
          <GradientButton
            label="Start Auction"
            onClick={() => onClickStartAuction(data)}
            height="26px"
            fontSize="10px"
            borderRadius="6px"
          />
          <SecondaryButton
            label="List NFT"
            onClick={() => onClickListNFT(data)}
            height="26px"
            fontSize="10px"
            borderRadius="6px"
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
