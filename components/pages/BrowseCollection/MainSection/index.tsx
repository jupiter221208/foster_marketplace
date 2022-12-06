import React, { useState, useEffect } from 'react'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'

// custom components
import GradientButton from 'components/Button/GradientButton'
import BrowseArtistCard from 'components/Card/BrowseArtistCard'
import CategoryChip from 'components/Chip/CategoryChip'

// custom functions
import { useViewport } from 'utils'

// images and icons
import SaveDarkBlackIcon from 'assets/icons/save-dark-black.svg'
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'
import SolanaSolLogoIcon from 'assets/icons/solana-sol-logo.svg'

// styles
import styles from './index.module.scss'

import { getPriceValue } from 'utils/strings'

const MainSection = props => {
  const { nfts, data } = props

  const router = useRouter()
  const viewport = useViewport()
  const [items, setItems] = useState<any>()
  const [owners, setOwners] = useState<any>()
  const [floorPrice, setFloorPrice] = useState<any>()
  const [totalVolume, setTotalVolum] = useState<any>()

  useEffect(() => {
    setItems(nfts?.length || 0)

    let owners = {}
    if (nfts)
      nfts.forEach(nft => {
        if (owners[nft.artist_id] === undefined) {
          owners[nft.artist_id] = nft.artist_id
        }
      })
    setOwners(Object.keys(owners).length)

    let prices = []
    if (nfts)
      nfts.forEach(nft => {
        if (nft.list_price) prices.push(parseFloat(nft.list_price))
      })
    setFloorPrice(prices.length === 0 ? 0 : Math.min.apply(Math, prices))

    let totalVolume = 0
    if (nfts)
      nfts.forEach(nft => {
        if (nft.list_price) totalVolume += parseFloat(nft.list_price)
      })
    setTotalVolum(totalVolume)
  }, [nfts])

  return (
    <div className={styles.container}>
      {data !== undefined && data.banner_image !== undefined ? (
        <div className={styles.headerImage}>
          <img src={data.banner_image} alt="" className="w-full rounded-[20px]" />
        </div>
      ) : (
        <div className={styles.headerLoading} />
      )}
      <div className="w-full">
        <div className="grid grid-cols-12 items-center -mt-[60px] lg:mt-[-95px]">
          <div className="col-span-3">
            <div className="w-[89px] lg:w-[146px]">
              <GradientButton
                label="Save"
                icon={SaveDarkBlackIcon}
                direction="rtl"
                fullWidth
                onClick={() => {}}
                height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '29px' : '53px'}
                borderRadius={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '6px' : '12px'}
              />
            </div>
          </div>
          <div className="col-span-6">
            <BrowseArtistCard
              image={data?.cover_image}
              collectionName={data?.collection_name}
              artistName={data?.minter_id}
            />
          </div>
          <div className="col-span-3 flex justify-end"></div>
        </div>
        {/* <div className="flex justify-center w-full mt-[32px]">
          <div className="max-w-[734px]">
            <div className={styles.description}>{json?.description}</div>
          </div>
        </div> */}
        <div className="flex justify-center mt-[16px]">
          <div className={`${styles.nftInfo} grid grid-cols-12`}>
            <>
              <div className="col-span-3 flex justify-center items-center">
                <div className="text-center">
                  <div className={styles.nftInfoLabel}>{items}</div>
                  <div className={styles.nftInfoValue}>Items</div>
                </div>
              </div>
              <div className="col-span-3 flex justify-center items-center">
                <div className="text-center">
                  <div className={styles.nftInfoLabel}>{owners}</div>
                  <div className={styles.nftInfoValue}>Owners</div>
                </div>
              </div>
              <div className="col-span-3 flex justify-center items-center">
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    <Image src={SolanaLogoIcon} alt="" />
                    <div className={`${styles.nftInfoLabel} ml-[8px]`}>{floorPrice > 0 ? floorPrice : 'N/A'}</div>
                  </div>
                  <div className={styles.nftInfoValue}>Floor Price</div>
                </div>
              </div>
              <div className="col-span-3 flex justify-center items-center">
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    <Image src={SolanaSolLogoIcon} alt="" />
                    <div className={`${styles.nftInfoLabel} ml-[8px]`}>{totalVolume > 0 ? totalVolume : 'N/A'}</div>
                  </div>

                  <div className={styles.nftInfoValue}>Total Volume</div>
                </div>
              </div>
            </>
          </div>
        </div>
        <div className="flex justify-center mt-[30px]">
          <div className={styles.categoryList}>
            {data.categories &&
              data.categories.split(',').map((item, index) => (
                <div key={index}>
                  <CategoryChip data={{ value: item }} />
                </div>
              ))}
          </div>
        </div>
      </div>
      <div></div>
    </div>
  )
}

export default MainSection
