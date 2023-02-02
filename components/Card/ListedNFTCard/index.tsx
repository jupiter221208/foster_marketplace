import React, { useMemo } from 'react'

// next components
import Image from 'next/image'

// custom components
import GradientButton from 'components/Button/GradientButton'
import Button from 'components/Button'

// custom functions
import { useViewport } from 'utils'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'

// styles
import styles from './index.module.scss'
import { getShortAddress, getPriceValue } from 'utils/strings'
import { PublicKey } from '@solana/web3.js'

const ListedNFTCard = props => {
  const { data, type, onClick, onActionClick, cancelAuction, finalizeSale } = props
  const { startTime, endTime, highestBid, url } = data
  console.log(data)
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

  return viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
    <div className={styles.container}>
      <div className={styles.imageArea}>
        <div className={styles.imageContent} onClick={() => onClick(url)}>
          {data.category === 'video' ? (
            <div
              dangerouslySetInnerHTML={{
                __html: `<video autoplay loop muted webkit-playsinline playsinline class="w-full h-full object-cover rounded-[10px] lg:rounded-[24px] overflow-hidden">
                  <source src=${data.animation_url} type="video/mp4" /></video>`,
              }}
            />
          ) : (
            <img src={data.image} alt="" className="w-full h-full rounded-[10px] lg:rounded-[24px] object-cover" />
          )}
        </div>
      </div>
      <div className="w-full mt-[10px] flex flex-wrap justify-center items-center">
        <div className="w-full flex items-center">
          <div className={styles.nftName}>{data.name}</div>
        </div>
        <div className="w-full flex justify-between items-center">
          <div className={styles.artistName}>{getShortAddress(data.creator.toString())}</div>
          <div className="flex items-center mt-2 gap-[6px]">
            <Image src={SolanaLogoIcon} alt="" />
            <div className={styles.nftName}>{highestBid ? highestBid.amount : getPriceValue(data.price)}</div>
          </div>
        </div>
        <div className="mt-[7px] w-full">
          {type === 'fixed' ? (
            <GradientButton
              label={'Update'}
              onClick={() => onActionClick(data)}
              height="48px"
              fontSize="16px"
              paddingLeft="37px"
              paddingRight="37px"
              backgroundColor01="#326B67"
              backgroundColor02="#63D6CD"
              gradientDirection="right"
              fullWidth
            />
          ) : (
            <>
              {highestBid ? (
                isEnded ? (
                  <GradientButton
                    label={'Finalize Sale'}
                    onClick={() =>
                      finalizeSale(
                        data?.mintAddress,
                        data?.sellerAddress,
                        new PublicKey(data?.highestBid.buyer_address),
                        Number(data?.highestBid.amount)
                      )
                    }
                    height="48px"
                    fontSize="16px"
                    paddingLeft="37px"
                    paddingRight="37px"
                    backgroundColor01="#326B67"
                    backgroundColor02="#63D6CD"
                    gradientDirection="right"
                    fullWidth
                  />
                ) : (
                  <Button
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
                  onClick={() => cancelAuction(data?.mintAddress, data?.sellerAddress, data?.name)}
                  height="48px"
                  fontSize="16px"
                  paddingLeft="37px"
                  paddingRight="37px"
                  backgroundColor01="#326B67"
                  backgroundColor02="#63D6CD"
                  gradientDirection="right"
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
        <Image src={data.image} alt="" width={321} height={378} layout="responsive" objectFit="cover" />
      </div>
      <div className="w-full mt-[10px] flex flex-wrap justify-center items-center">
        <div className="w-full flex items-center">
          <div className={styles.nftName}>{data.name}</div>
        </div>
        <div className="w-full flex justify-between items-center">
          <div className={styles.artistName}>{getShortAddress(data.creator.toString())}</div>
          <div className="flex items-center gap-[6px]">
            <Image src={SolanaLogoIcon} width={15} height={15} alt="" />
            <div className={styles.price}>{getPriceValue(data.price)}</div>
          </div>
        </div>

        <div className="w-full flex justify-between items-center mt-2">
          {type === 'fixed' ? (
            <GradientButton
              label={'Update'}
              onClick={() => onActionClick(data)}
              fullWidth
              height="26px"
              fontSize="12px"
              paddingLeft="7px"
              paddingRight="7px"
              backgroundColor01="#326B67"
              backgroundColor02="#63D6CD"
              gradientDirection="right"
              borderRadius="6px"
            />
          ) : (
            <>
              {highestBid ? (
                isEnded ? (
                  <GradientButton
                    label={'Finalize Sale'}
                    onClick={() =>
                      finalizeSale(
                        data?.mintAddress,
                        data?.sellerAddress,
                        new PublicKey(data?.highestBid.buyer_address),
                        Number(data?.highestBid.amount)
                      )
                    }
                    fullWidth
                    height="26px"
                    fontSize="12px"
                    paddingLeft="7px"
                    paddingRight="7px"
                    backgroundColor01="#326B67"
                    backgroundColor02="#63D6CD"
                    gradientDirection="right"
                    borderRadius="6px"
                  />
                ) : (
                  <Button
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
                  onClick={() => cancelAuction(data?.mintAddress, data?.sellerAddress, data?.name)}
                  height="26px"
                  fontSize="12px"
                  paddingLeft="7px"
                  paddingRight="7px"
                  backgroundColor01="#326B67"
                  backgroundColor02="#63D6CD"
                  gradientDirection="right"
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
