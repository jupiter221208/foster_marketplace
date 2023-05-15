import React, { useState } from 'react'

// custom functions
import { useViewport } from 'utils'

// next components
import Image from 'next/image'

// styles
import styles from './index.module.scss'
import { validUrl } from 'utils/helpers'

import InstagramIcon from 'assets/icons/social-ig-mobile.svg?component'
import TwitterIcon from 'assets/icons/social-twitter-mobile.svg?component'
import ReactPlaceholder from 'react-placeholder/lib'

const ProfileArtistCard = props => {
  const { image, name, ig_url, twitter_url } = props
  const viewport = useViewport()
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={styles.container}>
      <div className={styles.avatarArea}>
        <div className="w-[90px] h-[90px] lg:w-[152px] lg:h-[152px] rounded-full overflow-hidden">
          {!loaded && (
            <div className="w-full h-full overflow-hidden rounded-full">
              <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={loaded} color="#202427">
                <div></div>
              </ReactPlaceholder>
            </div>
          )}
          <Image
            src={image}
            alt=""
            width={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? 152 : 90}
            height={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? 152 : 90}
            className="rounded-full"
            onLoadingComplete={() => setLoaded(true)}
          />
        </div>
      </div>
      {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
        <div className={styles.name}>
          {name}
          <div className="w-full flex gap-[10px] items-center ml-[9px]">
            {ig_url !== null && (
              <div>
                <InstagramIcon onClick={() => window.open(validUrl(ig_url))} />
              </div>
            )}
            {twitter_url !== null && (
              <div>
                <TwitterIcon onClick={() => window.open(validUrl(twitter_url))} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.name}>{name}</div>
      )}
    </div>
  )
}

export default ProfileArtistCard
