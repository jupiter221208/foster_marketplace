import React from 'react'
import 'react-placeholder/lib/reactPlaceholder.css'
import Link from 'next/link'

// next components
import Image from 'next/image'

// custom functions

// images and icons
import DefaultNftBG from 'assets/images/default-nft-bg.png'

// styles
import styles from './index.module.scss'

import { getDisplayUserName, getShortName } from 'utils/strings'
import ImageWithFoster from 'components/ImageWithFoster'

const NFTStudioCard = props => {
  const { token_id, image, nftName, coverImage = '', fallBack, artistName, onClick } = props

  return (
    <div className="w-full h-full relative lg:p-[3px] flex justify-center">
      <div className={styles.container}>
        <div className={styles.imageArea}>
          <Link href={`${window.origin}/nft/${token_id}`} passHref>
            <a>
              <div className={styles.imageContent}>
                {coverImage !== null && coverImage !== '' ? (
                  <div className="w-full h-full">
                    <ImageWithFoster
                      src={coverImage}
                      width={800}
                      originalSrc={fallBack}
                      onClick={onClick}
                      className="max-w-full max-h-full object-cover"
                    />
                  </div>
                ) : image !== null && image !== '' ? (
                  <div className="w-full h-full">
                    <ImageWithFoster
                      src={image}
                      width={800}
                      originalSrc={fallBack}
                      onClick={onClick}
                      className="max-w-full max-h-full object-cover"
                    />
                  </div>
                ) : (
                  <Image src={DefaultNftBG} alt="" className={styles.imageNft} onClick={() => onClick()} />
                )}
              </div>
            </a>
          </Link>
        </div>

        <div className={styles.imageInfo}>
          <div className={styles.nftData}>
            <div>
              <div className={styles.nftName}>{getShortName(nftName, 24)}</div>
              <div className="w-full flex justify-between">
                <div className={styles.artistName}>{getDisplayUserName(artistName)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NFTStudioCard
