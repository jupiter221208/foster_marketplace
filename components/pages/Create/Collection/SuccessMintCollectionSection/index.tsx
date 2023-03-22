import React, { useMemo } from 'react'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'

// components
import OutlineButton from 'components/Button/OutlineButton'
import LinkTextButton from 'components/Button/LinkTextButton'
import TweetMintButton from 'components/Button/TweetMintButton'
import MintOutlineButton from 'components/Button/MintOutlineButton'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'

// solana
import { getExplorerUrl } from 'utils/explorer'
import { useConnection } from '@solana/wallet-adapter-react'
import { TwitterShareButton } from 'react-share'

const SuccessMintCollectionSection = props => {
  const { coverCroppedImage, bannerCroppedImage, collectionNft } = props

  const router = useRouter()

  const viewport = useViewport()

  const { connection } = useConnection()
  const explorerURL = useMemo(
    () => getExplorerUrl(connection.rpcEndpoint, collectionNft.mintAddress.toBase58()),
    [collectionNft, connection]
  )
  const collectionDetailUrl = globalThis.window?.origin + '/browse-collection/' + collectionNft.mintAddress.toBase58()

  return (
    <div className="w-full">
      {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
        <div className={`relative g-container w-full flex flex-wrap justify-center ${styles.congratelationsArea}`}>
          <div className={styles.topLeftEllipse}>
            <svg xmlns="http://www.w3.org/2000/svg" width="2321" height="2321" viewBox="0 0 2321 2321">
              <defs>
                <radialGradient id="radial-gradient" cx="0.5" cy="0.5" r="0.5" gradientUnits="objectBoundingBox">
                  <stop offset="0" stopColor="var(--ellipse-svg-1)" stopOpacity="0.404" />
                  <stop offset="1" stopColor="var(--ellipse-svg-2)" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle
                id="Ellipse_4322"
                data-name="Ellipse 4322"
                cx="1010.5"
                cy="1010.5"
                r="1010.5"
                transform="translate(150 150)"
                fill="url(#radial-gradient)"
              />
            </svg>
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
          <div className="max-w-[850px] mt-[142px] mb-[130px] flex flex-wrap justify-center z-10">
            <div className={styles.title}>Congratulations!</div>
            <div className={styles.text}>
              Your NFT collection has been minted successfully and can be viewed on the&nbsp;
              <a className={styles.mintLinkText} href={'/browse-collection/' + collectionNft.mintAddress.toBase58()}>
                collection page
              </a>
            </div>
            <div className="max-w-[758px] w-full flex justify-between gap-[30px] mt-[60px]">
              <div className="w-full">
                <TwitterShareButton
                  title="Just minted a fresh collection on @foster_protocol #fostermarketplace"
                  url={collectionDetailUrl}
                  beforeOnClick={() => {}}
                  onShareWindowClose={() => {}}
                  className="w-full"
                >
                  <TweetMintButton
                    fullWidth
                    label="Tweet your Mint"
                    color={'var(--mint-btn-color)'}
                    backgroundColor="#378287"
                    onClick={() => {}}
                    direction="rtl"
                  />
                </TwitterShareButton>
              </div>
              <div className="w-full">
                <OutlineButton
                  fullWidth
                  label="View Dashboard"
                  backgroundColor="transparent"
                  height="68px"
                  fontSize="22px"
                  onClick={() => router.push('/dashboard')}
                  borderColor={'var(--outline-button-border)'}
                />
              </div>
            </div>
            <div className="mt-[44px]">
              <LinkTextButton label="View on SolanaFM" link={explorerURL} />
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
            <div className={styles.text}>
              Your NFT collection has been minted successfully and can be viewed on the&nbsp;
              <a className={styles.mintLinkText} href={'/browse-collection/' + collectionNft.mintAddress.toBase58()}>
                collection page
              </a>
            </div>
            <div className="w-full flex flex-wrap justify-center gap-[30px] mt-[60px]">
              <div className="w-[221px]">
                <TwitterShareButton
                  title="Just minted a fresh collection on @foster_protocol #fostermarketplace"
                  url={collectionDetailUrl}
                  beforeOnClick={() => {}}
                  onShareWindowClose={() => {}}
                  className="w-full"
                >
                  <TweetMintButton
                    fullWidth
                    label="Tweet your Mint"
                    color={'var(--mint-btn-color)'}
                    backgroundColor="#378287"
                    onClick={() => {}}
                    direction="rtl"
                  />
                </TwitterShareButton>
              </div>
              <div className="w-[221px]">
                <MintOutlineButton
                  fullWidth
                  label="View Dashboard"
                  backgroundColor="#63D6CD"
                  onClick={() => router.push('/dashboard')}
                  borderColor={'var(--outline-button-border)'}
                />
              </div>
            </div>
            <div className="mt-[33px]">
              <LinkTextButton label="View on SolanaFM" link={explorerURL} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SuccessMintCollectionSection
