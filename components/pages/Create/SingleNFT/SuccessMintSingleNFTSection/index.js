import React, { useEffect, useState } from 'react'

// next components
import Image from 'next/image'

// third party components
import AvatarEditor from 'react-avatar-editor'

// components
import GradientButton from 'components/Button/GradientButton'
import OutlineButton from 'components/Button/OutlineButton'
import LinkTextButton from 'components/Button/LinkTextButton'

import TweetMintButton from 'components/Button/TweetMintButton'
import MintOutlineButton from 'components/Button/MintOutlineButton'

// images and icons
import EllipseGreen from 'assets/icons/ellipse-green.svg'
import TwitterBackgroundBlackIcon from 'assets/icons/twitter-background-black.svg'

// styles
import styles from './index.module.scss'

const SuccessMintSingleNFTSection = props => {
  const { viewport, NFTType, nftArt, artWidth, artHeight } = props

  const [screenWidth, setScreenWidth] = useState(1920)

  useEffect(() => {
    setScreenWidth(window.innerWidth)
  }, [])

  useEffect(() => {
    const resizeFunction = () => {
      setScreenWidth(window.innerWidth)
    }
    window.addEventListener('resize', resizeFunction)
  }, [])

  return viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
    <div className={`relative g-container w-full flex flex-wrap justify-center ${styles.congratelationsArea}`}>
      <div className={styles.topLeftEllipse}>
        <Image src={EllipseGreen} alt="" objectFit="cover" />
      </div>
      <div className="w-full flex justify-center items-center z-10">
        {NFTType === 'image' && (
          <div className={`${styles.artArea}`} style={{ width: artWidth, height: artHeight }}>
            {nftArt !== undefined && artWidth !== 0 && artHeight !== 0 ? (
              <AvatarEditor
                image={nftArt[0]}
                width={artWidth - 32}
                height={artHeight - 32}
                border={16}
                borderRadius={16}
                color={[77, 92, 94, 1]} // RGBA
                scale={1}
                rotate={0}
              />
            ) : (
              <div className={`${styles.artArea}`} style={{ width: artWidth, height: artHeight }} />
            )}
          </div>
        )}
        {NFTType === 'video' && (
          <div className="w-full max-w-[392px] h-full">
            <video controls className="w-full">
              <source src={URL.createObjectURL(nftArt[0])} type={nftArt[0].type} />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {NFTType === 'audio' && (
          <div className="w-full max-w-[392px] my-20">
            <audio controls className="w-full">
              <source src={URL.createObjectURL(nftArt[0])} type={nftArt[0].type} />
              Your browser does not support the video tag.
            </audio>
          </div>
        )}
      </div>
      <div className="max-w-[568px] mt-[62px] mb-[130px] flex flex-wrap justify-center z-10">
        <div className={styles.mintTitle}>Congratulations!</div>
        <div className={styles.mintText}>Your NFT has been minted successfully!</div>
        <div className="w-full flex justify-between gap-[30px] mt-[60px]">
          <div className="w-full">
            <TweetMintButton
              icon={TwitterBackgroundBlackIcon}
              fullWidth
              label="Tweet your Mint"
              color="#202427"
              backgroundColor="#378287"
              onClick={() => {}}
              direction="rtl"
            />
          </div>
          <div className="w-full">
            <MintOutlineButton
              fullWidth
              label="Mint another NFT"
              backgroundColor="#63D6CD"
              onClick={() => setCurrentStep(1)}
              borderColor="#5AC3BA"
            />
          </div>
        </div>
        <div className="mt-[44px]">
          <LinkTextButton label="View on Solscan" link="/" />
        </div>
      </div>
    </div>
  ) : (
    <div className={`relative g-container w-full flex flex-wrap justify-center ${styles.congratelationsArea}`}>
      <div className="w-full flex justify-center items-center z-10 mt-10">
        <div className="max-w-[237px] z-10">
          <div className="w-full rounded-[16px] overflow-hidden">
            {NFTType === 'image' && (
              <div className={`${styles.artArea}`} style={{ width: artWidth, height: artHeight }}>
                {nftArt !== undefined && artWidth !== 0 && artHeight !== 0 ? (
                  <AvatarEditor
                    image={nftArt[0]}
                    width={artWidth - 32}
                    height={artHeight - 32}
                    border={16}
                    borderRadius={16}
                    color={[77, 92, 94, 1]} // RGBA
                    scale={1}
                    rotate={0}
                  />
                ) : (
                  <div className={`${styles.artArea}`} style={{ width: artWidth, height: artHeight }} />
                )}
              </div>
            )}
            {NFTType === 'video' && (
              <div className="w-full h-full">
                <video controls className="w-full">
                  <source src={URL.createObjectURL(nftArt[0])} type={nftArt[0].type} />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

            {NFTType === 'audio' && (
              <div className="w-full my-20">
                <audio controls className="w-full">
                  <source src={URL.createObjectURL(nftArt[0])} type={nftArt[0].type} />
                  Your browser does not support the video tag.
                </audio>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-full mt-[60px] mb-[90px] flex flex-wrap justify-center z-10">
        <div className={styles.mintTitle}>Congratulations!</div>
        <div className={styles.mintText}>Your NFT has been minted successfully!</div>
        <div className="w-full flex flex-wrap justify-center gap-[30px] mt-[60px]">
          <div className="w-[221px]">
            <GradientButton
              icon={TwitterBackgroundBlackIcon}
              fullWidth
              label="Tweet your Mint"
              color="#202427"
              backgroundColor="#378287"
              height="45px"
              onClick={() => {}}
              direction="rtl"
            />
          </div>
          <div className="w-[221px]">
            <OutlineButton
              fullWidth
              label="Mint another NFT"
              backgroundColor="#63D6CD"
              height="45px"
              onClick={() => setCurrentStep(1)}
              borderColor="#5AC3BA"
            />
          </div>
        </div>
        <div className="mt-[33px]">
          <LinkTextButton label="View on Solscan" link="/" />
        </div>
      </div>
    </div>
  )
}

export default SuccessMintSingleNFTSection
