import React, { useEffect, useState } from 'react'

// next components
import Head from 'next/head'
import Image from 'next/image'

import { Swiper, SwiperSlide } from 'swiper/react'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// solana
import { Connection, PublicKey } from '@solana/web3.js'
import { Metaplex, toOriginalEditionAccount, OriginalEditionAccountData } from '@metaplex-foundation/js'
import type { Nft } from '@metaplex-foundation/js'
import { useWallet } from '@solana/wallet-adapter-react'

// components
import PrimaryLayout from 'components/Layout/PrimaryLayout'

// custom functions

// images and icons
import CloseIcon from 'assets/icons/close-screen.svg'

// third party components

// styles
import styles from './index.module.scss'

// resources
import DefaultNftBG from 'assets/images/default-nft-bg.png'
import ShopApparelList from 'assets/json/browse-nft/shop-apparel-list.json'

import nftsAPI from 'apis/nfts'
import { getAbsoluteOgUrl } from 'utils/seo'
import { useAuthentication } from 'hooks/useAuthentication'
import ShoppingCartMerchApparelSection from 'components/pages/BrowseNFT/MerchSection/ShoppingCartMerchApparelSection'
import { NextButton, PreviewButton } from 'components/pages/Studio/MainSection/customButton'
import LoadingComponent from 'pages/explore/LoadingComponent'
import ImageWithFoster from 'components/ImageWithFoster'

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

const Shopping = ({ nftDetail, editionDetail }: BrowseNFTProps) => {
  const cartVersion = localStorage.getItem('cart_version')

  const nftType = nftDetail?.json?.properties?.category as string
  const [openApparelDetail, setOpenApparelDetail] = useState(true)
  const { profileInfo } = useAuthentication()
  const [data, setData] = useState(null)
  const [swiper, setSwiper] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [isFetching, setIsFetching] = useState(false)
  const [loading, setLoading] = useState(false)

  const goNext = () => {
    if (swiper !== null) swiper.slideNext()
    setCurrentStep(swiper.activeIndex)
  }

  const goPrev = () => {
    if (swiper !== null) swiper.slidePrev()
    setCurrentStep(swiper.activeIndex)
  }

  const handleOnChange = swiper => {
    setCurrentStep(swiper.activeIndex)
  }

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
    setLoading(true)
    setIsFetching(true)
  }, [])

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem('checked'))
    setTimeout(() => {
      const promises = orders.map(array => {
        if (cartVersion === 'v1') {
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
        setLoading(false)
        setIsFetching(false)
        setData(data)
      })
    }, 1000)
  }, [])

  let nftName = (nftDetail?.name || nftDetail?.json?.name) ?? ''
  if (editionDetail) {
    let { number, supply, maxSupply } = editionDetail
    let supplyInfo = `#${number}/${supply}`
    if (supply !== maxSupply) supplyInfo = `edition ${number}/${supply}, max ${maxSupply ?? '\u221e'}`
    nftName = `${nftName} (${supplyInfo})`
  }
  let nftTitle = `${nftName} | Foster Marketplace`
  let nftImageUrl = getAbsoluteOgUrl(nftDetail?.json?.image ?? DefaultNftBG.src)

  let nftDescription =
    'Home to creators, collectors, and curators around the world.\n' +
    'Pushing the boundaries of digital art on Solana.'

  const [nftCoverUrl, setNftCoverUrl] = useState('')
  const [fullScreen, setFullScreen] = useState(false)

  return (
    <div className="w-full h-full">
      <Head>
        <title>{nftTitle}</title>
        <meta property="description" content={nftDescription} />

        <meta name="og:title" content={nftTitle} />
        <meta property="og:description" content={nftDescription} />
        {nftType && <meta name="og:type" content={nftType} />}
        <meta name="og:image" content={nftImageUrl} />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={nftTitle} />
        <meta property="twitter:description" content={nftDescription} />
        <meta property="twitter:image" content={nftImageUrl} />

        <link rel="icon" href="/logo.png" />
      </Head>
      <div className="g-container">
        <div className={styles.container}>
          <div className="w-full lg:flex lg:flex-row flex-col">
            <div className="lg:w-[calc(100%-604px)] justify-center lg:px-[50px] p-[10px]">
              {!loading ? (
                <Swiper
                  slidesPerView={1}
                  spaceBetween={10}
                  pagination={{
                    clickable: true,
                  }}
                  onSlideChange={handleOnChange}
                  onSwiper={setSwiper}
                >
                  {data && data.length > 1 && (
                    <>
                      <div className={styles.orderTitle}>
                        {currentStep + 1}/{data?.length} cart items included in order
                      </div>
                      <div className={styles.prevButton} onClick={goPrev}>
                        <PreviewButton />
                      </div>
                      <div className={styles.nextButton} onClick={goNext}>
                        <NextButton />
                      </div>
                    </>
                  )}
                  {data &&
                    data.map((item, index) => (
                      <SwiperSlide key={index}>
                        <div className={styles.blurBackground}>
                          {/* <div className="absolute inset-0">
                            <ImageWithFoster src={item?.nftCoverUrl} className="min-w-full min-h-full object-cover" />
                          </div> */}
                          {/* <div className={styles.blurImage} /> */}
                          <div className="w-full h-full lg:w-[700px] lg:h-[700px] mb-[20px]">
                            <ImageWithFoster
                              width={700}
                              src={cartVersion === 'v1' ? item?.printImageUrl : item?.merchList[0].url}
                              className="max-w-full max-h-full object-cover"
                            />
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                </Swiper>
              ) : (
                <div className="w-full mt-[90px] lg:mt-[200px] h-[230px]">
                  <LoadingComponent isFetching={isFetching} setIsFetching={setIsFetching} />
                </div>
              )}
            </div>
            <div className="w-full lg:min-w-[604px] lg:max-w-[604px] z-10 mb-[30px]">
              {openApparelDetail && (
                <ShoppingCartMerchApparelSection
                  cartVersion={cartVersion}
                  apparelData={data}
                  open={openApparelDetail}
                  setFinishEditing={editing => {}}
                  setApparel={apparel => {}}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Shopping

Shopping.getLayout = function getLayout(page) {
  return <PrimaryLayout>{page}</PrimaryLayout>
}

Shopping.getInitialProps = async function ({ res, query }): Promise<any> {
  let mintAddress
  try {
    mintAddress = new PublicKey(query.id)
  } catch (e: any) {
    console.error(e)
    return {
      error: `could not parse as public key: ${query.id}: ${e.message}`,
    }
  }

  try {
    const metaplex = Metaplex.make(new Connection(process.env.PROVIDER_URL))
    let nftDetail = await metaplex.nfts().findByMint({ mintAddress })
    if (nftDetail.model == 'sft') throw new Error('expected nft, found sft')

    let editionDetail = null
    let originalEditionDetail = null
    if ('parent' in nftDetail.edition) {
      originalEditionDetail = toOriginalEditionAccount(await metaplex.rpc().getAccount(nftDetail.edition.parent)).data
      editionDetail = {
        number: nftDetail.edition.number.toNumber(),
        supply: originalEditionDetail.supply.toNumber(),
        maxSupply: originalEditionDetail.maxSupply?.toNumber(),
      }
    }
    return {
      nftDetail,
      editionDetail,
      originalEditionDetail,
      mintAddress,
    }
  } catch (e: any) {
    console.error(e)
    return {
      error: `could not load nft: ${query.id}: ${e.message}`,
    }
  }
}
