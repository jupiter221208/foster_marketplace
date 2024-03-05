import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// web3
import { PublicKey } from '@solana/web3.js'
import { useMetaplex } from 'hooks/useMetaplex'
import { LazyBidWithAsset } from 'utils/auction.util'
import { getNFTOwner } from 'utils/nfts.utils'

// components
import GradientButton from 'components/Button/GradientButton'
import OutlineButton from 'components/Button/OutlineButton'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo-dark.svg?component'
import DefaultNftBG from 'assets/images/default-nft-bg.png'

// styles
import styles from './index.module.scss'
import { getPriceValue, getShortAddress, timeSince } from 'utils/strings'
import ImageWithFoster from 'components/ImageWithFoster'

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
    setAssetImageUrl(DefaultNftBG.src)

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
      <td>
        <div className="h-[90px] flex justify-start items-center gap-[25px]">
          <div className="ml-[10px]">
            <div className="w-[50px] h-[50px] lg:w-[70px] lg:h-[70px] overflow-hidden rounded-[15px]">
              <ImageWithFoster src={assetImageUrl} className="w-full h-full rounded-[15px] object-cover" />
            </div>
          </div>
          <div className="block">
            <div className={styles.nftName} onClick={() => router.push(`/nft/${listing.asset.mintAddress.toBase58()}`)}>
              {listing.asset.name}
            </div>
          </div>
        </div>
      </td>
      <td className="text-center">{timeSince(listing.createdAt.toNumber())}</td>
      <td className="text-center">
        <div className="flex justify-center gap-[5px] items-center">
          <SolanaLogoIcon />
          {getPriceValue(listing.price.basisPoints.toNumber())}
        </div>
      </td>
      <td className="text-center">{ownerOrBuyerAddress ? getShortAddress(ownerOrBuyerAddress.toBase58()) : '-'}</td>
      <td className="">
        <div className="w-full flex justify-center">
          {offerType === 'made' ? (
            <OutlineButton
              label="Cancel"
              onClick={() => onCancel(listing)}
              color={'var(--checkbox-border-color)'}
              borderColor={'var(--checkbox-border-color)'}
              width="138px"
              height="48px"
            />
          ) : (
            <GradientButton
              label="Accept"
              onClick={() => onAccept(listing)}
              gradientDirection="right"
              width="138px"
              height="48px"
            />
          )}
        </div>
      </td>
    </>
  )
}

const OfferTable = ({ data, onCancel, onAccept, offerType }: OfferTableProps) => {
  return (
    <table id="ArtworksTable" className="w-full table-auto">
      <thead>
        <tr>
          <th className="w-[25%]">
            <div className="text-start pl-[35px]">Name</div>
          </th>
          <th className="w-[20%]">Time</th>
          <th className="w-[20%]">Amount</th>
          <th className="w-[20%]">{offerType === 'made' ? 'Seller' : 'Buyer'}</th>
          <th className="w-[15%]">Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((listing, index) => (
          <tr key={index}>
            <OfferTableRow listing={listing} onAccept={onAccept} onCancel={onCancel} offerType={offerType} />
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default OfferTable
