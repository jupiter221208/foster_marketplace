import React, { useMemo } from 'react'

// next components
import Image from 'next/image'

// components
import GradientButton from 'components/Button/GradientButton'
import OutlineButton from 'components/Button/OutlineButton'
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

//explorer
import { getExplorerUrl } from 'utils/explorer'
import { useConnection } from '@solana/wallet-adapter-react'

const SuccessMintSingleNFTSection = props => {
  const { nftType, nftArt, nftImage, artWidth, nftAddress, artHeight, reset } = props

  const viewport = useViewport()

  const { connection } = useConnection()
  const explorerURL = useMemo(() => getExplorerUrl(connection.rpcEndpoint, nftAddress), [nftAddress, connection])

  return viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
    <div className={`relative g-container w-full flex flex-wrap justify-center ${styles.congratelationsArea}`}>
      <div className={styles.topLeftEllipse}>
        <Image src={EllipseGreen} alt="" objectFit="cover" />
      </div>
      <div className="w-full flex flex-wrap justify-center items-center mt-10 lg:mt-20 z-10">
        {nftType === 'image' ? (
          <div
            className={`${styles.artArea}`}
            style={{ width: artWidth + 24, height: artHeight + 24, padding: '12px' }}
          >
            {nftImage !== '' && artWidth !== 0 && artHeight !== 0 ? (
              <img src={nftImage} alt="" className="w-full h-full object-contain" />
            ) : (
              <div
                className={`${styles.artArea}`}
                style={{ width: artWidth + 24, height: artHeight + 24, padding: '!2px' }}
              />
            )}
          </div>
        ) : (
          <div
            className={`${styles.artArea}`}
            style={{ width: artWidth + 24, height: artHeight + 24, padding: '12px' }}
          >
            {nftImage !== '' && artWidth !== 0 && artHeight !== 0 ? (
              <img src={nftImage} alt="" className="w-full h-full rounded-[6px] object-contain" />
            ) : (
              <div
                className={`${styles.artArea}`}
                style={{ width: artWidth + 12, height: artHeight + 12, padding: '6px' }}
              />
            )}
          </div>
        )}
      </div>
      <div className="w-full flex justify-center">
        {nftType === 'video' && (
          <div className="w-full max-w-[392px] h-full mt-4">
            <video controls className="w-full">
              <source src={URL.createObjectURL(nftArt[0])} type={nftArt[0].type} />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {nftType === 'audio' && (
          <div className="w-full max-w-[392px] mt-4">
            <audio controls className="w-full">
              <source src={URL.createObjectURL(nftArt[0])} type={nftArt[0].type} />
              Your browser does not support the video tag.
            </audio>
          </div>
        )}
      </div>
      <div className="max-w-[758px] mt-6 mb-[130px] flex flex-wrap justify-center z-10">
        <div className={styles.mintTitle}>Congratulations!</div>
        <div className={styles.mintText}>
          Your NFT has been minted successfully and can be biewed on the{' '}
          <LinkTextButton label="NFT page" link={'/browse-nft/' + nftAddress.toBase58()} />!
        </div>
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
              onClick={reset}
              borderColor="#5AC3BA"
            />
          </div>
        </div>
        <div className="mt-[44px]">
          <LinkTextButton label="View on Solscan" link={explorerURL} />
        </div>
      </div>
    </div>
  ) : (
    <div className={`relative g-container w-full flex flex-wrap justify-center ${styles.congratelationsArea}`}>
      <div className="w-full flex justify-center items-center z-10 mt-10">
        <div className="z-10">
          <div className="w-full rounded-[16px] overflow-hidden">
            {nftType === 'image' ? (
              <div
                className={`${styles.artArea}`}
                style={{ width: artWidth + 12, height: artHeight + 12, padding: '6px' }}
              >
                {nftImage !== '' && artWidth !== 0 && artHeight !== 0 ? (
                  <img src={nftImage} alt="" className="w-full h-full rounded-[6px] object-contain" />
                ) : (
                  <div
                    className={`${styles.artArea}`}
                    style={{ width: artWidth + 12, height: artHeight + 12, padding: '6px' }}
                  />
                )}
              </div>
            ) : (
              <div
                className={`${styles.artArea}`}
                style={{ width: artWidth + 12, height: artHeight + 12, padding: '6px' }}
              >
                {nftImage !== '' && artWidth !== 0 && artHeight !== 0 ? (
                  <img src={nftImage} alt="" className="w-full h-full rounded-[6px] object-contain" />
                ) : (
                  <div
                    className={`${styles.artArea}`}
                    style={{ width: artWidth + 12, height: artHeight + 12, padding: '6px' }}
                  />
                )}
              </div>
            )}
            {nftType === 'video' && (
              <div className="w-full h-full mt-4">
                <video controls className="w-full">
                  <source src={URL.createObjectURL(nftArt[0])} type={nftArt[0].type} />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

            {nftType === 'audio' && (
              <div className="w-full mt-4">
                <audio controls className="w-full">
                  <source src={URL.createObjectURL(nftArt[0])} type={nftArt[0].type} />
                  Your browser does not support the video tag.
                </audio>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-full mt-6 mb-[90px] flex flex-wrap justify-center z-10">
        <div className={styles.mintTitle}>Congratulations!</div>
        <div className={styles.mintText}>
          Your NFT has been minted successfully and can be biewed on the{' '}
          <LinkTextButton label="NFT page" link={'/browse-nft/' + nftAddress.toBase58()} />!
        </div>
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
              onClick={reset}
              borderColor="#5AC3BA"
            />
          </div>
        </div>
        <div className="mt-[33px]">
          <LinkTextButton label="View on Solscan" link={explorerURL} />
        </div>
      </div>
    </div>
  )
}

export default SuccessMintSingleNFTSection
