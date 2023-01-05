import React, { useState, useEffect } from 'react'

// next components
import Image from 'next/image'

// custom components
import BrowseArtistCard from 'components/Card/BrowseArtistCard'
import CategoryChip from 'components/Chip/CategoryChip'
import PositiveButton from 'components/Button/PositiveButton'
import NegativeButton from 'components/Button/NegativeButton'
import ReadMoreCollectionModal from 'components/Modal/ReadMoreCollectionModal'

import { getShortDescription } from 'utils/strings'

// custom functions
import { useViewport } from 'utils'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'
import SolanaSolLogoIcon from 'assets/icons/solana-sol-logo.svg'

// styles
import styles from './index.module.scss'

// api
import collectionAPI from 'apis/collections'

const MainSection = props => {
  const { nfts, data } = props
  const viewport = useViewport()
  const [items, setItems] = useState<any>()
  const [owners, setOwners] = useState<any>()
  const [floorPrice, setFloorPrice] = useState<any>()
  const [totalVolume, setTotalVolum] = useState<any>()
  const [saved, setSaved] = useState<boolean>(false)
  const [showReadMore, setShowReadMore] = useState(false)

  useEffect(() => {
    if (data) {
      setSaved(data['saved'])
    }
  }, [data])

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

  const saveCollection = collectionId => {
    collectionAPI.saveCollection(collectionId).then(
      response => {
        if (response) setSaved(true)
      },
      error => {}
    )
  }

  const unsaveCollection = collectionId => {
    setSaved(false)
    // collectionAPI.saveCollection(collectionId).then(
    //   response => {
    //     if (response) setSaved(true)
    //   },
    //   error => {}
    // )
  }
  return viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
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
          <div className="col-span-3"></div>
          <div className="col-span-6">
            <BrowseArtistCard
              image={data?.cover_image}
              collectionName={data?.collection_name}
              artistName={data?.artist_username}
            />
          </div>
          <div className="col-span-3 flex justify-end">
            <div className="w-[89px] lg:w-[146px]">
              {saved ? (
                <NegativeButton
                  width={146}
                  fontFamily="KCDurhamBoxcar"
                  fontSize={30}
                  label="Saved"
                  onClick={() => unsaveCollection(data?.collection_id)}
                />
              ) : (
                <PositiveButton
                  width={146}
                  fontFamily="KCDurhamBoxcar"
                  fontSize={30}
                  label="Save"
                  onClick={() => saveCollection(data?.collection_id)}
                />
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-center w-full flex-wrap mt-[30px] mb-[30px] z-10">
          {data?.description && (
            <span className={styles.description}>
              {getShortDescription(viewport, data?.description) + ' '}
              {/* <span className={styles.readMore} onClick={() => setShowReadMore(!showReadMore)}>
                Read&nbsp;more
              </span> */}
            </span>
          )}
        </div>
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
  ) : (
    // mobile view
    <div className={styles.container}>
      <div className={styles.headerImage}>
        <img
          src={data.banner_image}
          alt=""
          width={1620}
          height={480}
          className="w-full h-full object-cover rounded-none"
        />
      </div>
      <div className="w-full">
        <div className="w-full flex justify-between items-center mt-[-50px] z-10">
          <BrowseArtistCard
            image={data?.cover_image}
            collectionName={data?.collection_name}
            artistName={data?.artist_username}
          />
          <div className="mt-0">
            {saved ? (
              <NegativeButton
                width={80}
                height={29}
                label="Saved"
                fontFamily="KCDurhamBoxcar"
                fontSize={18}
                onClick={() => unsaveCollection(data?.collection_id)}
              />
            ) : (
              <PositiveButton
                width={80}
                height={29}
                label="Save"
                fontFamily="KCDurhamBoxcar"
                fontSize={18}
                onClick={() => saveCollection(data?.collection_id)}
              />
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-start w-full flex-wrap mt-[12px] z-10">
        {data?.description && (
          <span className={styles.description}>
            {getShortDescription(viewport, data?.description) + ' '}
            <span className={styles.readMore} onClick={() => setShowReadMore(!showReadMore)}>
              Read&nbsp;more
            </span>
          </span>
        )}
      </div>

      {showReadMore && (
        <ReadMoreCollectionModal
          open={showReadMore}
          close={() => setShowReadMore(false)}
          artistInfo={data}
          stats={{ items, owners, floorPrice, totalVolume }}
          categoryList={data.categories.split(',')}
        />
      )}
    </div>
  )
}

export default MainSection
