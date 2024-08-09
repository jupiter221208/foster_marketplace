import React, { useState } from 'react'

// next components

// third party components

// images and icons
import FosterIcon from 'assets/icons/foster-icon-13x15.svg?component'
import ProfileIcon from 'assets/icons/profile-icon-12x15.svg?component'
import EditionIcon from 'assets/icons/edition-icon-15x15.svg?component'
import TimerIcon from 'assets/icons/clock-sand-8x15.svg?component'

// styles
import styles from './index.module.scss'

interface MenuSocialShareProps {
  type: any
  timeLeft: any
}

const MerchTypeIconMenu = ({ type, timeLeft = null }: MenuSocialShareProps) => {
  const [showTooltip, setShowTooltip] = useState(false)
  return (
    <div className="relative flex items-center">
      <div>
        <div onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
          <div className={styles.iconContainer}>
            {type === 'foster' ? (
              <FosterIcon />
            ) : type === 'user' ? (
              <ProfileIcon />
            ) : type === 'edition' ? (
              <EditionIcon />
            ) : (
              <TimerIcon />
            )}
          </div>
        </div>

        {showTooltip && (
          <div
            className={styles.menuArea}
            style={{
              width: type === 'foster' ? 180 : type === 'user' ? 115 : type === 'edition' ? 270 : 200,
            }}
          >
            <div className={styles.menuItem}>
              {type === 'timer' ? (
                <div className="flex gap-[6px]">
                  <div className={styles.timeLabel}>Ends in</div>
                  <div className="flex gap-[4px]">
                    {timeLeft && timeLeft['days'] !== '00' && (
                      <div className="flex block justify-center gap-[1px]">
                        <div className={styles.menuItem}>{timeLeft['days']}</div>
                        <div className={styles.menuItem}>d</div>
                      </div>
                    )}
                    {timeLeft && timeLeft['hours'] !== '00' && (
                      <div className="flex block justify-center gap-[1px]">
                        <div className={styles.menuItem}>{timeLeft['hours']}</div>
                        <div className={styles.menuItem}>h</div>
                      </div>
                    )}
                    {timeLeft && timeLeft['minutes'] !== '00' && (
                      <div className="flex block justify-center gap-[1px]">
                        <div className={styles.menuItem}>{timeLeft && timeLeft['minutes']}</div>
                        <div className={styles.menuItem}>m</div>
                      </div>
                    )}
                    {timeLeft && timeLeft['seconds'] !== '00' && (
                      <div className="flex block justify-center gap-[1px]">
                        <div className={styles.menuItem}>{timeLeft && timeLeft['seconds']}</div>
                        <div className={styles.menuItem}>s</div>
                      </div>
                    )}
                  </div>
                </div>
              ) : type === 'foster' ? (
                'Foster-Fulfilled Product'
              ) : type === 'user' ? (
                'User Physical'
              ) : (
                'Included with purchase of an edition'
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MerchTypeIconMenu
