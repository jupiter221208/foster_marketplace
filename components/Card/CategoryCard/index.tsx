import React from 'react'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'
import ImageWithFoster from 'components/ImageWithFoster'

const CategoryCard = props => {
  const { image, name, type = 'image', onClick } = props
  const viewport = useViewport()

  return (
    <div className={styles.container} onClick={() => onClick()}>
      {type === 'image' ? (
        <ImageWithFoster src={image} className="w-full h-full rounded-[30px] object-cover" />
      ) : viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
        <ImageWithFoster src={image} className="rounded-[29px] object-cover" />
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
