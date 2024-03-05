import React from 'react'

// styles
import styles from './index.module.scss'
import 'react-placeholder/lib/reactPlaceholder.css'
import ImageWithFoster from 'components/ImageWithFoster'

const DashboardArtistCard = props => {
  const { image } = props

  return (
    <div className={styles.container}>
      <div className={styles.avatarArea}>
        <div className={styles.avatar}>
          <ImageWithFoster src={image} className="w-full h-full object-cover rounded-full" />
        </div>
      </div>
    </div>
  )
}

export default DashboardArtistCard
