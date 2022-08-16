import React, { useEffect, useState } from 'react'

// next components
import Image from 'next/image'

// third party components
import AvatarEditor from 'react-avatar-editor'

// components
import OutlineButton from 'components/Button/OutlineButton'
import GradientButton from 'components/Button/GradientButton'
import LinkTextButton from 'components/Button/LinkTextButton'
import TweetMintButton from 'components/Button/TweetMintButton'
import MintOutlineButton from 'components/Button/MintOutlineButton'

// images and icons
import EllipseGreen from 'assets/icons/ellipse-green.svg'
import TwitterBackgroundBlackIcon from 'assets/icons/twitter-background-black.svg'

// styles
import styles from './index.module.scss'

const SuccessMintCollectionSection = props => {
  const { viewport, collectionArt, coverImage, banner } = props
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

  return (
    <div className="w-full">
      {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
        <div className={`relative g-container w-full flex flex-wrap justify-center ${styles.congratelationsArea}`}>
          <div className={styles.topLeftEllipse}>
            <Image src={EllipseGreen} alt="" objectFit="cover" />
          </div>
          <div className="w-full flex flex-wrap justify-center z-10 mt-[107px] z-10">
            {/* banner image */}
            <div className={styles.bannerImageArea}>
              {banner !== undefined ? (
                <Image
                  src={URL.createObjectURL(banner[0])}
                  alt=""
                  width={758}
                  height={194}
                  layout="responsive"
                  objectFit="cover"
                  className="rounded-[20px]"
                />
              ) : (
                <div style={{ width: artWidth, height: artHeight }} />
              )}
              <div className="absolute left-0 -bottom-[100px] w-full flex justify-center">
                <div className={styles.coverImageArea}>
                  <Image
                    src={URL.createObjectURL(coverImage[0])}
                    alt=""
                    width={150}
                    height={150}
                    layout="responsive"
                    objectFit="cover"
                    className="rounded-[6px]"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-[568px] mt-[142px] mb-[130px] flex flex-wrap justify-center z-10">
            <div className={styles.mintTitle}>Congratulations!</div>
            <div className={styles.mintText}>Your NFT collection has been minted successfully!</div>
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
                <OutlineButton
                  fullWidth
                  label="Mint another Collection"
                  backgroundColor="#63D6CD"
                  height="68px"
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
          <div className="w-full flex justify-center items-center z-10">
            <div className="w-full flex flex-wrap justify-center z-10 mt-[40px] z-10">
              {/* banner image */}
              <div className={styles.bannerImageArea}>
                {banner !== undefined ? (
                  <Image
                    src={URL.createObjectURL(banner[0])}
                    alt=""
                    width={758}
                    height={194}
                    layout="responsive"
                    objectFit="cover"
                    className="rounded-[20px]"
                  />
                ) : (
                  <div style={{ width: artWidth, height: artHeight }} />
                )}
                <div className="absolute left-0 -bottom-[50px] w-full flex justify-center">
                  <div className={styles.coverImageArea}>
                    <Image
                      src={URL.createObjectURL(coverImage[0])}
                      alt=""
                      width={86}
                      height={86}
                      layout="responsive"
                      objectFit="cover"
                      className="rounded-[6px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full mt-[60px] mb-[90px] flex flex-wrap justify-center z-10">
            <div className={styles.mintTitle}>Congratulations!</div>
            <div className={styles.mintText}>Your NFT collection has been minted successfully!</div>
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
                <MintOutlineButton
                  fullWidth
                  label="Mint another NFT"
                  backgroundColor="#63D6CD"
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
      )}
    </div>
  )
}

export default SuccessMintCollectionSection
