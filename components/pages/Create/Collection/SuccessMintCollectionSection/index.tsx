import React, { useMemo } from 'react'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'

// components
import OutlineButton from 'components/Button/OutlineButton'
import GradientButton from 'components/Button/GradientButton'
import LinkTextButton from 'components/Button/LinkTextButton'
import TweetMintButton from 'components/Button/TweetMintButton'
import MintOutlineButton from 'components/Button/MintOutlineButton'

// custom functions
import { useViewport } from 'utils'

// images and icons
import EllipseGreen from 'assets/icons/ellipse-green.svg'
import TwitterBackgroundBlackIcon from 'assets/icons/twitter-background-black.svg'

// styles
import styles from './index.module.scss'

// solana
import { getExplorerUrl } from 'utils/explorer'
import { useConnection } from '@solana/wallet-adapter-react'

const SuccessMintCollectionSection = props => {
  const { coverCroppedImage, bannerCroppedImage, collectionNft, reset } = props

  const router = useRouter()

  const viewport = useViewport()

  const { connection } = useConnection()
  const explorerURL = useMemo(() => getExplorerUrl(connection.rpcEndpoint, collectionNft.mintAddress.toBase58()), [collectionNft, connection])

  return (
    <div className="w-full">
      {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
        <div className={`relative g-container w-full flex flex-wrap justify-center ${styles.congratelationsArea}`}>
          <div className={styles.topLeftEllipse}>
            <Image src={EllipseGreen} alt="" objectFit="cover" />
          </div>
          <div className="w-full flex flex-wrap justify-center mt-[107px] z-10">
            {/* banner image */}
            <div className={styles.bannerImageArea}>
              {bannerCroppedImage !== undefined ? (
                <Image
                  src={bannerCroppedImage}
                  alt=""
                  width={758}
                  height={194}
                  layout="responsive"
                  objectFit="cover"
                  className="rounded-[20px]"
                />
              ) : (
                <div />
              )}
              <div className="absolute left-0 -bottom-[100px] w-full flex justify-center">
                <div className={styles.coverImageArea}>
                  <Image
                    src={coverCroppedImage}
                    alt=""
                    width={160}
                    height={160}
                    layout="responsive"
                    objectFit="cover"
                    className="rounded-[6px]"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-[568px] mt-[142px] mb-[130px] flex flex-wrap justify-center z-10">
            <div className={styles.title}>Congratulations!</div>
            <div className={styles.text}>Your NFT collection has been minted successfully!</div>
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
                  label="View Dashboard"
                  backgroundColor="#63D6CD"
                  height="68px"
                  onClick={() => router.push('/dashboard')}
                  borderColor="#5AC3BA"
                />
              </div>
            </div>
            <div className="mt-[44px]">
              <LinkTextButton label="View on Solscan" link={explorerURL}/>
            </div>
          </div>
        </div>
      ) : (
        <div className={`relative g-container w-full flex flex-wrap justify-center ${styles.congratelationsArea}`}>
          <div className="w-full flex justify-center items-center z-10">
            <div className="w-full flex flex-wrap justify-center mt-[40px] z-10">
              {/* banner image */}
              <div className={styles.bannerImageArea}>
                {bannerCroppedImage !== undefined ? (
                  <Image
                    src={bannerCroppedImage}
                    alt=""
                    width={758}
                    height={194}
                    layout="responsive"
                    objectFit="cover"
                    className="rounded-[20px]"
                  />
                ) : (
                  <div />
                )}
                <div className="absolute left-0 -bottom-[50px] w-full flex justify-center">
                  <div className={styles.coverImageArea}>
                    <Image
                      src={coverCroppedImage}
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
            <div className={styles.title}>Congratulations!</div>
            <div className={styles.text}>Your NFT collection has been minted successfully!</div>
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
                  label="View Dashboard"
                  backgroundColor="#63D6CD"
                  onClick={() => router.push('/dashboard')}
                  borderColor="#5AC3BA"
                />
              </div>
            </div>
            <div className="mt-[33px]">
              <LinkTextButton label="View on Solscan" link={explorerURL} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SuccessMintCollectionSection
