import React, { useState } from 'react'
import Link from 'next/link'

// images and icons
import DefaultBanner from 'assets/images/top-creator-banner-placeholder.png'
import Artist from 'assets/images/dashboard-avatar.png'
import TwitterWhiteIcon from 'assets/icons/twitter-white-15x15.svg?component'
import WebsiteIcon from 'assets/icons/website-icon-15x15.svg?component'
import IGWhiteIcon from 'assets/icons/instagram-white-15x15.svg?component'
import LandIcon from 'assets/icons/land-icon-15x15.svg?component'
import SolrPlexIcon from 'assets/icons/solrplex-icon.svg?component'

// styles
import styles from './index.module.scss'
import { useViewport } from 'utils'
import { getDisplayUserName } from 'utils/strings'
import ImageWithFoster from 'components/ImageWithFoster'

const TrendingArtistCard = props => {
  const { artist, onClick } = props
  const viewport = useViewport()
  const [hover, setHover] = useState(false)

  const onClickSocialButton = (e, link) => {
    e.preventDefault()
    e.stopPropagation()
    window.open(link)
  }

  return (
    <Link href={`${window.origin}/${artist.username}`} passHref>
      <a className="w-full h-full">
        {/* {viewport === 'xs' ? (
          <div className={styles.mobileContainer}>
            <div className="absolute inset-0 w-full h-full">
              <ImageWithFoster
                src={artist.banner_picture}
                width={800}
                onClick={() => {}}
                className="w-full h-full object-cover"
                showPlaceHolder={false}
              />
              <div className={styles.overlay} />
            </div>
            <div className="absolute inset-0 w-full h-full">
              <div className="w-full h-full flex justify-center items-center">
                <div>
                  <div className="w-full flex justify-center">
                    <div className="min-w-[130px] min-h-[130px] w-[130px] h-[130px] overflow-hidden ">
                      <ImageWithFoster
                        src={
                          artist.profile_picture !== null &&
                          artist.profile_picture !== undefined &&
                          artist.profile_picture !== ''
                            ? artist.profile_picture
                            : Artist.src
                        }
                        width={130}
                        height={130}
                        onClick={() => {}}
                        className="object-cover rounded-full"
                        showPlaceHolder={false}
                      />
                    </div>
                  </div>
                  <div className="w-full flex justify-center mt-[30px]">
                    <div className={styles.name}>{getDisplayUserName(artist.username)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : ( */}
        <div className={styles.layout}>
          <div
            className={`${styles.container}`}
            onClick={() => {}}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <div className="lg:block hidden">
              <div className={styles.imageArea}>
                <div className={styles.imageContent}>
                  {artist.banner_picture ? (
                    <ImageWithFoster
                      src={artist.banner_picture}
                      width={800}
                      onClick={() => {}}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img src={DefaultBanner.src} alt="" />
                  )}
                </div>
              </div>
            </div>
            <div className="block lg:hidden">
              {artist.banner_picture ? (
                <ImageWithFoster
                  src={artist.banner_picture}
                  width={400}
                  onClick={() => {}}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img src={DefaultBanner.src} alt="" />
              )}
            </div>
            <div className="w-full hidden sm:flex h-[104px] sm:gap-[17px]">
              <div className={styles.artistProfile}>
                <ImageWithFoster
                  src={
                    artist.profile_picture !== null &&
                    artist.profile_picture !== undefined &&
                    artist.profile_picture !== ''
                      ? artist.profile_picture
                      : Artist.src
                  }
                  width={150}
                  height={150}
                  onClick={() => {}}
                  className="object-cover"
                  showPlaceHolder={false}
                />
              </div>
              <div className="w-full flex justify-between">
                <div className="mt-[10px] sm:mt-[16px]">
                  <div className={styles.name}>{getDisplayUserName(artist.username)}</div>
                  <div className="flex gap-[6px] mt-[6px] sm:mt-[9px]">
                    <div className={styles.followers}>{artist.followers}</div>
                    <div className={styles.followLabel}>Followers</div>
                  </div>
                </div>

                <div className="sm:flex hidden gap-[10px] mt-[16px] mr-[18px]">
                  {artist.twitter_url !== null && artist.twitter_url.length > 0 && (
                    <div className={styles.socialIcon} onClick={e => onClickSocialButton(e, artist.twitter_url)}>
                      <TwitterWhiteIcon />
                    </div>
                  )}
                  {artist.ig_url !== null && artist.ig_url.length > 0 && (
                    <div className={styles.socialIcon} onClick={e => onClickSocialButton(e, artist.ig_url)}>
                      <IGWhiteIcon />
                    </div>
                  )}
                  {artist.site_url !== null && artist.site_url.length > 0 && (
                    <div className={styles.socialIcon} onClick={e => onClickSocialButton(e, artist.site_url)}>
                      <WebsiteIcon />
                    </div>
                  )}
                  {artist.three_land_url !== null && artist.three_land_url.length > 0 && (
                    <div className={styles.socialIcon} onClick={e => onClickSocialButton(e, artist.three_land_url)}>
                      <LandIcon />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full h-[118px] sm:hidden flex gap-[8px] justify-between">
              <div>
                <div className={styles.artistProfile}>
                  <ImageWithFoster
                    src={
                      artist.profile_picture !== null &&
                      artist.profile_picture !== undefined &&
                      artist.profile_picture !== ''
                        ? artist.profile_picture
                        : Artist.src
                    }
                    width={100}
                    height={100}
                    onClick={() => {}}
                    className="object-cover"
                    showPlaceHolder={false}
                  />
                </div>
                <div className="mt-[11px] ml-[13px] sm:mt-[16px]">
                  <div className={styles.name}>{getDisplayUserName(artist.username)}</div>
                  <div className="flex gap-[6px] mt-[6px] sm:mt-[9px]">
                    <div className={styles.followers}>{artist.followers}</div>
                    <div className={styles.followLabel}>Followers</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-[15px] mt-[11px] mr-[18px]">
                {artist.twitter_url !== null && artist.twitter_url.length > 0 && (
                  <div className={styles.socialIcon} onClick={e => onClickSocialButton(e, artist.twitter_url)}>
                    <TwitterWhiteIcon />
                  </div>
                )}
                {artist.ig_url !== null && artist.ig_url.length > 0 && (
                  <div className={styles.socialIcon} onClick={e => onClickSocialButton(e, artist.ig_url)}>
                    <IGWhiteIcon />
                  </div>
                )}
                {artist.site_url !== null && artist.site_url.length > 0 && (
                  <div className={styles.socialIcon} onClick={e => onClickSocialButton(e, artist.site_url)}>
                    <WebsiteIcon />
                  </div>
                )}
                {artist.three_land_url !== null && artist.three_land_url.length > 0 && (
                  <div className={styles.socialIcon} onClick={e => onClickSocialButton(e, artist.three_land_url)}>
                    <LandIcon />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* )} */}
      </a>
    </Link>
  )
}

export default TrendingArtistCard
