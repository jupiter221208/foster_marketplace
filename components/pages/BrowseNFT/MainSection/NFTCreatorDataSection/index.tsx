import React from 'react'

import Link from 'next/link'
// components

// utilies
import { getDisplayUserName } from 'utils/strings'

// resources
import DefaultAvatar from 'assets/images/dashboard-avatar.png'

// styles
import styles from './index.module.scss'

import ImageWithFoster from 'components/ImageWithFoster'

const NFTCreatorDataSection = props => {
  const { nftCreatorname, nftCollectionAddress, nftCollectionName, nftCollectionImage, profileImage } = props

  return (
    <div>
      <>
        <div className="mt-[30px] flex gap-[30px] flex-wrap">
          <Link href={`/${nftCreatorname}`} passHref>
            <a>
              <div>
                <div className={styles.creator}>Creator</div>
                <div className={styles.userTile}>
                  <div className="flex gap-[6px] items-center">
                    <div className="w-[30px] h-[30px] rounded-full overflow-hidden">
                      {profileImage?.length > 0 ? (
                        <ImageWithFoster src={profileImage} width={60} className="w-full h-full object-cover" />
                      ) : (
                        <img src={DefaultAvatar.src} alt="" />
                      )}
                    </div>
                    <div className={styles.username}>{getDisplayUserName(nftCreatorname)}</div>
                  </div>
                </div>
              </div>
            </a>
          </Link>

          {nftCollectionAddress && (
            <Link href={`/collection/${nftCollectionAddress}`} passHref>
              <a>
                <div>
                  <div className={styles.creator}>Collection</div>
                  <div className={styles.userTile}>
                    <div className="flex gap-[6px] items-center">
                      <div className="min-w-[30px] w-[30px] h-[30px] rounded-full overflow-hidden">
                        <ImageWithFoster src={nftCollectionImage} width={60} className="w-full h-full object-cover" />
                      </div>
                      <div className={styles.username}>{getDisplayUserName(nftCollectionName)}</div>
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          )}
        </div>
        {/* <div className="w-full flex flex-wrap mt-[9px] lg:mt-[6px] gap-x-[14px] lg:gap-x-[34px]">
            <div className="flex gap-1 lg:gap-2">
              <div className={styles.grayText}>Created by</div>
              <Link href={`/${nftCreatorname}`} passHref>
                <a>
                  <div className={styles.greenText} onClick={() => gotoUserDetail(nftCreatorname)}>
                    {getDisplayUserName(nftCreatorname)}
                  </div>
                </a>
              </Link>
            </div>

            {nftOwnerUsername.length > 0 && nftOwnerUsername !== nftCreatorname && (
              <div className="flex gap-1 lg:gap-2">
                <div className={styles.grayText}>Fostered by</div>
                <Link href={`/${nftOwnerUsername}`} passHref>
                  <a>
                    <div className={styles.greenText} onClick={() => gotoUserDetail(nftOwnerUsername)}>
                      {getDisplayUserName(nftOwnerUsername)}
                    </div>
                  </a>
                </Link>
              </div>
            )}
          </div> */}
      </>
    </div>
  )
}

export default NFTCreatorDataSection
