import React from 'react'

// next components
import { useDispatch } from 'react-redux'

// third party components

// components
import StudioReleaseCard from 'components/Card/StudioReleaseCard'

// custom functions

// json
import StudioApparelList from 'assets/json/hero/hero-apparel-list.json'

// styles
import styles from './index.module.scss'
import WallArtCard from 'components/Card/WallArtCard'

// api

const ShopApparelSection = props => {
  const { title, nftDetail, nftCreator, shopApparelList, openMerchPage, type = '' } = props
  const dispatch = useDispatch()
  const nftName = (nftDetail.name || nftDetail.json?.name) ?? 'No name found'
  const nftCoverUrl = nftDetail.image ?? ''
  const originalUrl = nftDetail.original.image ?? ''
  const mintAddress = nftDetail.mintAddress

  const openPage = item => {
    let params = {
      nftName,
      nftCreator,
      nftCoverUrl,
      mintAddress,
      category: item.category,
      subCategory: item.sub_type,
      base: item.base,
    }
    openMerchPage(params)
  }

  const getStudioItem = item => {
    let studioList = StudioApparelList.filter(studio => studio.name === item.name)
    return studioList[0]
  }

  return (
    shopApparelList.length > 0 && (
      <section className={styles.container}>
        <div className={styles.merchTitle}>Shop Merch</div>
        <div className={styles.border} />

        <div className="w-full grid grid-cols-2 gap-[20px] sm:gap-[30px] mt-[15px] lg:mt-[30px]">
          {shopApparelList.map((item: any, index) => (
            <div key={index}>
              {type === 'apparel' ? (
                <StudioReleaseCard
                  type="nft"
                  image={getStudioItem(item)}
                  nftImage={nftCoverUrl}
                  originalImage={originalUrl}
                  nftName={nftName}
                  userName={item.label}
                  nftCreator={nftCreator}
                  size={item.range}
                  onClick={colorNumber => {
                    dispatch({ type: 'set', apparelColor: colorNumber })
                    openPage(item)
                  }}
                />
              ) : (
                <WallArtCard data={item} onClick={() => openPage(item)} />
              )}
            </div>
          ))}
        </div>
      </section>
    )
  )
}

export default ShopApparelSection
