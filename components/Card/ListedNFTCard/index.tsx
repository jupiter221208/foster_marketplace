import React, { useEffect, useMemo, useState } from 'react'

// custom components
import GradientButton from 'components/Button/GradientButton'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo-dark-mobile.svg?component'
import CloseIcon from 'assets/icons/close-white-13x13.svg?component'

// styles
import styles from './index.module.scss'
import { getPriceValue } from 'utils/strings'
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useMetaplex } from 'hooks/useMetaplex'
import type { JsonMetadata } from '@metaplex-foundation/js'
import { getBuyerEscrowBalanceDeficit } from 'utils/auctioneer.util'
import EscrowDeficientModal from 'components/Modal/EscrowDeficientModal'
import Link from 'next/link'
import { ListingsAPIData } from 'types/nft'
import ImageWithFoster from 'components/ImageWithFoster'
import PrimaryButton from 'components/Button/PrimaryButton'
import SecondaryButton from 'components/Button/SecondaryButton'
import SecondaryDashboardButton from 'components/Button/SecondaryDashboardButton'
import LoadingDashboardButton from 'components/Button/LoadingDashboardButton'

export type ListedNFTCardDataWithJson = ListingsAPIData & { json: JsonMetadata }

export interface ListedNFTCardProps {
  data: ListingsAPIData
  type: 'fixed' | 'auction' | 'edition'
  onClick: (uri: string) => any
  onActionClick: (data: ListedNFTCardDataWithJson) => void
  cancelAuction: any
  finalizeSale: any
  processingNft: any
}

const ListedNFTCard = ({
  data,
  type,
  onClick,
  onActionClick,
  cancelAuction,
  finalizeSale,
  processingNft,
}: ListedNFTCardProps) => {
  const { address, name, uri, price, endTime, highestBid } = data
  const [showEditBtn, setShowEditBtn] = useState(false)
  const { metaplex: mx } = useMetaplex()
  const [deficiency, setDeficiency] = useState(0)
  const [deficencyModal, setDeficencyModal] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!processingNft) setLoading(false)
  }, [processingNft])

  const isEnded = useMemo(() => {
    if (endTime) {
      let endListingTime = new Date(endTime)
      let offset = endListingTime.getTimezoneOffset() * 60 * 1000
      let endLocalTime = endListingTime.getTime() - offset

      const now = new Date()
      return now.getTime() - endLocalTime > 0 ? true : false
    }
    return false
  }, [endTime])

  const [assetJson, setAssetJson] =
    useState<{
      name: string
      image: string
      description: string
      category: string
      animation_url: string
      attributes: { trait_type: string; value: string }[]
      properties: {
        category: string
      }
    }>()

  useEffect(() => {
    if (!uri) return
    try {
      fetch(uri)
        .then(r => r.json())
        .then(setAssetJson)
    } catch {}
  }, [uri])

  const processFinalizeSale = async () => {
    let deficit = await getBuyerEscrowBalanceDeficit(mx, new PublicKey(highestBid?.buyer_address), data.price)
    if (deficit > 0) {
      // show confirm dialog
      setDeficiency(deficit / LAMPORTS_PER_SOL)
      setTimeout(() => {
        setDeficencyModal(true)
      }, 1000)
    } else {
      finalizeSale(data)
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
                {assetJson?.properties?.category === 'video' ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `<video autoplay loop muted webkit-playsinline playsinline class="w-full h-full object-cover overflow-hidden">
              <source src=${assetJson.animation_url} type="video/mp4" /></video>`,
                    }}
                  />
                ) : (
                  <div className="w-full h-full">
                    {assetJson && (
                      <ImageWithFoster src={assetJson?.image} width={720} className="w-full h-full object-cover" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </a>
        </Link>
        <div className={styles.bottomSection}>
          <div className="w-full">
            {type === 'fixed' ? (
              <SecondaryDashboardButton
                fullWidth
                label={'Update'}
                type="update-relist"
                onClick={() => onActionClick({ ...data, json: assetJson })}
              />
            ) : type === 'edition' ? (
              <SecondaryDashboardButton label={'Cancel Listing'} onClick={() => {}} type="cancel" fullWidth />
            ) : (
              <>
                {loading ? (
                  <LoadingDashboardButton fullWidth />
                ) : highestBid ? (
                  isEnded ? (
                    <SecondaryDashboardButton
                      label={'Finalize Sale'}
                      type="finalize-sale"
                      onClick={() => {
                        setLoading(true)
                        processFinalizeSale()
                      }}
                      fullWidth
                    />
                  ) : (
                    <SecondaryDashboardButton
                      disabled={true}
                      label={'Cancel Auction'}
                      type="cancel"
                      onClick={() => {}}
                      fullWidth
                    />
                  )
                ) : (
                  <SecondaryDashboardButton
                    label={'Cancel Auction'}
                    type="cancel"
                    onClick={() => {
                      setLoading(true)
                      cancelAuction(data)
                    }}
                    fullWidth
                  />
                )}
              </>
            )}
          </div>
        </div>
        {showEditBtn && (
          <div className={styles.overlay}>
            <div className={styles.closeBtn} onClick={() => setShowEditBtn(false)}>
              <CloseIcon />
            </div>
            <div className={styles.bottomBtn}>
              <div className="mt-[15px] w-full">
                {type === 'fixed' ? (
                  <PrimaryButton
                    fullWidth
                    label={'Update'}
                    type="update-relist"
                    onClick={() => onActionClick({ ...data, json: assetJson })}
                  />
                ) : type === 'edition' ? (
                  <GradientButton
                    label={'Cancel Listing'}
                    onClick={() => {}}
                    fontSize="16px"
                    fullWidth
                    borderRadius="10px"
                    borderWidth="1px"
                  />
                ) : (
                  <>
                    {highestBid ? (
                      isEnded ? (
                        <SecondaryButton
                          label={'Finalize Sale'}
                          type="finalize-sale"
                          onClick={() => processFinalizeSale()}
                          fullWidth
                        />
                      ) : (
                        <SecondaryButton
                          disabled={true}
                          label={'Cancel Auction'}
                          type="cancel"
                          onClick={() => {}}
                          fullWidth
                        />
                      )
                    ) : (
                      <SecondaryButton
                        label={'Cancel Auction'}
                        type="cancel"
                        onClick={() => cancelAuction(data)}
                        fullWidth
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {deficencyModal && (
        <EscrowDeficientModal
          onFinalize={() => finalizeSale(data)}
          open={deficencyModal}
          close={() => setDeficencyModal(false)}
          highestBid={parseFloat(highestBid?.amount)}
          deficiency={deficiency}
          nftName={name}
          collectionName={''}
        />
      )}
    </div>
  )
}

export default ListedNFTCard
