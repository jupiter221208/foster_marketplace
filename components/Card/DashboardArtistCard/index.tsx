import React, { useState } from 'react'

// styles
import styles from './index.module.scss'
import ReactPlaceholder from 'react-placeholder/lib'
import 'react-placeholder/lib/reactPlaceholder.css'

const DashboardArtistCard = props => {
  const { image } = props
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={styles.container}>
      <div className={styles.avatarArea}>
        <div className={styles.avatar}>
          {!loaded && (
            <div className="w-full h-full overflow-hidden rounded-full">
              <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={loaded} color="#202427">
                <div></div>
              </ReactPlaceholder>
            </div>
          )}
          <img src={image} alt="" className="w-full h-full object-cover rounded-full" onLoad={() => setLoaded(true)} />
        </div>
      </div>
    </div>
  )
}

export default DashboardArtistCard
