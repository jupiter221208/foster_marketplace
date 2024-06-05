import React, { useEffect, useState } from 'react'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo-dark-13x11.svg?component'
import ArrowDownIcon from 'assets/icons/arrow-down-white.svg?component'
import ArrowUpIcon from 'assets/icons/arrow-up-white.svg?component'

// styles
import styles from './index.module.scss'

import { calculateAuctionTimeLeft, calculateTimeLeft } from 'utils/helpers'
import { useViewport } from 'utils'
import GradientButton from 'components/Button/GradientButton'
import LoadingPrimaryButton from 'components/Button/LoadingPrimaryButton'

const MintEditionCard = props => {
  const {
    price,
    maxSupply,
    buyLimit,
    endTime,
    startTime,
    setIsEnded,
    setIsStarted,
    nftPrice,
    setPrice,
    mintQty,
    setMintQty,
    mintEditionLoading,
    mintEdition,
  } = props

  const [timeLeft, setTimeLeft] = useState<any>(null)
  const [auctionStarted, setAuctionStarted] = useState(false)
  const [auctionEnded, setAuctionEnded] = useState(false)
  const viewport = useViewport()
  const [total, setTotal] = useState(nftPrice)
  const [showDetailTotal, setShowDetailTotal] = useState(false)
  const [buyLimitAlert, setBuyLimitAlert] = useState(false)

  useEffect(() => {
    if (startTime !== undefined && startTime !== null && endTime !== undefined && endTime !== null) {
      setTimeLeft(calculateAuctionTimeLeft(getStartTime()))
      const timer = setInterval(() => {
        let time_left = calculateAuctionTimeLeft(getStartTime())
        setTimeLeft(time_left)
      }, 1000)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [startTime, endTime])

  const getStartTime = () => {
    let startDate = new Date(startTime)
    let offset = startDate.getTimezoneOffset() * 60 * 1000
    let proposalStartTime = startDate.getTime() - offset
    let difference = proposalStartTime - new Date().getTime()
    if (difference >= 0) {
      setAuctionStarted(false)
      return startTime
    } else {
      setIsStarted(true)
      setAuctionStarted(true)

      let endDate = new Date(endTime)
      let offset = startDate.getTimezoneOffset() * 60 * 1000
      let proposalEndTime = endDate.getTime() - offset
      let end_difference = proposalEndTime - new Date().getTime()
      if (end_difference < 0) {
        setIsEnded(true)
        setAuctionEnded(true)
      }
      return endTime
    }
  }

  return (
    <div className="w-full">
      {((auctionStarted && !auctionEnded) || endTime === null) && (
        <div className={styles.container}>
          <div className="w-full">
            <div className="w-full flex justify-between items-center gap-[6px]">
              {endTime !== null && (
                <div className="flex gap-[6px] mt-[-5px] items-center">
                  {/* <div className={styles.whiteText}>Starts&nbsp;In</div> */}
                  {auctionStarted === true ? (
                    <div className="flex gap-[6px] items-center">
                      <div className={styles.whiteText}>Ends&nbsp;in</div>
                    </div>
                  ) : (
                    <div className={styles.whiteText}>Starts&nbsp;in</div>
                  )}
                  <div className="flex gap-[4px]">
                    {timeLeft && timeLeft['days'] !== '00' && (
                      <div className="flex block justify-center">
                        <div className={styles.grayText}>{timeLeft['days']}</div>
                        <div className={styles.grayText}>d</div>
                      </div>
                    )}
                    {timeLeft && timeLeft['hours'] !== '00' && (
                      <div className="flex block justify-center">
                        <div className={styles.grayText}>{timeLeft['hours']}</div>
                        <div className={styles.grayText}>h</div>
                      </div>
                    )}

                    {timeLeft && timeLeft['minutes'] !== '00' && (
                      <div className="flex block justify-center gap-[2px]">
                        <div className={styles.grayText}>{timeLeft && timeLeft['minutes']}</div>
                        <div className={styles.grayText}>m</div>
                      </div>
                    )}
                    {timeLeft && timeLeft['seconds'] !== '00' && (
                      <div className="flex block justify-center gap-[2px]">
                        <div className={styles.grayText}>{timeLeft && timeLeft['seconds']}</div>
                        <div className={styles.grayText}>s</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className={`${auctionStarted && !auctionEnded ? 'w-[160px] lg:w-[180px]' : 'w-full'}`}>
                <div className={styles.mintQty}>
                  <div
                    onClick={() => {
                      if (mintQty > 0) {
                        setMintQty(mintQty - 1)
                        let price = (
                          nftPrice * (mintQty - 1) * 1.05 +
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
                        if (mintQty + 1 > maxSupply) return
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
            </div>

            <div className="w-full mt-[15px] lg:mt-[15px] h-[50px] relative">
              {!showDetailTotal ? (
                <div className={styles.mintPrice} onClick={() => setShowDetailTotal(true)}>
                  <div className="w-full flex justify-between px-[24px]">
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

          <div className="w-full mt-[15px]">
            {mintEditionLoading ? (
              <LoadingPrimaryButton fullWidth />
            ) : (
              <GradientButton
                fullWidth
                backgroundColor01="var(--main-icon-color)"
                backgroundColor02="var(--main-icon-color)"
                color="var(--background-main-color)"
                label="Buy Now"
                disabled={mintQty === 0}
                onClick={() => mintEdition()}
              />
            )}
            {buyLimitAlert && (
              <div className={styles.buyLimitText}>A maximum of {buyLimit} editions can be minted per wallet</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default MintEditionCard
