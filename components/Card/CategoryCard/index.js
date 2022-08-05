import React from 'react'

// next components
import Image from 'next/image'

// styles
import styles from './index.module.scss'

// images and icons
import LogoGrayIcon from 'assets/icons/logo-gray.svg'

const CategoryCard = props => {
  const { image, name, type = 'image', nfts, collections, onClick } = props
  return (
    <div className={styles.container} onClick={() => onClick()}>
      {type === 'image' ? (
        <Image
          src={image}
          alt=""
          width={359}
          height={490}
          layout="responsive"
          objectFit="cover"
          className="rounded-[30px]"
        />
      ) : (
        <video autoPlay loop muted>
          <source type="video/mp4" src={image} />
        </video>
      )}
      <div className={styles.bottomMask}></div>
      <div className={styles.bottomSection}>
        <div className={styles.name}>{name}</div>
        <div className={styles.logoIcon}>
          <Image src={LogoGrayIcon} alt="" width={22} height={25} />
        </div>

        {/* <div className="flex w-full">
          <div className={styles.nftTitle}>NFTs:</div>
          <div className={`${styles.nftValue} ml-[4px]`}>{nfts}</div>
        </div>
        <div className="hidden lg:flex w-full">
          <div className={styles.nftTitle}>Collections:</div>
          <div className={`${styles.nftValue} ml-[4px]`}>{collections}</div>
        </div> */}
      </div>
    </div>
  )
}

export default CategoryCard
