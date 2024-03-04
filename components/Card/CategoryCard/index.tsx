import React from 'react'

// next components
import Image from 'next/image'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'
import ImageWithFallback from 'components/ImageWithFallback'

const CategoryCard = props => {
  const { image, name, type = 'image', onClick } = props
  const viewport = useViewport()

  return (
    <div className={styles.container} onClick={() => onClick()}>
      {type === 'image' ? (
        <ImageWithFallback
          src={image}
          alt=""
          width={359}
          height={490}
          layout="responsive"
          className="w-full h-full rounded-[30px] object-cover"
        />
      ) : viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
        <ImageWithFallback src={image} alt="" layout="fill" className="rounded-[29px] object-cover" />
      ) : (
        <video autoPlay loop muted>
          <source type="video/mp4" src={image} />
        </video>
      )}
      <div className={styles.bottomSection}>
        <div className={styles.name}>{name}</div>
        <div className={styles.bottomMask}></div>
      </div>
    </div>
  )
}

export default CategoryCard
