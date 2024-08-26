import React, { useState, useEffect } from 'react'

// next components

// Web3

// images and icons

import PrimaryDashboardButton from 'components/Button/PrimaryDashboardButton'
import SecondaryDashboardButton from 'components/Button/SecondaryDashboardButton'
import MerchEditionViewModal from 'components/Modal/MerchEditionViewModal'
import MerchClaimModal from 'components/Modal/MerchClaimModal'

// styles
import styles from './index.module.scss'
import ImageWithFoster from 'components/ImageWithFoster'

// api
import Link from 'next/link'
import { useRouter } from 'next/router'
import OutlineButton from 'components/Button/OutlineButton'

const MerchEditionClaimCard = props => {
  const { data } = props
  const router = useRouter()
  const [showViewCard, setShowViewCard] = useState(false)
  const [showClaimCard, setShowClaimCard] = useState(false)

  const onClaimCard = () => {
    setShowClaimCard(true)
  }

  const onViewCard = () => {
    setShowViewCard(true)
  }

  return (
    <div className={styles.container}>
      <div className="relative w-full overflow-hidden">
        <div className={styles.topSection}>
          <div>
            <div className={styles.productName}>{data.name}</div>
            <Link href={`/nft/${data.nft.token_id}`} passHref>
              <a>
                <div className={styles.nftName}>{data.nft.nft_name}</div>
              </a>
            </Link>
          </div>
          <div className={styles.avatar}>
            <Link href={`/${data.username}`} passHref>
              <a>
                <ImageWithFoster src={data.user_profile_picture} width={44} className="object-cover" />
              </a>
            </Link>
          </div>
        </div>

        <div className={styles.imageArea} onClick={() => onViewCard()}>
          <div className={styles.imageContent}>
            <div className="w-full h-full p-4">
              <ImageWithFoster
                src={data.options.addons[0].mockup_url}
                width={800}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className={styles.bottomSection}>
          {data.order_id ? (
            <div className="w-full">
              <OutlineButton
                height={45}
                fontSize={16}
                label="Order Details"
                onClick={() => {
                  router.push(`/merch-logs/${data.order_id}`)
                }}
                fullWidth
              />
            </div>
          ) : (
            <div className="w-full">
              <OutlineButton fontSize={16} height={45} label="Claim Merch" onClick={() => onClaimCard()} fullWidth />
            </div>
          )}
        </div>
      </div>

      <MerchEditionViewModal urls={data.options.addons} open={showViewCard} onClose={() => setShowViewCard(false)} />

      <MerchClaimModal data={data} open={showClaimCard} onClose={() => setShowClaimCard(false)} />
    </div>
  )
}

export default MerchEditionClaimCard
