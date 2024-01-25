import React from 'react'

// next components
import Image from 'next/image'
import Link from 'next/link'

// custom functions
import { useViewport } from 'utils'
import { useDispatch } from 'react-redux'

// images and icons
import AvatarImage from 'assets/images/dashboard-avatar.png'
import BannerImage from 'assets/images/avatar-banner.png'

// styles
import styles from './index.module.scss'
import { getDisplayUserName } from 'utils/strings'

const EcosystemCard = props => {
  const { data } = props
  const viewport = useViewport()
  const dispatch = useDispatch()
  return (
    <Link href={`/${data.artist.username}`} passHref>
      <a>
        <div
          className={styles.container}
          onClick={() => {
            dispatch({ type: 'set', isLoading: true })
          }}
        >
          <div className="relative flex">
            <div className="w-full overflow-hidden">
              <Image
                src={data.artist.banner_picture ?? BannerImage}
                alt=""
                width={480}
                height={172}
                layout="responsive"
                objectFit="cover"
              />
            </div>
            <div className={styles.avatarArea}>
              <div className="w-full flex justify-center itmes-cneter rounded-full overflow-hidden">
                {data.artist.profile_picture ? (
                  <Image
                    src={data.artist.profile_picture}
                    width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' || viewport === 'xl' ? 100 : 136}
                    height={
                      viewport === 'xs' || viewport === 'sm' || viewport === 'md' || viewport === 'xl' ? 100 : 136
                    }
                    className="rounded-full"
                    alt=""
                  />
                ) : (
                  <div className="w-full flex justify-center itmes-cneter rounded-full overflow-hidden bg-tansparent">
                    <Image
                      src={AvatarImage}
                      width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 100 : 136}
                      height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 100 : 136}
                      className="rounded-full"
                      alt=""
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="w-full flex justify-end mt-[10px] items-center">
            <div className="w-[60%] flex">
              <div className="w-full flex justify-end gap-[18px] mr-[18px]">
                <div className="flex items-center gap-2">
                  <div className={styles.text}>{data.number_of_categories ?? 0}</div>
                  <div className={styles.title}>Collections</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={styles.text}>{data.number_of_nfts ?? 0}</div>
                  <div className={styles.title}>Artworks</div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full mt-[35px] flex justify-center mb-[25px]">
            <div className={styles.artistName}>
              {data.artist.username ? getDisplayUserName(data.artist.username) : 'Ecosystem'}
            </div>
          </div>
        </div>
      </a>
    </Link>
  )
}

export default EcosystemCard
