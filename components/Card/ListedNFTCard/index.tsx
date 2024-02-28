import React, { useEffect, useMemo, useState } from 'react'

// next components
// import Image from 'next/image'

// custom components
import GradientButton from 'components/Button/GradientButton'
import Button from 'components/Button'

// custom functions
import { useViewport } from 'utils'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo-dark.svg?component'
import SolanaLogoMobileIcon from 'assets/icons/solana-logo-dark-mobile.svg?component'

// styles
import styles from './index.module.scss'
import { getPriceValue, getDisplayUserName } from 'utils/strings'
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useMetaplex } from 'hooks/useMetaplex'
import type { JsonMetadata } from '@metaplex-foundation/js'
import { getBuyerEscrowBalanceDeficit } from 'utils/auctioneer.util'
import EscrowDeficientModal from 'components/Modal/EscrowDeficientModal'
import Link from 'next/link'
import { ListingsAPIData } from 'types/nft'
import OutlineButton from 'components/Button/OutlineButton'

export type ListedNFTCardDataWithJson = ListingsAPIData & { json: JsonMetadata }

export interface ListedNFTCardProps {
  data: ListingsAPIData
  type: 'fixed' | 'auction' | 'edition'
  onClick: (uri: string) => any
  onActionClick: (data: ListedNFTCardDataWithJson) => void
  cancelAuction: any
  finalizeSale: any
}

const ListedNFTCard = ({ data, type, onClick, onActionClick, cancelAuction, finalizeSale }: ListedNFTCardProps) => {
  const { address, name, uri, sellerAddress, creatorAddress, price, startTime, endTime, highestBid } = data
  const viewport = useViewport()
  const { metaplex: mx } = useMetaplex()
  const [deficiency, setDeficiency] = useState(0)
  const [deficencyModal, setDeficencyModal] = useState(false)
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

  console.log(assetJson?.image)

  return viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
    <div className={styles.container}>
      <div className={styles.imageArea}>
        <Link href={`/nft/${address}`} passHref>
          <a>
            <div className={styles.imageContent}>
              {assetJson?.properties?.category === 'video' ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: `<video autoplay loop muted webkit-playsinline playsinline class="w-full h-full object-cover rounded-[10px] lg:rounded-[24px] overflow-hidden">
              <source src=${assetJson.animation_url} type="video/mp4" /></video>`,
                  }}
                />
              ) : (
                <img
                  src={assetJson?.image}
                  alt=""
                  className="w-full h-full rounded-[10px] lg:rounded-[24px] object-cover"
                />
              )}
            </div>
          </a>
        </Link>
      </div>
      <div className="w-full mt-[10px] flex flex-wrap justify-center items-center">
        <div className="w-full flex items-center">
          <div className={styles.nftName}>{name}</div>
        </div>
        <div className="w-full flex justify-between items-center">
          <div className={styles.artistName}>{getDisplayUserName(creatorAddress)}</div>
          <div className="flex items-center mt-2 gap-[6px]">
            <SolanaLogoIcon alt="" />
            <div className={styles.nftName}>{getPriceValue(price)}</div>
          </div>
        </div>
        <div className="mt-[7px] w-full">
          {type === 'fixed' ? (
            <GradientButton
              label={'Update'}
              onClick={() => onActionClick({ ...data, json: assetJson })}
              height="48px"
              fontSize="16px"
              paddingLeft="37px"
              paddingRight="37px"
              borderRadius="10px"
              fullWidth
            />
          ) : type === 'edition' ? (
            <GradientButton
              label={'Cancel Listing'}
              onClick={() => {}}
              height="48px"
              fontSize="16px"
              fullWidth
              borderRadius="10px"
              borderWidth="1px"
            />
          ) : (
            <>
              {highestBid ? (
                isEnded ? (
                  <GradientButton
                    label={'Finalize Sale'}
                    onClick={() => processFinalizeSale()}
                    height="48px"
                    fontSize="16px"
                    paddingLeft="37px"
                    paddingRight="37px"
                    borderRadius="10px"
                    fullWidth
                  />
                ) : (
                  <Button
                    width={'100%'}
                    height="48px"
                    fontSize="16px"
                    paddingLeft="37px"
                    paddingRight="37px"
                    label="Cancel Auction"
                    disabled={true}
                    backgroundColor="#383838"
                    color="#202427"
                    fullWidth
                  />
                )
              ) : (
                <GradientButton
                  label={'Cancel Auction'}
                  onClick={() => cancelAuction(data)}
                  height="48px"
                  fontSize="16px"
                  paddingLeft="37px"
                  paddingRight="37px"
                  borderRadius="10px"
                  fullWidth
                />
              )}
            </>
          )}
        </div>
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
  ) : (
    <div className={styles.container}>
      <div className={styles.imageArea}>
        <div className={styles.imageContent} onClick={() => onClick(`/nft/${address}`)}>
          <img src={assetJson?.image} alt="" className="w-full h-full rounded-[10px] object-cover" />
        </div>
      </div>
      <div className="w-full mt-[10px] flex flex-wrap justify-center items-center">
        <div className="w-full flex items-center">
          <div className={styles.nftName}>{name}</div>
        </div>
        <div className="w-full flex justify-between items-center">
          <div className={styles.artistName}>{getDisplayUserName(creatorAddress)}</div>
          <div className="flex items-center gap-[6px]">
            <SolanaLogoMobileIcon alt="" />
            <div className={styles.price}>{getPriceValue(price)}</div>
          </div>
        </div>

        <div className="w-full flex justify-between items-center mt-2">
          {type === 'fixed' ? (
            <GradientButton
              label={'Update'}
              onClick={() => onActionClick({ ...data, json: assetJson })}
              fullWidth
              height="35px"
              fontSize="14px"
              paddingLeft="7px"
              paddingRight="7px"
              borderRadius="6px"
            />
          ) : type === 'edition' ? (
            <GradientButton
              label={'Cancel Listing'}
              onClick={() => {}}
              height="35px"
              fontSize="14px"
              fullWidth
              borderRadius="6px"
              borderWidth="1px"
            />
          ) : (
            <>
              {highestBid ? (
                isEnded ? (
                  <GradientButton
                    label={'Finalize Sale'}
                    onClick={() => processFinalizeSale()}
                    fullWidth
                    height="35px"
                    fontSize="14px"
                    paddingLeft="7px"
                    paddingRight="7px"
                    borderRadius="6px"
                  />
                ) : (
                  <Button
                    width={'100%'}
                    height="26px"
                    fontSize="12px"
                    paddingLeft="7px"
                    paddingRight="7px"
                    label="Cancel Auction"
                    disabled={true}
                    backgroundColor="#202427"
                    color="rgba(239,240, 246, 0.6)"
                    borderRadius="6px"
                  />
                )
              ) : (
                <GradientButton
                  fullWidth
                  label={'Cancel Auction'}
                  onClick={() => cancelAuction(data)}
                  height="26px"
                  fontSize="12px"
                  paddingLeft="7px"
                  paddingRight="7px"
                  borderRadius="6px"
                />
              )}
            </>
          )}
        </div>
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
