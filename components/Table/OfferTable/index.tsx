import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// web3
import { PublicKey } from '@solana/web3.js'
import { useMetaplex } from 'hooks/useMetaplex'
import { LazyBidWithAsset } from 'utils/auction.util'
import { getNFTOwner } from 'utils/nfts.utils'

// components

// images and icons
import DefaultNftBG from 'assets/images/default-nft-bg.png'

// styles
import styles from './index.module.scss'
import { getPriceValue, getShortAddress, timeSince } from 'utils/strings'
import ImageWithFoster from 'components/ImageWithFoster'
import { getLocalDate } from 'utils/helpers'

export interface OfferTableProps {
  data: LazyBidWithAsset[]
  onAccept: (listing: LazyBidWithAsset) => any
  onCancel: (listing: LazyBidWithAsset) => any
  offerType: 'made' | 'received'
}

type OfferTableRowProps = Omit<OfferTableProps, 'data'> & { listing: OfferTableProps['data'][number] }

const OfferTableRow = ({ listing, onAccept, onCancel, offerType }: OfferTableRowProps) => {
  const { metaplex } = useMetaplex()
  const router = useRouter()

  const [ownerOrBuyerAddress, setOwnerOrBuyerAddress] = useState<PublicKey | null>(null)
  useEffect(() => {
    if (offerType === 'made') getNFTOwner(metaplex, listing.asset.mintAddress).then(setOwnerOrBuyerAddress)
    else setOwnerOrBuyerAddress(listing.buyerAddress)
  }, [offerType, metaplex, listing])

  const [assetImageUrl, setAssetImageUrl] = useState<string>('')
  useEffect(() => {
    if (listing.asset.json?.image) return

    fetch(listing.asset.uri)
      .then(e => e.json())
      .then(({ image }) => setAssetImageUrl(image))
      .catch(e => {
        console.error(e)
        setAssetImageUrl(DefaultNftBG.src)
      })
  }, [listing.asset])

  return (
    <>
      <div className={styles.row}>
        <div className="flex gap-[30px] items-center">
          <div className="w-[50px] h-[50px] lg:w-[50px] lg:h-[50px] overflow-hidden rounded-[10px]">
            {assetImageUrl && (
              <ImageWithFoster src={assetImageUrl} className="w-full h-full rounded-[10px] object-cover" />
            )}
          </div>
          <div>
            <div className={styles.nftName} onClick={() => router.push(`/nft/${listing.asset.mintAddress.toBase58()}`)}>
              {offerType === 'made'
                ? 'You placed an offer of ' +
                  getPriceValue(listing.price.basisPoints.toNumber()) +
                  ' SOL for ' +
                  listing.asset.name
                : 'You received an offer of ' +
                  getPriceValue(listing.price.basisPoints.toNumber()) +
                  ' SOL for ' +
                  listing.asset.name}
            </div>
            <div className={styles.date}>{getLocalDate(new Date(listing.createdAt.toNumber() * 1000))}</div>
          </div>
        </div>
        <div className="flex items-center">
          {offerType === 'made' ? (
            // <OutlineButton label="Cancel" onClick={() => onCancel(listing)} width="138px" height="48px" />
            <div className={styles.button} onClick={() => onCancel(listing)}>
              Cancel
            </div>
          ) : (
            <div className={styles.button} onClick={() => onAccept(listing)}>
              Accept
            </div>
          )}
        </div>
      </div>
    </>
  )
}

const OfferTable = ({ data, onCancel, onAccept, offerType }: OfferTableProps) => {
  return (
    <div className="w-full">
      <div className={styles.headerSection}>
        <div>Arwork</div>
        <div>Action</div>
      </div>
      {data.map((listing, index) => (
        <div className="w-full" key={index}>
          <OfferTableRow listing={listing} onAccept={onAccept} onCancel={onCancel} offerType={offerType} />
        </div>
      ))}
    </div>
  )
}

export default OfferTable
