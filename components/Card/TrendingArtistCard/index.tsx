import React, { useState } from 'react'
import Link from 'next/link'

// images and icons
import Artist from 'assets/images/dashboard-avatar.png'
import TwitterWhiteIcon from 'assets/icons/twitter-white.svg?component'
import WebsiteIcon from 'assets/icons/website-icon.svg?component'
import IGWhiteIcon from 'assets/icons/instagram-green.svg?component'
import LandIcon from 'assets/icons/land-icon.svg?component'
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
        {viewport === 'xs' ? (
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
        ) : (
          <div className={styles.layout}>
            <div
              className={`${styles.container}`}
              onClick={() => {}}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              <div className="absolute inset-0 w-full h-full">
                <ImageWithFoster
                  src={artist.banner_picture}
                  width={800}
                  height={190}
                  onClick={() => {}}
                  className="w-full h-full object-cover"
                  showPlaceHolder={false}
                />
                <div className={styles.overlay} />
              </div>
              <div className="absolute inset-0 px-[18px] lg:px-[44px] py-[20px] lg:py-[31px] flex gap-[20px]">
                <div className="min-w-[123px] min-h-[123px] w-[123px] h-[123px] overflow-hidden">
                  <ImageWithFoster
                    src={
                      artist.profile_picture !== null &&
                      artist.profile_picture !== undefined &&
                      artist.profile_picture !== ''
                        ? artist.profile_picture
                        : Artist.src
                    }
                    width={123}
                    height={123}
                    onClick={() => {}}
                    className="object-cover rounded-full"
                    showPlaceHolder={false}
                  />
                </div>
                <div className="w-full flex items-center">
                  <div>
                    <div className={styles.name}>{getDisplayUserName(artist.username)}</div>
                    <div className="flex gap-[10px] mt-[13px] items-center">
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
                      {artist.solarplex_url !== null && artist.solarplex_url.length > 0 && (
                        <div className={styles.socialIcon} onClick={e => onClickSocialButton(e, artist.solarplex_url)}>
                          <SolrPlexIcon />
                        </div>
                      )}
                    </div>
                    <div className={styles.bio}>{artist.bio}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </a>
    </Link>
  )
}

export default TrendingArtistCard
