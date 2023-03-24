import React from 'react'

// next components
import Image from 'next/image'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'

// images and icons
import LogoGrayIcon from 'assets/icons/logo-gray.svg'

const CategoryCard = props => {
  const { image, name, type = 'image', onClick } = props
  const viewport = useViewport()

  return (
    <div className={styles.container} onClick={() => onClick()}>
      {type === 'image' ? (
        <img src={image} alt="" className="w-full rounded-[30px] object-cover" />
      ) : viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
        // <div
        //   dangerouslySetInnerHTML={{
        //     __html: `<video autoplay loop muted webkit-playsinline playsinline style="width: 100%">
        //           <source src=${image} type="video/mp4" /></video>`,
        //   }}
        // />
        <img src={image} alt="" className="rounded-[29px] object-cover" />
      ) : (
        <video autoPlay loop muted>
          <source type="video/mp4" src={image} />
        </video>
      )}
      <div className={styles.bottomSection}>
        <div className={styles.name}>{name}</div>

        <div className={styles.bottomMask}></div>

        {/* <div className={styles.logoIcon}>
          <Image src={LogoGrayIcon} alt="" width={22} height={25} />
        </div> */}
      </div>
    </div>
  )
}

export default CategoryCard
