import React, { useRef } from 'react'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'
import DefaultAvatar from 'assets/images/dashboard-avatar.png'

import EditorGreenIcon from 'assets/icons/editor-white.svg?component'
import 'react-placeholder/lib/reactPlaceholder.css'

import { getDisplayUserName } from 'utils/strings'
import IconButtonWithSVG from 'components/Button/IconButtonWithSVG'

const ProfileArtistCard = props => {
  const { isOwn, image, name, avatarUploadingToS3, handleChangeAvatar, setFullScreenView, hasLoading } = props
  const viewport = useViewport()
  const inputAvatarFile = useRef<any>(null)

  return (
    <div className={styles.container}>
      <div className={styles.avatarArea}>
        <div className="relative w-[90px] h-[90px] lg:w-[152px] lg:h-[152px] rounded-full ">
          <div className="relative w-full h-full">
            {image !== '' ? (
              <img src={image} alt="" className="w-full h-full rounded-full" onClick={setFullScreenView} />
            ) : !hasLoading ? (
              <img src={DefaultAvatar.src} alt="" className="w-full h-full rounded-full" onClick={setFullScreenView} />
            ) : (
              <></>
            )}

            {hasLoading && (
              <div className={styles.profileBG}>
                <div
                  className={`${styles.skeletonLoader} w-[90px] h-[90px] lg:w-[152px] lg:h-[152px] rounded-full`}
                ></div>
              </div>
            )}
          </div>

          {!hasLoading && isOwn && (
            <div className="absolute bottom-0 lg:bottom-1 -right-2 lg:-right-2 cursor-pointer z-20">
              <div className={styles.iconProfileBlurView}>
                <div className="w-full h-full flex justify-center items-center">
                  <IconButtonWithSVG
                    icon={<EditorGreenIcon />}
                    onClick={() => inputAvatarFile.current.click()}
                    backgroundColor="transparent"
                    borderRadius="100%"
                    width={40}
                    height={40}
                    iconWidth={40}
                    iconHeight={40}
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
      </div>

      {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
        hasLoading ? (
          <div className={`${styles.skeletonLoader} ${styles.name} w-[250px] h-[22px] rounded-full mt-[15px]`}></div>
        ) : (
          <div className={styles.name}>{getDisplayUserName(name)}</div>
        )
      ) : hasLoading ? (
        <div className={`${styles.skeletonLoader} ${styles.name} w-[150px] h-[22px] rounded-full`}></div>
      ) : (
        <div className={styles.name}>{getDisplayUserName(name)}</div>
      )}
    </div>
  )
}

export default ProfileArtistCard
