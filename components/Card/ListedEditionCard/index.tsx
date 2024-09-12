import React, { useState } from 'react'

// next components

// Web3
import { PublicKey, Keypair } from '@solana/web3.js'
import { useMetaplex } from 'hooks/useMetaplex'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo-dark-mobile.svg?component'
import CloseIcon from 'assets/icons/close-white-13x13.svg?component'

// styles
import styles from './index.module.scss'
import { getPriceValue } from 'utils/strings'
import Link from 'next/link'
import ImageWithFoster from 'components/ImageWithFoster'

// api
import { revokeDelegateEdition } from 'utils/editions'
import LoadingSecondaryButton from 'components/Button/LoadingSecondaryButton'
import SecondaryButton from 'components/Button/SecondaryButton'
import PrimaryDashboardButton from 'components/Button/PrimaryDashboardButton'
import SecondaryDashboardButton from 'components/Button/SecondaryDashboardButton'
import LoadingDashboardButton from 'components/Button/LoadingDashboardButton'
import GradientButton from 'components/Button/GradientButton'

export interface ListedEditionCardProps {
  data: any
  onClick: (uri: string) => any
  onUpdateList: any
  onCancelSuccess: any
}

const ListedEditionCard = ({ data, onClick, onUpdateList, onCancelSuccess }: ListedEditionCardProps) => {
  const { address, name, type, assetUrl, coverUrl, creatorAddress, price } = data
  const [showEditBtn, setShowEditBtn] = useState(false)
  const { metaplex: mx } = useMetaplex()

  const [cancelListLoading, setCancelListLoading] = useState(false)

  const cancelListEdition = async () => {
    let item = data
    setCancelListLoading(true)
    try {
      let mint = new PublicKey(item?.address)
      let delegate = Keypair.fromSecretKey(Uint8Array.from(item?.authority)).publicKey
      let signature = await revokeDelegateEdition({
        metaplex: mx,
        mint,
        delegate,
      })
      if (!signature) {
        console.error(`could not revoke delegate for ${mint} to ${delegate}`)
        throw new Error(`could not revoke delegate for ${mint} to ${delegate}`)
      }
    } catch (e) {
      setCancelListLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className="relative w-full overflow-hidden">
        <div className={styles.topSection}>
          <div className={styles.nftName}>{data.name}</div>
          <div className="flex items-center gap-[6px]">
            <div className="mt-[4px]">
              <SolanaLogoIcon alt="" />
            </div>
            <div className={styles.price}>{getPriceValue(price)}</div>
          </div>
        </div>
        <Link href={`/nft/${address}`} passHref>
          <a>
            <div className={styles.imageArea}>
              <div className={styles.imageContent}>
                {type === 'video' ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `<video autoplay loop muted webkit-playsinline playsinline class="w-full h-full object-cover overflow-hidden">
                <source src=${assetUrl} type="video/mp4" /></video>`,
                    }}
                  />
                ) : (
                  <div className="w-full h-full">
                    <ImageWithFoster src={coverUrl} width={800} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </a>
        </Link>

        <div className={styles.bottomSection}>
          <div className="w-full flex">
            <PrimaryDashboardButton
              label="Update or Relist"
              type="update-relist"
              onClick={() => onUpdateList()}
              fullWidth
            />
            {cancelListLoading ? (
              <LoadingDashboardButton fullWidth />
            ) : (
              <SecondaryDashboardButton
                label={'Cancel Listing'}
                type="cancel"
                fullWidth
                onClick={() => cancelListEdition()}
              />
            )}
          </div>
        </div>
        {showEditBtn && (
          <div className={styles.overlay}>
            <div className={styles.closeBtn} onClick={() => setShowEditBtn(false)}>
              <CloseIcon />
            </div>
            <div className={styles.bottomBtn}>
              <div className="w-full hidden lg:flex flex-wrap gap-[8px] mt-[15px]">
                <GradientButton label="Update or Relist" onClick={() => onUpdateList()} fullWidth />
                {cancelListLoading ? (
                  <LoadingSecondaryButton fullWidth />
                ) : (
                  <SecondaryButton
                    label={'Cancel Listing'}
                    type="cancel"
                    fullWidth
                    onClick={() => cancelListEdition()}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ListedEditionCard
