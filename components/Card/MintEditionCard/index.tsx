import React, { useEffect, useState } from 'react'
import { useViewport } from 'utils'

// utilies
import { calculateAuctionTimeLeft } from 'utils/helpers'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo-dark-13x11.svg?component'
import ArrowDownIcon from 'assets/icons/arrow-down-white.svg?component'
import ArrowUpIcon from 'assets/icons/arrow-up-white.svg?component'

// styles
import styles from './index.module.scss'

import LoadingPrimaryButton from 'components/Button/LoadingPrimaryButton'
import GradientButton from 'components/Button/GradientButton'

const MintEditionCard = props => {
  const {
    price,
    editionType,
    maxSupply,
    currentSupply,
    buyLimit,
    isEnded,
    isStarted,
    nftPrice,
    merchCost,
    setPrice,
    mintQty,
    setMintQty,
    mintEditionLoading,
    mintEdition,
    isEditionListing,
    endEditionTime,
    startEditionTime,
    setIsEnded,
    setIsStarted,
  } = props
  const viewport = useViewport()
  const [timeLeft, setTimeLeft] = useState(null)
  const [auctionStarted, setAuctionStarted] = useState(null)
  const [total, setTotal] = useState('0.00')
  const [showDetailTotal, setShowDetailTotal] = useState(false)
  const [buyLimitAlert, setBuyLimitAlert] = useState(false)

  useEffect(() => {
    if (
      startEditionTime !== undefined &&
      startEditionTime !== null &&
      endEditionTime !== undefined &&
      endEditionTime !== null
    ) {
      let time = getStartEditionTime()
      if (!time) return
      setTimeLeft(calculateAuctionTimeLeft(time))
      const timer = setInterval(() => {
        let time1 = getStartEditionTime()
        if (!time1) {
          setTimeLeft(null)
          return
        }
        let time_left = calculateAuctionTimeLeft(time1)
        setTimeLeft(time_left)
      }, 1000)

      return () => {
        clearTimeout(timer)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startEditionTime, endEditionTime])

  const getStartEditionTime = () => {
    let startDate = new Date(startEditionTime)
    let offset = startDate.getTimezoneOffset() * 60 * 1000
    let proposalStartTime = startDate.getTime() - offset
    let difference = proposalStartTime - new Date().getTime()

    if (difference >= 0) {
      setAuctionStarted(false)
      return startEditionTime
    } else {
      setIsStarted(true)
      setAuctionStarted(true)

      let endDate = new Date(endEditionTime)
      let offset = startDate.getTimezoneOffset() * 60 * 1000
      let proposalEndTime = endDate.getTime() - offset
      let end_difference = proposalEndTime - new Date().getTime()
      if (end_difference < 0) {
        setIsEnded(true)
        return null
      }
      return endEditionTime
    }
  }

  const isExpired = time => {
    if (time['days'] === '00' && time['hours'] === '00' && time['minutes'] === '00' && time['seconds'] === '00')
      return true
    return false
  }

  useEffect(() => {
    let total = nftPrice * 1.05 + (merchCost ? merchCost : 0) + 0.01 * 1 + 0.013 * 1 + 0.0003
    setTotal(total.toFixed(2))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    let total = nftPrice * 1.05 + (merchCost ? merchCost : 0) + 0.01 * 1 + 0.013 * 1 + 0.0003
    setTotal(total.toFixed(2))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [merchCost])

  return (
    <div className="w-full">
      {!isEditionListing ? (
        <div className={styles.container}>
          <div className="w-full flex justify-between">
            <div>
              <div className={styles.creator}>{editionType === 'master_le' ? 'Limited Edition' : 'Open Edition'}</div>
              <div className={`${styles.supply} mt-[9px]`}>
                {editionType === 'master_oe'
                  ? `${currentSupply} Sold`
                  : `${maxSupply - currentSupply}/${maxSupply} Left`}
              </div>
            </div>
            <div>
              <div className={`${styles.creator} text-end`}>{'Time Remaining'}</div>
              <div className={`${styles.supply} mt-[9px] text-end`}>{'Not listed'}</div>
            </div>
          </div>
        </div>
      ) : endEditionTime === null || (isStarted && !isEnded) ? (
        <div className={styles.container}>
          <div className="w-full flex justify-between">
            <div>
              <div className={styles.creator}>{editionType === 'master_le' ? 'Limited Edition' : 'Open Edition'}</div>
              <div className={`${styles.supply} mt-[9px]`}>
                {editionType === 'master_oe'
                  ? `${currentSupply} Sold`
                  : `${maxSupply - currentSupply}/${maxSupply} Left`}
              </div>
            </div>
            <div>
              {timeLeft && !isExpired(timeLeft) && isEditionListing ? (
                <div>
                  <div className={`${styles.creator} text-end`}>
                    {auctionStarted === true ? 'Time Remaining' : 'Starts In'}
                  </div>

                  <div className={`${styles.bidCountContainer} pl-[12px] mt-[9px]`}>
                    {timeLeft && timeLeft['days'] !== '00' && (
                      <div>
                        <div className={styles.endTime}>
                          {timeLeft && timeLeft['days']}
                          {timeLeft && <div className={styles.bidDesc}>d</div>}
                        </div>
                      </div>
                    )}
                    <div className={styles.endTimeContainer}>
                      <div className={styles.endTime}>
                        {timeLeft && timeLeft['hours']}
                        {timeLeft && <div className={styles.bidDesc}>h</div>}
                      </div>
                    </div>
                    <div className={styles.endTimeContainer}>
                      <div className={styles.endTime}>
                        {timeLeft && timeLeft['minutes']}
                        {timeLeft && <div className={styles.bidDesc}>m</div>}
                      </div>
                    </div>
                    <div className={styles.endTimeContainer}>
                      <div className={styles.endTime}>
                        {timeLeft && timeLeft['seconds']}
                        {timeLeft && <div className={styles.bidDesc}>s</div>}
                      </div>
                    </div>
                  </div>
                </div>
              ) : isEditionListing ? (
                endEditionTime === null ? (
                  <div>
                    <div className={`${styles.creator} text-end`}>{'Time Remaining'}</div>
                    <div className={`${styles.endTime} mt-[9px]`}>No expiration</div>
                  </div>
                ) : isExpired(timeLeft) ? (
                  <div>
                    <div className={`${styles.creator} text-end`}>{'Time Remaining'}</div>
                    <div className={`${styles.endTime} mt-[9px]`}>Listing expired</div>
                  </div>
                ) : (
                  <></>
                )
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="w-full mt-[15px]">
            <div className="w-full flex gap-[15px] flex-col lg:flex-col xl:flex-row">
              <div className={`w-full xl:w-[160px] 2xl:w-[180px]`}>
                <div className={styles.mintQty}>
                  <div
                    onClick={() => {
                      if (mintQty > 0) {
                        setMintQty(mintQty - 1)
                        let price = (
                          nftPrice * (mintQty - 1) * 1.05 +
                          (merchCost ? merchCost * (mintQty - 1) : 0) +
                          0.01 * (mintQty - 1) +
                          0.013 * (mintQty - 1) +
                          0.0003
                        ).toFixed(2)
                        setPrice(price)
                        setTotal(price)
                      }
                    }}
                  >
                    <div className={styles.minus}>-</div>
                  </div>
                  <div className={styles.mintLabel}>
                    Qty&nbsp;<div className={styles.mintValue}>{mintQty}</div>
                  </div>
                  <div
                    onClick={() => {
                      if (maxSupply !== null) {
                        if (mintQty + 1 > maxSupply - currentSupply) return
                      }
                      if (buyLimit !== null && buyLimit > 0) {
                        if (mintQty + 1 > parseInt(buyLimit)) {
                          setBuyLimitAlert(true)
                          setTimeout(() => {
                            setBuyLimitAlert(false)
                          }, 3000)
                          return
                        }
                      }
                      let price = (
                        nftPrice * (mintQty + 1) * 1.05 +
                        (merchCost ? merchCost * (mintQty + 1) : 0) +
                        0.01 * (mintQty + 1) +
                        0.013 * (mintQty + 1) +
                        0.0003
                      ).toFixed(2)
                      setMintQty(mintQty + 1)
                      setPrice(price)
                      setTotal(price)
                    }}
                  >
                    <div className={styles.minus}>+</div>
                  </div>
                </div>
              </div>
              <div className="w-full h-[45px] relative">
                {!showDetailTotal ? (
                  <div className={styles.mintPrice} onClick={() => setShowDetailTotal(true)}>
                    <div className="w-full flex justify-between px-[24px] xl:px-[18px] 2xl:px-[24px]">
                      <div>Total</div>
                      <div className="flex gap-[6px] items-center">
                        <SolanaLogoIcon className="mt-[2px]" />
                        <div className={styles.total}>{total}</div>
                        <ArrowDownIcon className="mt-[2px] ml-[4px]" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={styles.mintPriceDetail} onClick={() => setShowDetailTotal(false)}>
                    <div className="w-full flex justify-between mb-[15px]">
                      <div>Total</div>
                      <div className="flex gap-[6px] items-center">
                        <SolanaLogoIcon className="mt-[2px]" />
                        <div className={styles.total}>{total}</div>
                        <ArrowUpIcon className="mt-[2px] ml-[4px]" />
                      </div>
                    </div>
                    <div className={styles.priceBorder} />
                    <div className="w-full flex justify-between mt-[15px]">
                      <div className={styles.priceLabel}>Quantity</div>
                      <div className={styles.priceValue}>{mintQty}</div>
                    </div>
                    <div className="w-full flex justify-between mt-[9px]">
                      <div className={styles.priceLabel}>Artwork Cost</div>
                      <div className={styles.priceValue}>{(nftPrice * mintQty).toFixed(2)}</div>
                    </div>
                    {merchCost && (
                      <div className="w-full flex justify-between mt-[9px]">
                        <div className={styles.priceLabel}>Merch Production Cost</div>
                        <div className={styles.priceValue}>{(merchCost * mintQty).toFixed(2)}</div>
                      </div>
                    )}
                    <div className="w-full flex justify-between mt-[9px]">
                      <div className={styles.priceLabel}>Foster Fee (5%)</div>
                      <div className={styles.priceValue}>{(nftPrice * mintQty * 0.05).toFixed(2)}&nbsp;SOL</div>
                    </div>
                    <div className="w-full flex justify-between mt-[9px]">
                      <div className={styles.priceLabel}>Metaplex Fee</div>
                      <div className={styles.priceValue}>{0.01 * mintQty}&nbsp;SOL</div>
                    </div>
                    <div className="w-full flex justify-between mt-[9px]">
                      <div className={styles.priceLabel}>Solana Account Fee</div>
                      <div className={styles.priceValue}>~{0.013 * mintQty}&nbsp;SOL</div>
                    </div>
                    <div className="w-full flex justify-between mt-[9px]">
                      <div className={styles.priceLabel}>Transaction Priority Fee</div>
                      <div className={styles.priceValue}>0.0003 SOL</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-full mt-[15px]">
            {mintEditionLoading ? (
              <LoadingPrimaryButton
                fullWidth
                height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 50 : 45}
                borderRadius={23}
              />
            ) : (
              <GradientButton
                fullWidth
                height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 50 : 45}
                borderRadius={23}
                fontSize={16}
                label="Collect Edition"
                disabled={mintQty === 0}
                onClick={() => mintEdition()}
              />
            )}
            {buyLimitAlert && (
              <div className={styles.buyLimitText}>A maximum of {buyLimit} editions can be minted per wallet</div>
            )}
          </div>
        </div>
      ) : isEnded ? (
        <div className={styles.container}>
          <div className="w-full flex justify-between">
            <div>
              <div className={styles.creator}>{editionType === 'master_le' ? 'Limited Edition' : 'Open Edition'}</div>
              <div className={`${styles.supply} mt-[9px]`}>
                {editionType === 'master_oe'
                  ? `${currentSupply} Sold`
                  : `${maxSupply - currentSupply}/${maxSupply} Left`}
              </div>
            </div>
            <div>
              <div className={`${styles.creator} text-end`}>{'Time Remaining'}</div>
              <div className={`${styles.supply} mt-[9px] text-end`}>{'Listing Expired'}</div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default MintEditionCard
