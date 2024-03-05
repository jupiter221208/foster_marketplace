import React from 'react'

// styles
import styles from './index.module.scss'
import ImageWithFoster from 'components/ImageWithFoster'

const StudioCard = props => {
  const { data, onSelected } = props
  return (
    <div className={styles.container}>
      <div
        className={styles.imageContainer}
        onClick={() => onSelected(data.type, data.bases[0].name, data.bases[0].base)}
      >
        <div className={styles.imageStatus}>
          <ImageWithFoster showPlaceHolder={false} src={data['asset_url']} className="object-cover w-full h-full" />
        </div>

        <div className={styles.titleContainer}>
          <div className={styles.titleText}>{data.name}</div>
        </div>
      </div>
      <div className="lg:block hidden">
        <div className={styles.baseContainer}>
          <div className={styles.baseText}>
            {data.bases.map((item, index) => (
              <div
                key={index}
                className={item.selected === 'true' ? styles.selected : styles.deselected}
                onClick={() => onSelected(data.type, item.name, item.base)}
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudioCard
