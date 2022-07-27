import React from 'react'

// next components
import Image from 'next/image'

// styles
import styles from './index.module.scss'

const HeroCard = props => {
  const { image, nftName, collectionName, avatar, artistName, viewport } = props
  return (
    <div className={styles.container}>
      <Image
        src={image}
        alt=""
        width={viewport === 'sm' ? 343 : viewport === 'md' ? 400 : 550}
        height={viewport === 'sm' ? 120 : viewport === 'md' ? 200 : 772}
        layout="responsive"
        objectFit="cover"
        className="rounded-[10px] lg:rounded-[30px]"
      />
      {viewport === 'xs' || viewport === 'md' || viewport === 'sm' ? (
        <></>
      ) : (
        <div className={styles.bottomSection}>
          <div className="flex justify-between">
            <div>
              <div className={styles.nftName}>{nftName}</div>
              <div className={`hidden lg:flex ${styles.collectionName}`}>{collectionName}</div>
            </div>
            <div className="flex justify-start items-center lg:mt-[10px]">
              <div className={styles.avatar}>
                <Image
                  src={avatar}
                  alt=""
                  width={viewport === 'lg' ? 40 : 60}
                  height={viewport === 'lg' ? 40 : 60}
                  layout="responsive"
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
              {viewport === 'lg' ? (
                <></>
              ) : (
                <div className="block ml-4">
                  <div className={styles.artistName}>{artistName}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HeroCard
