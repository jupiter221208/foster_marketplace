import React from 'react'

// next components
import Image from 'next/image'

// styles
import styles from './index.module.scss'

// images and icons
import LogoGrayIcon from 'assets/icons/logo-gray.svg'

const CategoryCard = props => {
  const { viewport, image, name, type = 'image', nfts, collections, onClick } = props
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
      ) : viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
        <div
          dangerouslySetInnerHTML={{
            __html: `<video className="app__backgroundVideo" autoplay loop muted playsinline>
                  <source src=${image} type="video/mp4" /></video>`,
          }}
        />
      ) : (
        <video autoPlay loop muted>
          <source type="video/mp4" src={image} />
        </video>
      )}
      <div className={styles.bottomSection}>
        <div className={styles.name}>{name}</div>

        <div className={styles.bottomMask}></div>

        <div className={styles.logoIcon}>
          <Image src={LogoGrayIcon} alt="" width={22} height={25} />
        </div>
      </div>
    </div>
  )
}

export default CategoryCard
