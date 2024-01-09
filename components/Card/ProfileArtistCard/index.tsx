import React, { useState, useRef } from 'react'

// custom functions
import { useViewport } from 'utils'

// next components
import Image from 'next/image'

// styles
import styles from './index.module.scss'
import { validUrl } from 'utils/helpers'

import CameraWhiteIcon from 'assets/icons/camera-white.svg'
import EditorGreenIcon from 'assets/icons/editor-green.svg'
import InstagramIcon from 'assets/icons/social-ig-mobile.svg?component'
import TwitterIcon from 'assets/icons/social-twitter-mobile.svg?component'
import WebsiteIcon from 'assets/icons/website-icon-mobile.svg?component'
import LandIcon from 'assets/icons/land-icon.svg?component'
import SolrPlexIcon from 'assets/icons/solrplex-icon.svg?component'
import ReactPlaceholder from 'react-placeholder/lib'
import 'react-placeholder/lib/reactPlaceholder.css'

import IconButton from 'components/Button/IconButton'
import { getShortAddress } from 'utils/strings'

const ProfileArtistCard = props => {
  const {
    isOwn,
    image,
    name,
    ig_url,
    twitter_url,
    site_url,
    solarplex_url,
    three_land_url,
    avatarUploadingToS3,
    handleChangeAvatar,
    setFullScreenView,
    hasLoading,
  } = props
  const viewport = useViewport()
  const [loaded, setLoaded] = useState(false)
  const inputAvatarFile = useRef<any>(null)

  return (
    <div className={styles.container}>
      <div className={styles.avatarArea}>
        {hasLoading ? (
          <div className={`${styles.skeletonLoader} ${styles.avatarArea}`}></div>
        ) : (
          <div className="relative w-[90px] h-[90px] lg:w-[152px] lg:h-[152px] rounded-full ">
            {/* {!loaded && (
              <div className="w-full h-full overflow-hidden rounded-full">
                <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={loaded} color="#202427">
                  <div></div>
                </ReactPlaceholder>
              </div>
            )} */}
            <Image
              src={image}
              alt=""
              width={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? 152 : 90}
              height={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? 152 : 90}
              className="rounded-full"
              onLoadingComplete={() => setLoaded(true)}
              onClick={setFullScreenView}
            />
            {isOwn && (
              <div className="absolute bottom-1 lg:bottom-1 -right-2 lg:-right-2 cursor-pointer z-20">
                <div className={styles.iconProfileBlurView}>
                  <div className="w-full h-full flex justify-center items-center">
                    <IconButton
                      icon={EditorGreenIcon}
                      onClick={() => inputAvatarFile.current.click()}
                      backgroundColor={'transparent'}
                      borderRadius="100%"
                      width={20}
                      height={20}
                      iconWidth={20}
                      iconHeight={20}
                      disabled={avatarUploadingToS3}
                    />
                  </div>
                </div>
                <input
                  type="file"
                  id="avatar-file"
                  accept="image/png, image/jpeg, image/gif"
                  ref={inputAvatarFile}
                  style={{ display: 'none' }}
                  onChange={event => handleChangeAvatar(event)}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
        hasLoading ? (
          <div className={`${styles.skeletonLoader} ${styles.name} w-[250px] h-[22px] rounded-full mt-[15px]`}></div>
        ) : (
          <div className={styles.name}>
            {name.length >= 40 ? getShortAddress(name) : name}
            <div className="w-full flex gap-[10px] items-center ml-[9px]">
              {ig_url !== null && ig_url !== undefined && ig_url.length > 0 && (
                <div>
                  <InstagramIcon onClick={() => window.open(validUrl(ig_url))} />
                </div>
              )}
              {twitter_url !== null && twitter_url !== undefined && twitter_url.length > 0 && (
                <div>
                  <TwitterIcon onClick={() => window.open(validUrl(twitter_url))} />
                </div>
              )}
              {site_url !== null && site_url !== undefined && site_url.length > 0 && (
                <div>
                  <WebsiteIcon onClick={() => window.open(validUrl(site_url))} />
                </div>
              )}
              {three_land_url !== null && three_land_url !== undefined && three_land_url.length > 0 && (
                <div>
                  <LandIcon onClick={() => window.open(validUrl(three_land_url))} />
                </div>
              )}
              {solarplex_url !== null && solarplex_url !== undefined && solarplex_url.length > 0 && (
                <div>
                  <SolrPlexIcon onClick={() => window.open(validUrl(solarplex_url))} />
                </div>
              )}
            </div>
          </div>
        )
      ) : hasLoading ? (
        <div className={`${styles.skeletonLoader} ${styles.name} w-[150px] h-[22px] rounded-full`}></div>
      ) : (
        <div className={styles.name}>{name.length >= 40 ? getShortAddress(name) : name}</div>
      )}
    </div>
  )
}

export default ProfileArtistCard
