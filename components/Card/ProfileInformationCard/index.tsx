import React, { useRef } from 'react'
import { useRouter } from 'next/router'
import Lottie from 'lottie-react'

// custom functions
import { copyClipboardAlert, copyToClipboard, ensureHttps, isLoggedIn } from 'utils/helpers'
import { getShortAddress } from 'utils/wallet.util'
import CopyClipboardChip from 'components/Chip/CopyClipboardChip'
import CreatorMerchIcon from 'assets/icons/creator-merch-icon.svg?component'
import RefreshMobileLottery from 'assets/lottery/refresh-mobile.json'

// next components
import SolanaLogoIcon from 'assets/icons/solana-logo-dark-mobile.svg?component'
import ShareSmallIcon from 'assets/icons/share-black-15x15.svg?component'
import TwitterWhiteIcon from 'assets/icons/twitter-white-15x15.svg?component'
import WebsiteIcon from 'assets/icons/website-icon-15x15.svg?component'
import IGWhiteIcon from 'assets/icons/instagram-white-15x15.svg?component'
import LandIcon from 'assets/icons/land-icon-15x15.svg?component'
import SolrPlexIcon from 'assets/icons/solrplex-white-icon.svg?component'
import RefreshMobileIcon from 'assets/icons/refresh-icon-mobile.svg?component'
import FileCopyIcon from 'assets/icons/file-copy-white.svg?component'

// styles
import styles from './index.module.scss'

const ProfileInformationCard = props => {
  const {
    hasLoading,
    setVisible,
    setType,
    setShowFollowModal,
    artistFollowers,
    artistFollowing,
    walletList,
    artistInfo,
    setOpenShareModal,
    processedNftDescription,
    shouldShowReadMore,
    toggleIsTruncated,
    isTruncated,
    isColletorLoaded,
    artistStatsInfo,
    collectorStatsInfo,
    refreshing,
    refreshNFT,
  } = props
  const router = useRouter()

  return (
    <div className="w-full flex flex-wrap z-10">
      <div className="w-full h-[20px] mt-[10px] lg:mt-[18px] flex items-center">
        <div className="flex gap-[15px] z-10 items-center">
          {hasLoading ? (
            <div className="w-[100px] h-[35px] rounded-full overflow-hidden">
              <div className="skeletonLoader" />
            </div>
          ) : (
            <div
              className="cursor-pointer flex hover:opacity-60"
              onClick={() => {
                if (!isLoggedIn()) {
                  setVisible(true)
                  return
                }
                setType(0)
                setShowFollowModal(true)
              }}
            >
              <div className={styles.whiteText}>{artistFollowers}</div>
              &nbsp;
              <div className={styles.grayText}>Followers</div>
            </div>
          )}
          {hasLoading ? (
            <div className="w-[100px] h-[35px] rounded-full overflow-hidden">
              <div className="skeletonLoader" />
            </div>
          ) : (
            <div
              className="cursor-pointer flex hover:opacity-60"
              onClick={() => {
                if (!isLoggedIn()) {
                  setVisible(true)
                  return
                }
                setType(1)
                setShowFollowModal(true)
              }}
            >
              <div className={styles.whiteText}>{artistFollowing}</div>
              &nbsp;
              <div className={styles.grayText}>Following</div>
            </div>
          )}
        </div>
      </div>
      <div className="w-full h-[32px] mt-[21px] lg:mt-[15px]">
        <div className="flex gap-[15px] z-10 items-center">
          {hasLoading ? (
            <div className="flex gap-[15px] z-10 items-center">
              <div className="w-[32px] h-[32px] rounded-[16px] overflow-hidden">
                <div className="skeletonLoader" />
              </div>
              <div className="w-[32px] h-[32px] rounded-[16px] overflow-hidden">
                <div className="skeletonLoader" />
              </div>
              <div className="w-[32px] h-[32px] rounded-[16px] overflow-hidden">
                <div className="skeletonLoader" />
              </div>
              <div className="w-[32px] h-[32px] rounded-[16px] overflow-hidden">
                <div className="skeletonLoader" />
              </div>
              <div className="w-[32px] h-[32px] rounded-[16px] overflow-hidden">
                <div className="skeletonLoader" />
              </div>
            </div>
          ) : (
            walletList.map((item, index) => (
              <div
                key={index}
                className={styles.shareIcon}
                onClick={() => {
                  if (item.type === 'twitter') {
                    window.open(ensureHttps(artistInfo?.twitter_url))
                  } else if (item.type === 'instagram') {
                    window.open(ensureHttps(artistInfo?.ig_url))
                  } else if (item.type === 'website') {
                    window.open(ensureHttps(artistInfo?.site_url))
                  } else if (item.type === 'land') {
                    window.open(ensureHttps(artistInfo?.three_land_url))
                  } else if (item.type === 'solar') {
                    window.open(ensureHttps(artistInfo?.solarplex_url))
                  }
                }}
              >
                {item.type === 'twitter' ? (
                  <TwitterWhiteIcon />
                ) : item.type === 'instagram' ? (
                  <IGWhiteIcon />
                ) : item.type === 'website' ? (
                  <WebsiteIcon />
                ) : item.type === 'land' ? (
                  <LandIcon />
                ) : item.type === 'solar' ? (
                  <SolrPlexIcon />
                ) : (
                  <></>
                )}
              </div>
            ))
          )}

          {!hasLoading && (
            <div
              className={`${styles.shareIcon} w-[32px] gap-[9px]`}
              onClick={() => {
                setOpenShareModal(true)
              }}
            >
              <div>
                <ShareSmallIcon alt="" />
              </div>
            </div>
          )}
        </div>
      </div>

      {artistInfo?.bio && (
        <div className={`w-full mt-[15px] ${styles.bioText}`}>
          {processedNftDescription}
          {shouldShowReadMore && (
            <span onClick={toggleIsTruncated} className={`${styles.greenText} min-w-max cursor-pointer`}>
              {isTruncated ? '... Expand' : ' Collapse'}
            </span>
          )}
        </div>
      )}

      <div className="w-full flex lg:hidden items-center pt-[15px] gap-[11px] lg:gap-[15px]">
        {hasLoading ? (
          <div className="w-[142px] h-[45px] rounded-[23px] overflow-hidden">
            <div className="skeletonLoader" />
          </div>
        ) : (
          <div
            className={`${styles.iconContainer} relative w-[142px] px-[8px] gap-[8px]`}
            onClick={() => {
              copyToClipboard(artistInfo?.wallet_id || '')
              copyClipboardAlert('mobile-wallet')
            }}
          >
            <FileCopyIcon alt="" />
            <div className={styles.refereshText}>{getShortAddress(artistInfo?.wallet_id)}</div>
            <CopyClipboardChip message="Wallet address copied" identifier="mobile-wallet" height={45} fontSize={13} />
          </div>
        )}

        {hasLoading ? (
          <div className="w-[142px] h-[45px] rounded-full overflow-hidden">
            <div className="skeletonLoader" />
          </div>
        ) : (
          <div
            className={`${styles.iconContainer} w-[142px] px-[8px] gap-[8px]`}
            onClick={() => {
              router.push(`/${artistInfo?.username}/merch`)
            }}
          >
            <CreatorMerchIcon alt="" />
            <div className={styles.refereshText}>Merch Store</div>
          </div>
        )}

        {hasLoading ? (
          <div className="w-[45px] h-[45px] rounded-[23px] overflow-hidden">
            <div className="skeletonLoader" />
          </div>
        ) : (
          <div className={`${styles.iconContainer} w-[45px]`} onClick={() => refreshNFT()}>
            <div className="w-[45px] h-[20px] flex justify-center items-center">
              {refreshing ? (
                <Lottie width={18} height={18} animationData={RefreshMobileLottery} loop={true} className="" />
              ) : (
                <div>
                  <RefreshMobileIcon />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="w-full hidden lg:flex mt-[15px] mb-[40px] gap-[15px] items-center">
        {!isColletorLoaded ? (
          <div className="w-[90px] h-[35px] rounded-full overflow-hidden">
            <div className="skeletonLoader" />
          </div>
        ) : (
          <div className="flex gap-[6px] items-center">
            <div className={styles.statisticValue}>{artistStatsInfo?.nfts_created}</div>
            <div className={styles.statisticLabel}>Created</div>
          </div>
        )}

        <div className={styles.statisticBorder} />

        {!isColletorLoaded ? (
          <div className="w-[90px] h-[35px] rounded-full overflow-hidden">
            <div className="skeletonLoader" />
          </div>
        ) : (
          <div className="flex gap-[6px] items-center">
            <div className={styles.statisticValue}>{collectorStatsInfo?.nfts_collected}</div>
            <div className={styles.statisticLabel}>Collected</div>
          </div>
        )}

        <div className={styles.statisticBorder} />

        {!isColletorLoaded ? (
          <div className="w-[90px] h-[35px] rounded-full overflow-hidden">
            <div className="skeletonLoader" />
          </div>
        ) : (
          <div className="flex gap-[6px] items-center">
            <SolanaLogoIcon alt="" className="mt-[2px]" />
            <div className={styles.statisticValue}>{artistStatsInfo?.sales_volume}</div>
            <div className={styles.statisticLabel}>Sold</div>
          </div>
        )}

        <div className={styles.statisticBorder} />

        {!isColletorLoaded ? (
          <div className="w-[90px] h-[35px] rounded-full overflow-hidden">
            <div className="skeletonLoader" />
          </div>
        ) : (
          <div className="flex gap-[6px] items-center">
            <SolanaLogoIcon alt="" className="mt-[2px]" />
            <div className={styles.statisticValue}>{collectorStatsInfo?.purchase_volume}</div>
            <div className={styles.statisticLabel}>Purchased</div>
          </div>
        )}
      </div>
      <div className="w-full lg:hidden block">
        <div className="w-full mt-[15px] flex gap-[5px]">
          <div className={styles.statsConatiner}>
            {!isColletorLoaded ? (
              <div className="w-[100px] h-[35px] rounded-[5px] overflow-hidden">
                <div className="skeletonLoader" />
              </div>
            ) : (
              <div>
                <div className={styles.statisticValue}>{artistStatsInfo?.nfts_created}</div>
                <div className={styles.statisticLabel}>Created</div>
              </div>
            )}
          </div>
          <div className={styles.statsConatiner}>
            {!isColletorLoaded ? (
              <div className="w-[100px] h-[35px] rounded-[5px] overflow-hidden">
                <div className="skeletonLoader" />
              </div>
            ) : (
              <div>
                <div className={styles.statisticValue}>{collectorStatsInfo?.nfts_collected}</div>
                <div className={styles.statisticLabel}>Collected</div>
              </div>
            )}
          </div>
        </div>
        <div className="w-full mt-[5px] flex  gap-[5px]">
          <div className={styles.statsConatiner}>
            {!isColletorLoaded ? (
              <div className="w-[100px] h-[35px] rounded-[5px] overflow-hidden">
                <div className="skeletonLoader" />
              </div>
            ) : (
              <div>
                <div className="flex gap-[6px] items-center">
                  <SolanaLogoIcon alt="" className="mt-[4px]" />
                  <div className={styles.statisticValue}>{artistStatsInfo?.sales_volume}</div>
                </div>
                <div className={styles.statisticLabel}>Sold</div>
              </div>
            )}
          </div>
          <div className={styles.statsConatiner}>
            {!isColletorLoaded ? (
              <div className="w-[100px] h-[35px] rounded-[5px] overflow-hidden">
                <div className="skeletonLoader" />
              </div>
            ) : (
              <div>
                <div className="flex gap-[6px] items-center">
                  <SolanaLogoIcon alt="" className="mt-[4px]" />
                  <div className={styles.statisticValue}>{collectorStatsInfo?.purchase_volume}</div>
                </div>
                <div className={styles.statisticLabel}>Purchased</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileInformationCard
