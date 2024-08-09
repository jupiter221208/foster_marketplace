import React, { useState } from 'react'

// next components

// third party components

// images and icons
import FosterIcon from 'assets/icons/foster-icon-13x15.svg?component'
import ProfileIcon from 'assets/icons/profile-icon-12x15.svg?component'

// styles
import styles from './index.module.scss'

interface MenuSocialShareProps {
  type: any
}

const MerchTypeIconMenu = ({ type }: MenuSocialShareProps) => {
  const [showTooltip, setShowTooltip] = useState(false)
  return (
    <div className="relative flex items-center">
      <div>
        <div onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
          <div className={styles.iconContainer}>{type === 'foster' ? <FosterIcon /> : <ProfileIcon />}</div>
        </div>

        {showTooltip && (
          <div
            className={styles.menuArea}
            style={{
              width: type === 'foster' ? 180 : type === 'user' ? 120 : 270,
            }}
          >
            <div className={styles.menuItem}>
              {type === 'foster'
                ? 'Foster-Fulfilled Product'
                : type === 'user'
                ? 'User Physical'
                : 'Included with purchase of an edition'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MerchTypeIconMenu
