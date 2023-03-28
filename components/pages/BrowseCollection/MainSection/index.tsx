import React, { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'

import MenuSocialShare from 'components/Menu/MenuSocialShare'
import { isLoggedIn } from 'utils/helpers'
import IconButton from 'components/Button/IconButton'
import uploadFileToS3 from 'apis/aws'
import NftImageEditorModal from 'components/Modal/NftImageEditorModal'
import Alert from 'components/Alert'

// next components
import Image from 'next/image'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'

// custom components
import BrowseArtistCard from 'components/Card/BrowseArtistCard'
import CategoryChip from 'components/Chip/CategoryChip'
import PositiveButton from 'components/Button/PositiveButton'
import NegativeButton from 'components/Button/NegativeButton'
import ReadMoreCollectionModal from 'components/Modal/ReadMoreCollectionModal'

import { getShortDescription } from 'utils/strings'

// custom functions
import { namePublicFile, useViewport } from 'utils'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo.svg'
import SolanaSolLogoIcon from 'assets/icons/solana-sol-logo.svg'
import bannerImage from 'assets/images/collection-banner.png'
import avatarImage from 'assets/images/collection-avatar.png'
import EditorGreenIcon from 'assets/icons/editor-green.svg'
import CameraWhiteIcon from 'assets/icons/camera-white.svg'

// styles
import styles from './index.module.scss'

// api
import collectionAPI from 'apis/collections'

const MainSection = props => {
  const { nfts, data, publicKey } = props
  const viewport = useViewport()
  const dispatch = useDispatch()
  const inputBannerFile = useRef<any>(null)
  const [items, setItems] = useState<any>()
  const [owners, setOwners] = useState<any>()
  const [floorPrice, setFloorPrice] = useState<any>()
  const [totalVolume, setTotalVolum] = useState<any>()
  const [saved, setSaved] = useState<boolean>(false)
  const [showReadMore, setShowReadMore] = useState(false)
  const { setVisible } = useWalletModal()
  const [bannerUploadingToS3, setBannerUploadingToS3] = useState<boolean>(false)
  const [openBannerEditorModal, setOpenBannerEditorModal] = useState(false)
  const [croppedBanner, setCroppedBanner] = useState('')
  const [updateBanner, setUpdateBanner] = useState(false)
  const [bannerPictureUrl, setBannerPictureUrl] = useState('')
  const [showAlert, setShowAlert] = useState(false)
  const [alertData, setAlertData] = useState<any[]>([])
  const [banner, setBanner] = useState<any>()

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
    if (isLoggedIn()) {
      collectionAPI.saveCollection(collectionId).then(
        response => {
          if (response) setSaved(true)
        },
        error => {}
      )
    } else {
      dispatch({ type: 'set', loginAndRefresh: true })
      setVisible(true)
    }
  }

  const unsaveCollection = collectionId => {
    collectionAPI.unsaveCollection(collectionId).then(
      response => {
        setSaved(false)
      },
      error => {}
    )
  }

  useEffect(() => {
    if (croppedBanner !== '' && updateBanner) {
      const fetchData = async url => {
        let response = await fetch(url)
        let blob = await response.blob()
        const file = new File([blob], 'banner.jpg', {
          type: 'image/jpeg',
        })
        const filename = namePublicFile('banner.jpg')
        uploadBannerFile(file, filename)
      }
      fetchData(croppedBanner)
      setUpdateBanner(false)
    }
  }, [updateBanner])

  useEffect(() => {
    if (bannerPictureUrl.length === 0) return
    collectionAPI.updateCollectionBanner(data?.collection_id, { banner_image: bannerPictureUrl }).then(
      response => {
        if (response !== null) {
          dispatch({ type: 'set', profileInfo: response })
        }
      },
      error => {
        console.log(error)
      }
    )
  }, [bannerPictureUrl])

  const showAlertModal = () => {
    setAlertData([
      {
        id: 0,
        title: 'Max File Size Exceeded',
        description: `Oops! It looks like your file exceeded the max file size of 30mb`,
        type: 'error',
      },
    ])
    setShowAlert(true)
  }

  const uploadBannerFile = async (file: any, filename: string) => {
    setBannerUploadingToS3(true)
    const { data, url } = await uploadFileToS3(file, filename)
    setBannerPictureUrl(url + filename)
    setBannerUploadingToS3(false)
  }

  const handleChangeBannerImage = event => {
    const file = event.target.files
    if (file?.length === 0) return

    if (file[0].size > 31457280) {
      showAlertModal()
      return
    }
    setBanner(file)
    setOpenBannerEditorModal(true)
  }

  return (
    <div>
      {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
        <div className={styles.container}>
          <div className="relative w-full">
            {croppedBanner !== '' ? (
              <div className={styles.headerImage}>
                <img src={croppedBanner} alt="" className="w-full rounded-[20px]" />
              </div>
            ) : data !== undefined && data.banner_image !== undefined && data.banner_image.length > 0 ? (
              <div className={styles.headerImage}>
                <img src={data.banner_image} alt="" className="w-full rounded-[20px]" />
              </div>
            ) : (
              <img src={bannerImage.src} alt="" className="w-full lg:h-[412px] rounded-[20px] object-cover mb-[12px]" />
            )}
            {publicKey?.toBase58() === data?.minter_id && (
              <div className="absolute right-4 bottom-4 cursor-pointer">
                <div className={styles.iconBlurView}>
                  <IconButton
                    icon={CameraWhiteIcon}
                    onClick={() => inputBannerFile.current.click()}
                    backgroundColor={'transparent'}
                    borderRadius="100%"
                    width={46}
                    height={46}
                    iconWidth={46}
                    iconHeight={46}
                    disabled={bannerUploadingToS3}
                  />
                </div>
                <input
                  type="file"
                  id="banner-file"
                  accept="image/png, image/jpeg, image/gif"
                  ref={inputBannerFile}
                  style={{ display: 'none' }}
                  onChange={event => handleChangeBannerImage(event)}
                />
              </div>
            )}
          </div>
          <div className="w-full">
            <div className="grid grid-cols-12 items-center -mt-[60px] lg:mt-[-95px]">
              <div className="col-span-3"></div>
              <div className="col-span-6">
                <BrowseArtistCard
                  image={data?.cover_image ?? avatarImage.src}
                  collectionName={data?.collection_name}
                  artistName={data?.artist_username}
                  artistAddress={data?.minter_id}
                />
              </div>
              <div className="col-span-3 flex justify-end">
                <div className="mr-[24px]">
                  <MenuSocialShare
                    type="ellipse"
                    vote={true}
                    message={'Check out this collection on @foster_protocol #fostermarketplace'}
                    url={`/browse-collection/${data?.collection_id}`}
                  />
                </div>
                <div>
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
                <span className={styles.description}>{getShortDescription(viewport, data?.description)}</span>
              )}
            </div>
            <div className="flex justify-center mt-[16px]">
              <div className={`${styles.nftInfo} grid grid-cols-10`}>
                <>
                  <div className="col-span-2 flex justify-center items-center">
                    <div className="text-center">
                      <div className={styles.nftInfoLabel}>{items}</div>
                      <div className={styles.nftInfoValue}>ITEMS</div>
                    </div>
                  </div>
                  <div className="col-span-2 flex justify-center items-center">
                    <div className="text-center">
                      <div className={styles.nftInfoLabel}>{owners}</div>
                      <div className={styles.nftInfoValue}>OWNERS</div>
                    </div>
                  </div>
                  <div className="col-span-3 flex justify-center items-center">
                    <div className="text-center">
                      <div className="flex items-center justify-center">
                        <Image src={SolanaLogoIcon} alt="" />
                        <div className={`${styles.nftInfoLabel} ml-[8px]`}>{floorPrice > 0 ? floorPrice : 'N/A'}</div>
                      </div>
                      <div className={styles.nftInfoValue}>FLOOR PRICE</div>
                    </div>
                  </div>
                  <div className="col-span-3 flex justify-center items-center">
                    <div className="text-center">
                      <div className="flex items-center justify-center">
                        <Image src={SolanaLogoIcon} alt="" />
                        <div className={`${styles.nftInfoLabel} ml-[8px]`}>{totalVolume > 0 ? totalVolume : 'N/A'}</div>
                      </div>

                      <div className={styles.nftInfoValue}>TOTAL VOLUME</div>
                    </div>
                  </div>
                </>
              </div>
            </div>
            {/* <div className="flex justify-center mt-[30px]">
          <div className={styles.categoryList}>
            {data?.categories &&
              data?.categories.split(',').map((item, index) => (
                <div key={index}>
                  <CategoryChip data={{ value: item }} />
                </div>
              ))}
          </div>
        </div> */}
          </div>
          <div></div>
        </div>
      ) : (
        <div className={styles.container}>
          <div className={styles.headerImage}>
            {data?.banner_image !== null && data?.banner_image.length > 0 ? (
              <img src={data?.banner_image} alt="" className="w-full h-full object-cover" />
            ) : (
              <img src={bannerImage.src} alt="" className="w-full h-full object-cover" />
            )}
          </div>
          <div className="w-full">
            <div className="w-full flex justify-between items-center mt-[-50px] z-10">
              <BrowseArtistCard
                image={data?.cover_image ?? avatarImage.src}
                collectionName={data?.collection_name}
                artistName={data?.artist_username}
                artistAddress={data?.minter_id}
              />
              <div className="flex">
                <div className="mr-[11px] lg:mr-[24px]">
                  <MenuSocialShare
                    type="ellipse"
                    vote={true}
                    message={'Check out this collection on @foster_protocol #fostermarketplace'}
                    url={`/browse-collection/${data?.collection_id}`}
                  />
                </div>
                {saved ? (
                  <NegativeButton
                    width={70}
                    height={29}
                    borderRadius={6}
                    label="Saved"
                    fontFamily="KCDurhamBoxcar"
                    fontSize={18}
                    onClick={() => unsaveCollection(data?.collection_id)}
                  />
                ) : (
                  <PositiveButton
                    width={70}
                    height={29}
                    borderRadius={6}
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
                {data?.description}
                {/* {getShortDescription(viewport, data?.description) + ' '}
            <span className={styles.readMore} onClick={() => setShowReadMore(!showReadMore)}>
              Read&nbsp;more
            </span> */}
              </span>
            )}
          </div>

          <div className="w-full flex justify-center mt-2">
            <div className={styles.statesBack}>
              <div className="w-full flex justify-between items-center gap-[5px]">
                <div className={styles.statsArea}>
                  <div className="text-center">
                    <div className="flex justify-center">
                      <div className={styles.nftInfoLabel}>{items}</div>
                    </div>
                    <div className={styles.nftInfoValue}>ITEMS</div>
                  </div>
                </div>
                <div className={styles.statsArea}>
                  <div className="text-center">
                    <div className="flex justify-center">
                      <div className={styles.nftInfoLabel}>{owners}</div>
                    </div>
                    <div className={styles.nftInfoValue}>OWNERS</div>
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-between items-center gap-[5px] mt-[5px]">
                <div className={styles.statsArea}>
                  <div className="text-center">
                    <div className="flex justify-center">
                      <div className="flex gap-2">
                        <Image src={SolanaLogoIcon} alt="" width={18} height={18} />
                        <div className={styles.nftInfoLabel}>{floorPrice > 0 ? floorPrice : 'N/A'}</div>
                      </div>
                    </div>
                    <div className={styles.nftInfoValue}>FLOOR PRICE</div>
                  </div>
                </div>
                <div className={styles.statsArea}>
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <div className="flex gap-2">
                        <Image src={SolanaLogoIcon} alt="" width={18} />
                        <div className={styles.nftInfoLabel}>{totalVolume > 0 ? totalVolume : 'N/A'}</div>
                      </div>
                    </div>

                    <div className={styles.nftInfoValue}>TOTAL VOLUME</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {showReadMore && (
            <ReadMoreCollectionModal
              open={showReadMore}
              close={() => setShowReadMore(false)}
              artistInfo={data}
              stats={{ items, owners, floorPrice, totalVolume }}
              categoryList={data?.categories.split(',')}
            />
          )}
        </div>
      )}
      <NftImageEditorModal
        open={openBannerEditorModal}
        close={() => setOpenBannerEditorModal(false)}
        nftImage={banner}
        getCroppedImage={croppedImage => {
          setUpdateBanner(true)
          setCroppedBanner(croppedImage)
          setOpenBannerEditorModal(false)
        }}
        dimension={{ value: [1080, 320] }}
      />
      <Alert
        open={showAlert}
        close={() => {
          setShowAlert(false)
        }}
        data={alertData}
      />
    </div>
  )
}

export default MainSection
