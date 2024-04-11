import React, { useEffect, useState } from 'react'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo-dark-13x11.svg?component'
import MintValuePlus from 'public/icons/mint-value-plus.svg?component'
import MintValueMinus from 'public/icons/mint-value-minus.svg?component'

// styles
import styles from './index.module.scss'

import { calculateTimeLeft } from 'utils/helpers'
import { useViewport } from 'utils'
import PriceInput from 'components/Input/PriceInput'
import LoadingButton from 'components/Button/LoadingButton'
import GradientButton from 'components/Button/GradientButton'
import ClockSandIcon from 'assets/icons/clock-sand-icon.svg?component'

const MintEditionCard = props => {
  const {
    price,
    maxSupply,
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
  // const [timeLeft, setTimeLeft] = useState(null)
  const [timeLeft, setTimeLeft] = useState<any>(null)
  const [auctionStarted, setAuctionStarted] = useState(null)
  const viewport = useViewport()
  const [total, setTotal] = useState(nftPrice)
  const [showDetailTotal, setShowDetailTotal] = useState(false)
  useEffect(() => {
    if (startTime !== undefined && startTime !== null && endTime !== undefined && endTime !== null) {
      setTimeLeft(calculateTimeLeft(getStartTime()))
      const timer = setInterval(() => {
        let time_left = calculateTimeLeft(getStartTime())
        setTimeLeft(time_left)
      }, 1000)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [startTime, endTime])

  const getStartTime = () => {
    let startDate = new Date(startTime)
    let proposalStartTime = startDate.getTime()
    let difference = proposalStartTime - new Date().getTime()

    if (difference >= 0) {
      setAuctionStarted(false)
      return startTime
    } else {
      setIsStarted(true)
      setAuctionStarted(true)

      let endDate = new Date(endTime)
      let proposalEndTime = endDate.getTime()
      let end_difference = proposalEndTime - new Date().getTime()
      if (end_difference < 0) setIsEnded(true)
      return endTime
    }
  }

  return (
    <div className={styles.container}>
      {auctionStarted && (
        <div className="flex gap-[14px] mb-[21px] items-center">
          <div className={styles.grayText}>
            <ClockSandIcon />
          </div>
          <div className="flex gap-[4px]">
            {timeLeft && timeLeft['days'] !== '00' && (
              <div className="flex block justify-center gap-[2px]">
                <div className={styles.whiteText}>{timeLeft['days']}</div>
                <div className={styles.grayText}>d</div>
              </div>
            )}
            {timeLeft && timeLeft['hours'] !== '00' && (
              <div className="flex block justify-center gap-[2px]">
                <div className={styles.whiteText}>{timeLeft['hours']}</div>
                <div className={styles.grayText}>h</div>
              </div>
            )}

            {timeLeft && timeLeft['minutes'] !== '00' && (
              <div className="flex block justify-center gap-[2px]">
                <div className={styles.whiteText}>{timeLeft && timeLeft['minutes']}</div>
                <div className={styles.grayText}>m</div>
              </div>
            )}
            {timeLeft && timeLeft['seconds'] !== '00' && (
              <div className="flex block justify-center gap-[2px]">
                <div className={styles.whiteText}>{timeLeft && timeLeft['seconds']}</div>
                <div className={styles.grayText}>s</div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="w-full">
        <div className={styles.mintQty}>
          <div
            onClick={() => {
              if (mintQty > 0) setMintQty(mintQty - 1)
              setPrice((nftPrice * (mintQty - 1)).toFixed(2))
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
              setMintQty(mintQty + 1)
              setPrice((nftPrice * (mintQty + 1)).toFixed(2))
              setTotal(nftPrice * (mintQty + 1))
            }}
          >
            <div className={styles.minus}>+</div>
          </div>
        </div>
        <div className="w-full mt-[9px] h-[50px] relative">
          {!showDetailTotal ? (
            <div className={styles.mintPrice} onClick={() => setShowDetailTotal(true)}>
              <div className="w-full flex justify-between px-[24px]">
                <div>Total</div>
                <div className="flex gap-[6px] items-center">
                  <SolanaLogoIcon />
                  <div className={styles.total}>{total}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.mintPriceDetail} onClick={() => setShowDetailTotal(false)}>
              <div className="w-full flex justify-between px-[24px]">
                <div>Total</div>
                <div className="flex gap-[6px] items-center">
                  <SolanaLogoIcon />
                  <div className={styles.total}>{total}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="w-full mt-[15px]">
        {mintEditionLoading ? (
          <LoadingButton fullWidth height={50} />
        ) : (
          <GradientButton
            fullWidth
            label="Buy Now"
            direction="rtl"
            fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 16 : 18}
            onClick={() => mintEdition()}
            height={50}
            disabled={mintQty === 0}
          />
        )}
      </div>
    </div>
  )
}

export default MintEditionCard
