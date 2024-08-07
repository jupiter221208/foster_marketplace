import React, { useEffect, useState } from 'react'

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
    maxSupply,
    currentSupply,
    buyLimit,
    endTime,
    isEnded,
    isStarted,
    nftPrice,
    merchCost,
    setPrice,
    mintQty,
    setMintQty,
    mintEditionLoading,
    mintEdition,
  } = props

  const [auctionStarted, setAuctionStarted] = useState(false)
  const [auctionEnded, setAuctionEnded] = useState(false)
  const [total, setTotal] = useState('0.00')
  const [showDetailTotal, setShowDetailTotal] = useState(false)
  const [buyLimitAlert, setBuyLimitAlert] = useState(false)

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
      {(endTime === null || (isStarted && !isEnded)) && (
        <div className={styles.container}>
          <div className="w-full">
            <div className="w-full flex gap-[15px] flex-col lg:flex-row">
              <div className={`${auctionStarted && !auctionEnded ? 'w-full lg:w-[180px]' : 'w-full lg:w-[180px]'}`}>
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
              <LoadingPrimaryButton fullWidth height={45} borderRadius={23} />
            ) : (
              <GradientButton
                fullWidth
                height={45}
                borderRadius={23}
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
      )}
    </div>
  )
}

export default MintEditionCard
