import React, { useState, useEffect } from 'react'

// next components
import Image from 'next/image'
import 'react-placeholder/lib/reactPlaceholder.css'
import Link from 'next/link'
import { getDisplayUserName, getPriceValue } from 'utils/strings'
import { calculateAuctionTimeLeft, getTimeDifference } from 'utils/helpers'

// custom functions
import { useViewport } from 'utils'
import { useRouter } from 'next/router'

// styles
import styles from './index.module.scss'

// resources
import SolanaIcon from 'assets/icons/solana-logo-14x12.svg?component'
import DefaultNftBG from 'assets/images/default-nft-bg.png'
import ReactPlaceholder from 'react-placeholder/lib'
import GradientButton from 'components/Button/GradientButton'

const OpenEditionCard = ({ data }) => {
  const viewport = useViewport()
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const onClick = () => {}

  useEffect(() => {
    if (data.endTime !== undefined && data.endTime !== null) {
      setTimeLeft(calculateAuctionTimeLeft(data.endTime))

      const timer = setInterval(() => {
        setTimeLeft(calculateAuctionTimeLeft(data.endTime))
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [data.endTime])

  return (
    <div className={styles.container}>
      <div className={styles.imageArea}>
        <div className={styles.imageContent}>
          {data.assetType.includes('image') ? (
            <Link href={`/nft/${data.tokenId}`} passHref>
              <a>
                <div className={styles.nftShadow}>
                  {data.assetUrl! !== '' || data.coverImageUrl! !== '' ? (
                    <img
                      src={
                        data.coverImageUrl !== '' && data.coverImageUrl !== null && data.coverImageUrl !== undefined
                          ? data.coverImageUrl
                          : data.assetUrl !== '' && data.assetUrl !== null && data.assetUrl !== undefined
                          ? data.assetUrl
                          : ''
                      }
                      alt=""
                      className={`${styles.noSelect} ${styles.nftImage}`}
                      onLoad={() => {
                        setLoaded(true)
                      }}
                      loading="lazy"
                    />
                  ) : (
                    <div></div>
                  )}
                </div>
              </a>
            </Link>
          ) : data.assetType.includes('vr') ? (
            <Link href={`/nft/${data.tokenId}`} passHref>
              <a>
                <div className={styles.nftShadow}>
                  {data.assetUrl! !== '' || data.coverImageUrl! !== '' ? (
                    <div className="w-full h-full relative">
                      <img
                        src={data.coverImageUrl}
                        alt=""
                        className={`${styles.noSelect} ${styles.nftImage}`}
                        onLoad={() => {
                          setLoaded(true)
                        }}
                        loading="lazy"
                      />
                      <div className="w-full h-full absolute inset-0 lg:p-[30px] 2xl:p-[45px]" />
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
              </a>
            </Link>
          ) : data.assetType.includes('video') ? (
            viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
              <div className="w-full xl:h-[418px] h-[300px] overflow-hidden">
                {data.coverImageUrl != null && data.coverImageUrl !== '' ? (
                  <Link href={`/nft/${data.tokenId}`} passHref>
                    <a>
                      <div className="w-full xl:h-[418px] h-[300px]">
                        {!loaded && (
                          <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={loaded} color="#202427">
                            <div></div>
                          </ReactPlaceholder>
                        )}
                        <img
                          src={data.coverImageUrl}
                          alt=""
                          className={`${styles.noSelect} ${styles.nftImage}`}
                          onLoad={() => {
                            setLoaded(true)
                          }}
                          loading="lazy"
                        />
                      </div>
                    </a>
                  </Link>
                ) : (
                  <Image
                    src={DefaultNftBG}
                    alt=""
                    layout="fill"
                    className={`${styles.noSelect} ${styles.nftImage}`}
                    onClick={() => onClick()}
                  />
                )}
              </div>
            ) : (
              <Link href={`/nft/${data.tokenId}`} passHref>
                <a>
                  <div
                    className="w-full xl:h-[418px] h-[300px] object-contain"
                    dangerouslySetInnerHTML={{
                      __html: `<video autoplay loop muted webkit-playsinline playsinline class="w-full xl:h-[418px] h-[300px] object-contain overflow-hidden">
              <source src=${data.assetUrl} type="video/mp4" /></video>`,
                    }}
                  />
                </a>
              </Link>
            )
          ) : data.assetType.includes('audio') ? (
            data.coverImageUrl !== null && data.coverImageUrl !== '' ? (
              <Link href={`/nft/${data.tokenId}`} passHref>
                <a>
                  <div className="w-full xl:h-[418px] h-[300px]">
                    {!loaded && (
                      <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={loaded} color="#202427">
                        <div></div>
                      </ReactPlaceholder>
                    )}
                    <img
                      src={data.coverImageUrl}
                      alt=""
                      className={`${styles.noSelect} ${styles.nftImage}`}
                      onLoad={() => {
                        setLoaded(true)
                      }}
                      loading="lazy"
                    />
                  </div>
                </a>
              </Link>
            ) : (
              <Image
                src={DefaultNftBG}
                alt=""
                layout="fill"
                className={`${styles.noSelect} ${styles.nftImage}`}
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

      <div className={styles.infoBox}>
        <div className={styles.avatarArea}>
          {data.artistProfilePicture === null && (
            <div className={`${styles.skeletonLoader} w-[66px] h-[66px] rounded-full`}></div>
          )}
          {data.artistProfilePicture !== null && data.artistProfilePicture !== undefined && (
            <div className={styles.avatar}>
              <Link href={`/${data.artistUsername}`} passHref>
                <a>
                  <img
                    src={
                      data.artistProfilePicture.length > 0 ? data.artistProfilePicture : 'images/dashboard-avatar.png'
                    }
                    alt=""
                    className={`${styles.noSelect} rounded-full`}
                    loading="lazy"
                  />
                </a>
              </Link>
            </div>
          )}
          <div className={styles.nftNames}>
            {data.nftName === '' ? (
              <div className={`${styles.skeletonLoader} w-[600px] h-[60px] rounded-full`}></div>
            ) : (
              <Link href={`/nft/${data.tokenId}`} passHref>
                <a>
                  <p>{data.nftName}</p>
                </a>
              </Link>
            )}
            {data.nftName === '' ? (
              <div className={`${styles.skeletonLoader} w-[300px] h-[26px] rounded-full mt-4`}></div>
            ) : (
              <p>
                <Link href={`/${data.artistUsername}`} passHref>
                  <a>
                    <span>{getDisplayUserName(data.artistUsername)}</span>
                  </a>
                </Link>
              </p>
            )}
          </div>
        </div>

        <div className="w-full flex justify-between">
          <div>
            <div className={styles.priceLabel}>Open Edition</div>
            <div className="mt-[12px] mb-[24px]">
              <div className={styles.sold}>{data.currentSupply + ' sold'}</div>
            </div>

            <div className={styles.priceLabel}>Price</div>
            <div className="flex gap-[6px] mt-[12px] mb-[4px] items-center">
              <div className={styles.sol_icon_color}>
                <SolanaIcon alt="" />
              </div>
              <div className={styles.price}>{getPriceValue(Number(data.price))}</div>
            </div>
          </div>
          <div className="flex items-end jusitfy-end">
            <div>
              {data.endTime !== null && data.startTime !== data.endTime && (
                <div>
                  <div className="flex justify-end">
                    <div className={styles.priceLabel}>Edition Closes</div>
                  </div>
                  <div className="flex justify-end mt-[12px] mb-[29px]">
                    <div className="flex items-center gap-[2px] ">
                      {timeLeft && timeLeft['days'] !== '00' && (
                        <div>
                          <div className={styles.endTime}>
                            {timeLeft && timeLeft['days']}
                            <div className={styles.bidDesc}>d</div>
                          </div>
                        </div>
                      )}
                      <div className={styles.endTimeContainer}>
                        <div className={styles.endTime}>
                          {timeLeft && timeLeft['hours']}
                          <div className={styles.bidDesc}>h</div>
                        </div>
                      </div>
                      <div className={styles.endTimeContainer}>
                        <div className={styles.endTime}>
                          {timeLeft && timeLeft['minutes']}
                          <div className={styles.bidDesc}>m</div>
                        </div>
                      </div>
                      <div className={styles.endTimeContainer}>
                        <div className={styles.endTime}>
                          {timeLeft && timeLeft['seconds']}
                          <div className={styles.bidDesc}>s</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div>
                <div className="flex justify-end">
                  <GradientButton
                    label="Buy Edition"
                    borderRadius={25}
                    width={140}
                    height={50}
                    onClick={() => router.push(`/nft/${data.tokenId}`)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OpenEditionCard
