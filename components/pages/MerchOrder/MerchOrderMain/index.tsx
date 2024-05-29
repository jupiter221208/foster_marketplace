import React, { useState } from 'react'
import { useRouter } from 'next/router'

// next component

//components

// images
import ShareSmallIcon from 'assets/icons/share-black-menu.svg?component'
import ClockSandIcon from 'assets/icons/clock-sand-icon-medium.svg?component'
import SolanaLogoIcon from 'assets/icons/solana-logo-dark-13x11.svg?component'

// json

// styles
import styles from './index.module.scss'
import ImageWithFoster from 'components/ImageWithFoster'
import DropdownSizeMenu from 'components/Menu/DropdownSizeMenu'
import LoadingPrimaryButton from 'components/Button/LoadingPrimaryButton'
import PrimaryButton from 'components/Button/PrimaryButton'

const MerchOrderMain = props => {
  const { type, username, onClickBuyNow } = props

  const router = useRouter()
  const sizeList = [
    { id: 0, name: 'S' },
    { id: 1, name: 'M' },
    { id: 2, name: 'L' },
    { id: 3, name: 'XL' },
    { id: 4, name: '2XL' },
  ]
  const [size, setSize] = useState(sizeList[0])
  const [mintQty, setMintQty] = useState(0)
  const [nftPrice, setNftPrice] = useState(1.4)
  const [buyNowLoading, setBuyNowLoading] = useState(false)

  return (
    <div className={styles.container}>
      <div className="w-full h-auto sm:h-[540px] lg:px-[30px] pt-[25px] pb-[15px] flex flex-col justify-between">
        <div className="w-full">
          <div className="w-full lg:flex hidden justify-between">
            <div className={styles.backStore} onClick={() => router.push(`/${username}/merch`)}>
              BACK TO STORE
            </div>
            <div className={styles.shareIcon}>
              <ShareSmallIcon alt="" />
            </div>
          </div>
          <div className={styles.productName}>product_name</div>
          <div className="mt-[30px]">
            <div className={styles.creator}>Creator</div>
            <div className="mt-[7px] flex flex-wrap gap-[15px]">
              <div className={styles.creatorRound}>
                <div className="w-[30px] h-[30px] rounded-full overflow-hidden">
                  <ImageWithFoster
                    src={
                      'https://cdn.helius-rpc.com/cdn-cgi/image/quality=75,width=500/https%3A%2F%2Farweave.net%2F2vtcGtzEh-I7c8QRYfWD6XmFvbKf_kvULxb4lOtrXdM'
                    }
                    alt=""
                  />
                </div>
                creator_name
              </div>
              <div className={styles.creatorRound}>Limited Supply</div>
              <div className={styles.creatorRound}>23/50 left</div>
            </div>
          </div>
          <div className="mt-[30px]">
            <div className={styles.desc}>Description</div>
            <div className={`mt-[10px] ${styles.content}`}>
              Unisex Premium Hoodie | Cotton Heritage M2580 | Embroidery | White
            </div>
          </div>
          {type === 'physical' && (
            <div className="mt-[30px] mb-[30px]">
              <div className={styles.desc}>Shipping & Handling</div>
              <div className={`mt-[10px] ${styles.content}`}>
                Domestic & international shipping will be paid by the buyer.
              </div>
            </div>
          )}
        </div>
        <div className="w-full flex justify-between">
          <div className="flex flex-wrap items-end gap-[6px]">
            <div>
              <ClockSandIcon />
            </div>
            <div className={styles.endsIn}>Ends in</div>
            <div className={styles.endsTime}>02:05:10:30</div>
          </div>
          {type !== 'physical' && (
            <div>
              <DropdownSizeMenu
                label={size.name}
                data={sizeList}
                selectedItem={size}
                setSelectedItem={item => {
                  setSize(item)
                }}
              />
              <div className="flex items-center mt-[10px]">
                <div className={styles.sizeChart}>Select Size</div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.borderLine} />
      <div className="w-full lg:px-[30px] mt-[20px]">
        <div className="w-full flex justify-between">
          <div className="w-[180px]">
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
                  let price = (
                    nftPrice * (mintQty + 1) * 1.05 +
                    0.01 * (mintQty + 1) +
                    0.013 * (mintQty + 1) +
                    0.0003
                  ).toFixed(2)
                  setMintQty(mintQty + 1)
                }}
              >
                <div className={styles.minus}>+</div>
              </div>
            </div>
          </div>
          <div>
            <div className="flex gap-[6px] items-center mb-[2px]">
              <SolanaLogoIcon className="mt-[4px]" />
              <div className={styles.price}>0.65</div>
            </div>
            <div className={styles.priceUS}>$642.00</div>
          </div>
        </div>

        <div className="w-full mt-[18px]">
          {buyNowLoading ? (
            <LoadingPrimaryButton fullWidth />
          ) : (
            <PrimaryButton fullWidth type="buy-now" label="Buy Now" onClick={() => onClickBuyNow()} />
          )}
        </div>
      </div>
    </div>
  )
}

export default MerchOrderMain
