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
          <div className="relative flex justify-center">
            <div className="w-full rounded-[10px] lg:rounded-[24px] overflow-hidden">
              <Image
                src={data.artist.banner_picture ?? BannerImage}
                alt=""
                width={321}
                height={256}
                layout="responsive"
                objectFit="cover"
              />
            </div>
            <div className={styles.avatarArea}>
              <div className="w-[100px] lg:w-[180px] h-[100px] lg:h-[180px] rounded-full overflow-hidden">
                {data.artist.profile_picture ? (
                  <Image
                    src={data.artist.profile_picture}
                    width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 100 : 180}
                    height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 100 : 180}
                    className="rounded-full"
                    alt=""
                  />
                ) : (
                  <div className="w-[100px] lg:w-[180px] h-[100px] lg:h-[180px] overflow-hidden rounded-[50px] lg:rounded-[90px] bg-tansparent">
                    <Image
                      src={AvatarImage}
                      width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 100 : 180}
                      height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 100 : 180}
                      className="rounded-full"
                      alt=""
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="w-full lg:mt-[100px] xs:mt-[50px] flex flex-wrap justify-center items-center px-[9px]">
            <div className="w-full flex justify-center items-center">
              <div className={styles.artistName}>
                {data.artist.username ? getDisplayUserName(data.artist.username) : 'Ecosystem'}
              </div>
            </div>
          </div>
          <div className={styles.contentCard}>
            <div className="w-full flex flex-wrap justify-between">
              <div>
                <div className="flex justify-center">
                  <div className={styles.text}>{data.number_of_categories ?? 0}</div>
                </div>
                <div className={styles.title}>Collections</div>
              </div>
              <div className={styles.line}></div>
              <div>
                <div className="flex justify-center">
                  <div className={styles.text}>{data.number_of_nfts ?? 0}</div>
                </div>
                <div className={styles.title}>Artworks</div>
              </div>
            </div>
          </div>
        </div>
      </a>
    </Link>
  )
}

export default EcosystemCard
