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
import ReactPlaceholder from 'react-placeholder/lib'
import 'react-placeholder/lib/reactPlaceholder.css'

import IconButton from 'components/Button/IconButton'

const ProfileArtistCard = props => {
  const { isOwn, image, name, ig_url, twitter_url, avatarUploadingToS3, handleChangeAvatar, setFullScreenView } = props
  const viewport = useViewport()
  const [loaded, setLoaded] = useState(false)
  const inputAvatarFile = useRef<any>(null)

  return (
    <div className={styles.container}>
      <div className={styles.avatarArea}>
        <div className="relative w-[90px] h-[90px] lg:w-[152px] lg:h-[152px] rounded-full overflow-hidden">
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
            onClick={setFullScreenView}
          />
          {isOwn && (
            <div className="absolute bottom-1 lg:bottom-4 right-1 lg:right-4 cursor-pointer z-20">
              <div className={styles.iconProfileBlurView}>
                <IconButton
                  icon={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? EditorGreenIcon : CameraWhiteIcon}
                  onClick={() => inputAvatarFile.current.click()}
                  backgroundColor={'transparent'}
                  borderRadius="100%"
                  width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '32px' : '46px'}
                  height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '32px' : '46px'}
                  iconWidth={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 20 : 46}
                  iconHeight={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 20 : 46}
                  disabled={avatarUploadingToS3}
                />
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
