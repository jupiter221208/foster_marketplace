import React, { useEffect, useState } from 'react'
import { useViewport } from 'utils'

// next components

// solana
import { PublicKey } from '@solana/web3.js'
import { OriginalEditionAccountData } from '@metaplex-foundation/js'
import type { Nft } from '@metaplex-foundation/js'

// custom functions

// images and icons
import LeftBtnIcon from 'assets/icons/arrow-left-17x13.svg?component'
import RightBtnIcon from 'assets/icons/arrow-right-17x13.svg?component'

// third party components

// styles
import styles from './index.module.scss'

// resources
import ShopApparelList from 'assets/json/browse-nft/shop-apparel-list.json'

import nftsAPI from 'apis/nfts'
import ShoppingCartMerchApparelSection from 'components/pages/BrowseNFT/MerchSection/ShoppingCartMerchApparelSection'
import ImageWithFoster from 'components/ImageWithFoster'
import SecondaryLayout from 'components/Layout/SecondaryLayout'

export interface EditionDetail {
  number: number
  supply: number
  maxSupply?: number
}

export interface BrowseNFTProps {
  nftDetail?: Nft
  editionDetail?: EditionDetail
  originalEditionDetail?: OriginalEditionAccountData
  mintAddress?: PublicKey
  error?: string
}

const Shopping = ({ nftDetail }: BrowseNFTProps) => {
  const [cartVersion, setCartVersion] = useState('v2')
  const viewport = useViewport()
  const [data, setData] = useState(null)

  useEffect(() => {
    setTimeout(
      () =>
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        }),
      500
    )
  }, [])

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem('checked'))
    let cart_version = localStorage.getItem('cart_version')
    setCartVersion(cartVersion)

    setTimeout(() => {
      const promises = orders.map(array => {
        if (cart_version === 'v1') {
          return nftsAPI.getDetail(array.id).then(response => {
            const nftName = response.name
            const nftCoverUrl = response.cover_image_url
            const mintAddress = response.address.toString()
            const item = ShopApparelList.find(apparel => apparel.name === array.apparel.description)
            const params = {
              version: 'v1',
              nftName,
              nftCoverUrl,
              mintAddress,
              category: item.category,
              subCategory: item.sub_type,
              base: item.base,
              printImageUrl: array.printImageUrl,
            }
            return params
          })
        } else {
          return array
        }
      })
      Promise.all(promises).then(data => {
        setData(data)
      })
    }, 1000)

    let list = []
    orders.map((item, index) => {
      list.push({
        id: index,
        url: cart_version === 'v1' ? item?.printImageUrl : item?.merchList[0].url,
        selected: index === 0,
      })
    })

    if (list.length > 0) {
      setMerchList(list)
      setSelectedMerch(list[0])
    }
  }, [])

  const [merchList, setMerchList] = useState([])
  const [selectedMerch, setSelectedMerch] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(1)

  const onClickMerch = key => {
    let list = []
    merchList.map((merch, index) => {
      if (key === index) {
        list.push({ id: index, url: merch.url, selected: true })
        setSelectedMerch({ id: index, url: merch.url, selected: true })
        setSelectedIndex(index + 1)
      } else {
        list.push({ id: index, url: merch.url, selected: false })
      }
    })
    setMerchList(list)
  }

  return (
    <div className="w-full block lg:flex">
      <div
        className={`w-full lg:max-w-[58%] lg:min-w-[58%] ${
          viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 'g-container' : 'g-left-container'
        }`}
      >
        <div className="w-full flex">
          {merchList.length > 1 && (
            <div className="hidden lg:block mt-[75px] min-w-[75px]">
              <div className={styles.backStore}>
                Item&nbsp;{selectedIndex}/{merchList.length}
              </div>
              <div className="lg:flex hidden w-[75px] h-[75px] flex flex-col gap-[11px] mt-[30px]">
                {merchList.map((merch, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() => onClickMerch(index)}
                      className={merch.selected ? styles.image : styles.imageHover}
                    >
                      <div className={merch.selected ? styles.selected : styles.unselected}>
                        <ImageWithFoster
                          width={350}
                          height={350}
                          src={merch.url}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          <div className="flex-1 flex justify-center">
            <div className="w-full flex justify-center max-w-[400px] lg:max-w-[625px]">
              <div className={`lg:hidden block h-auto w-full mt-[20px] mb-[20px]`}>
                <div className={styles.mobileImageArea}>
                  <div className={styles.imageArea}>
                    <div className={styles.imageContent}>
                      <ImageWithFoster
                        width={700}
                        src={selectedMerch ? selectedMerch.url : ''}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  {merchList.length > 1 && (
                    <div className="flex lg:hidden w-full mt-[20px] h-[75px] gap-[11px] pl-[16px]">
                      {merchList.map((merch, index) => {
                        return (
                          <div
                            key={index}
                            onClick={() => onClickMerch(index)}
                            className={merch.selected ? styles.image : styles.imageHover}
                          >
                            <div className={merch.selected ? styles.selected : styles.unselected}>
                              <ImageWithFoster
                                width={350}
                                height={350}
                                src={merch.url}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
              <div
                className={`lg:block hidden sm:w-[640px] sm:h-[auto] lg:w-[400px] xl:w-[500px] 2xl:w-[625px] lg:h-[705px] mt-[20px] lg:mt-[75px]`}
              >
                <div className={styles.imageArea}>
                  <div className={styles.imageContent}>
                    <ImageWithFoster
                      width={700}
                      src={selectedMerch ? selectedMerch.url : ''}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                {merchList.length > 1 && selectedMerch && (
                  <div className="w-full mt-[30px] flex justify-center">
                    <div className="flex gap-[50px]">
                      <div
                        className={styles.arrowButton}
                        onClick={() =>
                          selectedMerch.id > 0 ? onClickMerch(selectedMerch.id - 1) : onClickMerch(merchList.length - 1)
                        }
                      >
                        <LeftBtnIcon />
                      </div>
                      <div
                        className={styles.arrowButton}
                        onClick={() =>
                          selectedMerch.id < merchList.length - 1 ? onClickMerch(selectedMerch.id + 1) : onClickMerch(0)
                        }
                      >
                        <RightBtnIcon />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`w-full lg:max-w-[42%] lg:max-w-[42%] ${
          viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 'g-container' : 'g-right-container'
        } lg:flex lg:justify-end ${styles.rightBG}`}
      >
        <ShoppingCartMerchApparelSection
          cartVersion={cartVersion}
          apparelData={data}
          open={true}
          setFinishEditing={editing => {}}
          setApparel={apparel => {}}
        />
      </div>
    </div>
  )
}

export default Shopping

Shopping.getLayout = function getLayout(page) {
  return <SecondaryLayout>{page}</SecondaryLayout>
}
