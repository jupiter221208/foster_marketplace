import React, { useEffect, useState } from 'react'

// next components
import Image from 'next/image'

// third party components
import AvatarEditor from 'react-avatar-editor'

// components
import Button from 'components/Button'
import IconButton from 'components/Button/IconButton'
import LinkTextButton from 'components/Button/LinkTextButton'

// images and icons
import EllipseGreen from 'assets/icons/ellipse-green.svg'
import TwitterBackgroundWhiteIcon from 'assets/icons/twitter-background-white.svg'

// styles
import styles from './index.module.scss'

const SuccessMintCollectionSection = props => {
  const { viewport, collectionArt } = props
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
          <div className="w-full flex justify-center items-center z-10">
            <div className="max-w-[392px] rounded-[16px] overflow-hidden mt-[82px]">
              <AvatarEditor
                image={collectionArt !== undefined && collectionArt[0]}
                width={screenWidth > 400 ? 360 : screenWidth - 72}
                height={screenWidth > 400 ? 360 : screenWidth - 72}
                border={16}
                borderRadius={12}
                color={[255, 255, 255, 0.5]} // RGBA
                scale={1}
                rotate={0}
              />
            </div>
          </div>
          <div className="max-w-[568px] mt-[62px] mb-[130px] flex flex-wrap justify-center z-10">
            <div className={styles.mintTitle}>Congratelations!</div>
            <div className={styles.mintText}>Your Collection has been minted successfully!</div>
            <div className="w-full flex justify-between gap-[30px] mt-[60px]">
              <div className="w-full">
                <IconButton
                  icon={TwitterBackgroundWhiteIcon}
                  fullWidth
                  label="Tweet your Mint"
                  color="#ffffff"
                  backgroundColor="#378287"
                  height="68px"
                  onClick={() => {}}
                />
              </div>
              <div className="w-full">
                <Button
                  fullWidth
                  label="Mint another Collection"
                  backgroundColor="#63D6CD"
                  height="68px"
                  onClick={() => setCurrentStep(1)}
                />
              </div>
            </div>
            <div className="mt-[44px]">
              <LinkTextButton label="My Mint" link="/" />
            </div>
          </div>
        </div>
      ) : (
        <div className={`relative g-container w-full flex flex-wrap justify-center ${styles.congratelationsArea}`}>
          <div className="w-full flex justify-center items-center z-10 mt-10">
            <div className="max-w-[237px] z-10">
              <div className="w-full rounded-[16px] overflow-hidden">
                {collectionArt !== undefined ? (
                  <AvatarEditor
                    image={collectionArt[0]}
                    width={225}
                    height={225}
                    border={6}
                    borderRadius={12}
                    color={[77, 92, 94, 1]} // RGBA
                    scale={1}
                    rotate={0}
                  />
                ) : (
                  <div className={styles.artArea} />
                )}
              </div>
            </div>
          </div>
          <div className="w-full mt-[60px] mb-[90px] flex flex-wrap justify-center z-10">
            <div className={styles.mintTitle}>Congratelations!</div>
            <div className={styles.mintText}>Your Collection has been minted successfully!</div>
            <div className="w-full flex flex-wrap justify-center gap-[30px] mt-[60px]">
              <div className="w-[221px]">
                <IconButton
                  icon={TwitterBackgroundWhiteIcon}
                  fullWidth
                  label="Tweet your Mint"
                  color="#ffffff"
                  backgroundColor="#378287"
                  height="45px"
                  onClick={() => {}}
                />
              </div>
              <div className="w-[221px]">
                <Button
                  fullWidth
                  label="Mint another Collection"
                  backgroundColor="#63D6CD"
                  height="45px"
                  onClick={() => setCurrentStep(1)}
                />
              </div>
            </div>
            <div className="mt-[33px]">
              <LinkTextButton label="My Mint" link="/" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SuccessMintCollectionSection
