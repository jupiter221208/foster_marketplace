import React from 'react'

// next components
import Image from 'next/image'
import 'react-placeholder/lib/reactPlaceholder.css'
import Link from 'next/link'
import { getDisplayUserName } from 'utils/strings'

// custom functions

// styles
import styles from './index.module.scss'

// resources
import DefaultNftBG from 'assets/images/default-nft-bg.png'
import ImageWithFoster from 'components/ImageWithFoster'
import DefaultAvatar from 'assets/images/dashboard-avatar.png'

const HeroNewCard = ({ data }) => {
  const onClick = () => {}
  return (
    <div className={styles.container}>
      <div className="g-container absolute inset-0 flex justify-center">
        <div className={styles.cardArea}>
          <div className={styles.imageArea}>
            {data.artist_profile_picture === null ? (
              <div className={`w-full h-full overflow-hidden`}>
                <div className="skeletonLoader" />
              </div>
            ) : data.asset_type.includes('image') ? (
              <Link href={`/nft/${data.token_id}`} passHref>
                <a>
                  <div className="w-full h-full flex justify-center">
                    {data.asset_url! !== '' || data.cover_image_url! !== '' ? (
                      <ImageWithFoster
                        src={
                          data.asset_url !== '' && data.asset_url !== null && data.asset_url !== undefined
                            ? data.asset_url
                            : data.cover_image_url !== '' &&
                              data.cover_image_url !== null &&
                              data.cover_image_url !== undefined
                            ? data.cover_image_url
                            : ''
                        }
                        width={400}
                        height={400}
                        className="w-auto h-auto max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <div></div>
                    )}
                  </div>
                </a>
              </Link>
            ) : data.asset_type.includes('vr') ? (
              <Link href={`/nft/${data.token_id}`} passHref>
                <a>
                  <div className={styles.nftShadow}>
                    {data.asset_url! !== '' || data.cover_image_url! !== '' ? (
                      <div className="w-full h-full relative">
                        <ImageWithFoster
                          src={data.cover_image_url}
                          className="w-full h-full object-cover"
                          width={400}
                          height={400}
                        />
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                </a>
              </Link>
            ) : data.asset_type.includes('video') ? (
              <Link href={`/nft/${data.token_id}`} passHref>
                <a>
                  <div
                    className="w-full h-full object-cover"
                    dangerouslySetInnerHTML={{
                      __html: `<video autoplay loop muted webkit-playsinline playsinline class="w-full h-full object-cover overflow-hidden">
              <source src=${data.asset_url} type="video/mp4" /></video>`,
                    }}
                  />
                </a>
              </Link>
            ) : data.asset_type.includes('audio') ? (
              data.cover_image_url !== null && data.cover_image_url !== '' ? (
                <Link href={`/nft/${data.token_id}`} passHref>
                  <a>
                    <div className="w-full h-full object-contain">
                      <ImageWithFoster
                        src={data.cover_image_url}
                        className="w-full h-full object-contain"
                        width={400}
                        height={400}
                      />
                    </div>
                  </a>
                </Link>
              ) : (
                <Image
                  src={DefaultNftBG}
                  alt=""
                  layout="fill"
                  className="w-full h-full object-cover"
                  onClick={() => onClick()}
                />
              )
            ) : (
              <Image
                src={DefaultNftBG}
                alt=""
                layout="fill"
                className={`${styles.imageNft} ${styles.noSelect}`}
                onClick={() => onClick()}
              />
            )}
          </div>
        </div>
      </div>
      <div className="g-container absolute w-full h-[47px] left-[0px] bottom-[57px] flex justify-center">
        <div className="flex items-center">
          <div className="">
            {data.artist_profile_picture === null && (
              <div className={`w-[47px] h-[47px] rounded-full overflow-hidden`}>
                <div className="skeletonLoader" />
              </div>
            )}
            {data.artist_profile_picture !== null && data.artist_profile_picture !== undefined && (
              <div className={styles.avatar}>
                <Link href={`/${data.artist_username}`} passHref>
                  <a>
                    {data.artist_profile_picture.length > 0 ? (
                      <ImageWithFoster
                        src={data.artist_profile_picture}
                        width={47}
                        height={47}
                        className="rounded-full overflow-hidden"
                      />
                    ) : (
                      <Image src={DefaultAvatar} width={47} height={47} className="rounded-full" alt="" />
                    )}
                  </a>
                </Link>
              </div>
            )}
          </div>
          <div className={`${styles.nftNames} ml-[10px] 2xl:ml-[20px]`}>
            {data.nft_name === '' ? (
              <div className={`w-[200px] h-[24px] rounded-full overflow-hidden`}>
                <div className="skeletonLoader" />
              </div>
            ) : (
              <Link href={`/nft/${data.token_id}`} passHref>
                <a>
                  <p className="min-w-max">{data.nft_name}</p>
                </a>
              </Link>
            )}
            {data.nft_name === '' ? (
              <div className={`w-[100px] h-[20px] rounded-full overflow-hidden mt-4`}>
                <div className="skeletonLoader" />
              </div>
            ) : (
              <p>
                <Link href={`/${data.artist_username}`} passHref>
                  <a>
                    <span>{getDisplayUserName(data.artist_username)}</span>
                  </a>
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroNewCard
