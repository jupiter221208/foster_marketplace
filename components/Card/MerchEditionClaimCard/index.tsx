import React, { useState } from 'react'

// next components

// Web3

// images and icons
import CloseIcon from 'assets/icons/close-white-13x13.svg?component'

// styles
import styles from './index.module.scss'
import ImageWithFoster from 'components/ImageWithFoster'

// api
import PrimaryButton from 'components/Button/PrimaryButton'
import SecondaryButton from 'components/Button/SecondaryButton'
import PrimaryDashboardButton from 'components/Button/PrimaryDashboardButton'
import SecondaryDashboardButton from 'components/Button/SecondaryDashboardButton'
import MerchEditionViewModal from 'components/Modal/MerchEditionViewModal'
import MerchClaimModal from 'components/Modal/MerchClaimModal'

const MerchEditionClaimCard = props => {
  const { data } = props
  const [showEditBtn, setShowEditBtn] = useState(false)
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
          </div>
        </div>

        <div className={styles.imageArea}>
          <div className={styles.imageContent}>
            <div className="w-full h-full p-4">
              <ImageWithFoster
                src={data.options.product_images[0]}
                width={800}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className={styles.bottomSection}>
          <div className="w-full flex">
            <PrimaryDashboardButton label="Claim Merch" type="merch" onClick={() => onClaimCard()} fullWidth />

            <SecondaryDashboardButton label="View" type="next" fullWidth onClick={() => onViewCard()} />
          </div>
        </div>
        {showEditBtn && (
          <div className={styles.overlay}>
            <div className={styles.closeBtn} onClick={() => setShowEditBtn(false)}>
              <CloseIcon />
            </div>
            <div className={styles.bottomBtn}>
              <div className="w-full hidden lg:flex flex-wrap gap-[8px] mt-[15px]">
                <PrimaryButton label="Claim Merch" type="merch" onClick={() => onClaimCard()} fullWidth />

                <SecondaryButton label="View" type="next" fullWidth onClick={() => onViewCard()} />
              </div>
            </div>
          </div>
        )}
      </div>

      <MerchEditionViewModal
        urls={data.options.product_images}
        open={showViewCard}
        onClose={() => setShowViewCard(false)}
      />
      <MerchClaimModal
        urls={data.options.product_images}
        open={showClaimCard}
        onClose={() => setShowClaimCard(false)}
      />
    </div>
  )
}

export default MerchEditionClaimCard
