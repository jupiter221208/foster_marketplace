import React, { useEffect, useMemo, useState } from 'react'

// next components
import Image from 'next/image'

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
import { getShortAddress, getPriceValue } from 'utils/strings'
import { PublicKey } from '@solana/web3.js'
import type { JsonMetadata } from '@metaplex-foundation/js'

export interface ListedNFTCardData {
  address: PublicKey
  name: string
  uri: string
  sellerAddress: PublicKey
  tradeStateAddress: PublicKey
  price: number
  creatorAddress: string
  startTime?: number
  endTime?: number
  highestBid?: {
    buyer_address: string
  }
}

export type ListedNFTCardDataWithJson = ListedNFTCardData & { json: JsonMetadata }

export interface ListedNFTCardProps {
  data: ListedNFTCardData
  type: 'fixed' | 'auction'
  onClick: (uri: string) => any
  onActionClick: (data: ListedNFTCardDataWithJson) => void
  cancelAuction: (data: ListedNFTCardData) => void
  finalizeSale: (data: ListedNFTCardData) => void
}

const ListedNFTCard = ({ data, type, onClick, onActionClick, cancelAuction, finalizeSale }: ListedNFTCardProps) => {
  const { address, name, uri, sellerAddress, creatorAddress, price, startTime, endTime, highestBid } = data

  const viewport = useViewport()
  const isStarted = useMemo(() => {
    if (startTime) {
      const start = new Date(Number(startTime) * 1000)
      const now = new Date()
      return now.getTime() - start.getTime() > 0 ? true : false
    }
    return false
  }, [startTime])

  const isEnded = useMemo(() => {
    if (endTime) {
      const end = new Date(Number(endTime) * 1000)
      const now = new Date()
      return now.getTime() - end.getTime() > 0 ? true : false
    }
    return false
  }, [endTime])

  const [assetJson, setAssetJson] = useState<JsonMetadata>({})
  useEffect(() => {
    if (!uri) return
    fetch(uri)
      .then(r => r.json())
      .then(setAssetJson)
  }, [uri])

  return viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
    <div className={styles.container}>
      <div className={styles.imageArea}>
        <div className={styles.imageContent} onClick={() => onClick(`/browse-nft?id=${address}`)}>
          {assetJson?.animation_url ? (
            <div
              dangerouslySetInnerHTML={{
                __html: `<video autoplay loop muted webkit-playsinline playsinline class="w-full h-full object-cover rounded-[10px] lg:rounded-[24px] overflow-hidden">
                  <source src=${assetJson.animation_url} type="video/mp4" /></video>`,
              }}
            />
          ) : (
            <Image
              src={assetJson?.image}
              alt=""
              layout="fill"
              className="w-full h-full rounded-[10px] lg:rounded-[24px] object-cover"
            />
          )}
        </div>
      </div>
      <div className="w-full mt-[10px] flex flex-wrap justify-center items-center">
        <div className="w-full flex items-center">
          <div className={styles.nftName}>{name}</div>
        </div>
        <div className="w-full flex justify-between items-center">
          <div className={styles.artistName}>{getShortAddress(creatorAddress)}</div>
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
              gradientDirection="right"
              fullWidth
            />
          ) : (
            <>
              {highestBid ? (
                isEnded ? (
                  <GradientButton
                    label={'Finalize Sale'}
                    onClick={() => finalizeSale(data)}
                    height="48px"
                    fontSize="16px"
                    paddingLeft="37px"
                    paddingRight="37px"
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
                  fullWidth
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className={styles.container}>
      <div className="w-full relative rounded-[10px] lg:rounded-[24px] overflow-hidden">
        <Image src={assetJson?.image} alt="" width={321} height={378} layout="responsive" objectFit="cover" />
      </div>
      <div className="w-full mt-[10px] flex flex-wrap justify-center items-center">
        <div className="w-full flex items-center">
          <div className={styles.nftName}>{name}</div>
        </div>
        <div className="w-full flex justify-between items-center">
          <div className={styles.artistName}>{getShortAddress(creatorAddress)}</div>
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
              height="26px"
              fontSize="12px"
              paddingLeft="7px"
              paddingRight="7px"
              borderRadius="6px"
            />
          ) : (
            <>
              {highestBid ? (
                isEnded ? (
                  <GradientButton
                    label={'Finalize Sale'}
                    onClick={() => finalizeSale(data)}
                    fullWidth
                    height="26px"
                    fontSize="12px"
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
    </div>
  )
}

export default ListedNFTCard
