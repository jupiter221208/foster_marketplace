import React, { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'

import MenuSocialShare from 'components/Menu/MenuSocialShare'
import { isLoggedIn } from 'utils/helpers'
import IconButton from 'components/Button/IconButton'
import uploadFileToS3 from 'apis/aws'
import NftImageEditorModal from 'components/Modal/NftImageEditorModal'
import Alert from 'components/Alert'

// next components
import { useWalletModal } from '@solana/wallet-adapter-react-ui'

// custom components
import BrowseArtistCard from 'components/Card/BrowseArtistCard'
import ReadMoreCollectionModal from 'components/Modal/ReadMoreCollectionModal'

// custom functions
import { namePublicFile, useViewport } from 'utils'

// images and icons
import SolanaLogoIcon from 'assets/icons/solana-logo-dark.svg?component'
import SolanaLogoMobileIcon from 'assets/icons/solana-logo-dark.svg?component'
import bannerImage from 'assets/images/collection-banner.png'
import avatarImage from 'assets/images/collection-avatar.png'
import CameraWhiteIcon from 'assets/icons/editor-green.svg'
import ShareSmallIcon from 'assets/icons/share-black-desktop-small.svg?component'

// styles
import styles from './index.module.scss'

// api
import collectionAPI from 'apis/collections'
import GradientButton from 'components/Button/GradientButton'
import OutlineButton from 'components/Button/OutlineButton'
import SocialShareModal from 'components/Menu/SocialShareModal'

const MainSection = props => {
  const { nfts, data, publicKey, hasloading } = props
  const viewport = useViewport()
  const dispatch = useDispatch()

  const inputBannerFile = useRef<any>(null)
  const [items, setItems] = useState<any>()
  const [owners, setOwners] = useState<any>()
  const [floorPrice, setFloorPrice] = useState<any>()
  const [totalVolume, setTotalVolume] = useState<number>(0.0)
  const [saved, setSaved] = useState<boolean>(false)
  const [showReadMore, setShowReadMore] = useState(false)
  const [openShareModal, setOpenShareModal] = useState(false)
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
      setTotalVolume(data.total_volume)
      setSaved(data['saved'])
    } else {
      setTotalVolume(0)
    }
  }, [data])

  useEffect(() => {
    setItems(nfts?.length || 0)

    let owners = {}
    if (nfts)
      nfts.forEach(nft => {
        if (owners[nft.owner_id] === undefined) {
          owners[nft.owner_id] = nft.owner_id
        }
      })
    setOwners(Object.keys(owners).length)

    let prices = []
    if (nfts)
      nfts.forEach(nft => {
        if (nft.list_price) prices.push(parseFloat(nft.list_price))
      })
    setFloorPrice(prices.length === 0 ? 0 : Math.min.apply(Math, prices))
    console.log(
      publicKey.toBase58(),
      data?.minter_id,
      publicKey?.toBase58() !== data?.minter_id,
      '=============data============='
    )
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
    setBannerPictureUrl(url)
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
            {hasloading ? (
              <div className={`${styles.skeletonLoader} ${styles.headerImage} h-[435px]`}></div>
            ) : (
              <>
                {croppedBanner !== '' ? (
                  <div className={styles.headerImage}>
                    <img src={croppedBanner} alt="" className="w-full h-[435px] object-cover" />
                  </div>
                ) : data?.banner_image ? (
                  <div className={styles.headerImage}>
                    <img src={data.banner_image} alt="" className="w-full h-[435px] object-cover" />
                  </div>
                ) : data?.cover_image ? (
                  <div className={styles.headerImage}>
                    <img src={data?.cover_image} alt="" className="w-full h-[435px] object-cover" />
                  </div>
                ) : (
                  <img src={bannerImage.src} alt="" className="w-full h-[435px] lg:h-[412px] object-cover mb-[12px] " />
                )}
              </>
            )}

            {publicKey?.toBase58() === data?.minter_id && (
              <div className="absolute right-7 bottom-7 cursor-pointer">
                <div className={styles.iconBlurView}>
                  <div className="w-full h-full flex justify-center items-center">
                    <IconButton
                      icon={CameraWhiteIcon}
                      onClick={() => inputBannerFile.current.click()}
                      backgroundColor={'transparent'}
                      borderRadius="100%"
                      width={20}
                      height={20}
                      iconWidth={20}
                      iconHeight={20}
                      disabled={bannerUploadingToS3}
                    />
                  </div>
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
          <div className="g-container mx-auto">
            <div className="w-full flex justify-between items-center -mt-[60px] lg:mt-[-85px]">
              <BrowseArtistCard
                image={data?.cover_image ?? avatarImage.src}
                collectionName={data?.collection_name}
                artistName={data?.artist_username}
                artistAddress={data?.artist_username}
                hasloading={hasloading}
              />
              <div className="flex">
                {hasloading ? (
                  <div className={`${styles.skeletonLoader} w-[45px] h-[45px] mt-[50px] rounded-md`}></div>
                ) : (
                  <div className="flex items-center">
                    <MenuSocialShare
                      type="image"
                      vote={true}
                      message={'Check out this collection on @foster_protocol #fostermarketplace'}
                      url={`/collection/${data?.collection_id}`}
                    />
                  </div>
                )}
                {publicKey?.toBase58() !== data?.minter_id && (
                  <div className="w-[100px] overflow-hidden rounded-[12px] ml-[24px]">
                    {saved ? (
                      hasloading ? (
                        <div className={`${styles.skeletonLoader} w-[100px] h-[45px] mt-[50px] rounded-md`}></div>
                      ) : (
                        <OutlineButton
                          borderColor="var(--follow-btn-border-mobile)"
                          width={100}
                          height={45}
                          label="Saved"
                          onClick={() => unsaveCollection(data?.collection_id)}
                        />
                      )
                    ) : hasloading ? (
                      <div className={`${styles.skeletonLoader} w-[100px] h-[45px] mt-[50px] rounded-md`}></div>
                    ) : (
                      <GradientButton
                        width={100}
                        height={45}
                        label="Save"
                        backgroundColor
                        onClick={() => saveCollection(data?.collection_id)}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>

            {hasloading ? (
              <div className={`${styles.skeletonLoader} w-1/2 h-[30px] mt-[50px] ml-[24px] rounded-full`}></div>
            ) : (
              <>
                <div className="flex mt-[40px] gap-[15px]">
                  <div className="flex gap-[6px] items-center">
                    <div className={styles.nftInfoLabel}>
                      <div className="mt-[4px]">
                        <SolanaLogoIcon alt="" />
                      </div>
                      <div className={`ml-[6px]`}>{totalVolume > 0 ? totalVolume : 'N/A'}</div>
                    </div>
                    <div className={styles.nftInfoValue}>Total&nbsp;Volume</div>
                  </div>
                  <div className="flex gap-[6px] items-center">
                    <div className={styles.nftInfoLabel}>
                      <div className="mt-[4px]">
                        <SolanaLogoIcon alt="" />
                      </div>
                      <div className={`ml-[6px]`}>{floorPrice > 0 ? floorPrice : 'N/A'}</div>
                    </div>
                    <div className={styles.nftInfoValue}>Floor&nbsp;Price</div>
                  </div>
                  <div className="flex gap-[6px] items-center">
                    <div className={styles.nftInfoLabel}>{items}</div>
                    <div className={styles.nftInfoValue}>Items</div>
                  </div>
                  <div className="flex gap-[6px] items-center">
                    <div className={styles.nftInfoLabel}>{owners}</div>
                    <div className={styles.nftInfoValue}>Owners</div>
                  </div>
                </div>
              </>
            )}
          </div>
          <div></div>
        </div>
      ) : (
        <div>
          <div className={styles.container}>
            {hasloading ? (
              <div className={`${styles.skeletonLoader} ${styles.headerImage}`}></div>
            ) : (
              <div className={styles.headerImage}>
                {data?.banner_image !== null && data?.banner_image.length > 0 ? (
                  <img src={data?.banner_image} alt="" className="w-full h-full object-cover" />
                ) : data?.cover_image ? (
                  <img src={data?.cover_image} alt="" className="w-full h-[132px] object-cover" />
                ) : (
                  <img src={bannerImage.src} alt="" className="w-full h-full object-cover" />
                )}
                {publicKey?.toBase58() === data?.minter_id && (
                  <div className="absolute right-4 bottom-2 cursor-pointer">
                    <div className={styles.iconBlurView}>
                      <div className="w-full h-full flex justify-center items-center">
                        <IconButton
                          icon={CameraWhiteIcon}
                          onClick={() => inputBannerFile.current.click()}
                          backgroundColor={'transparent'}
                          borderRadius="100%"
                          width={20}
                          height={20}
                          iconWidth={20}
                          iconHeight={20}
                          disabled={bannerUploadingToS3}
                        />
                      </div>
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
            )}

            <div className="g-container">
              <div className="w-full">
                <div className="w-full flex justify-between items-center mt-[-50px] z-10">
                  <BrowseArtistCard
                    image={data?.cover_image ?? avatarImage.src}
                    collectionName={data?.collection_name}
                    artistName={data?.artist_username}
                    artistAddress={data?.artist_username}
                    hasloading={hasloading}
                  />
                  <div className="flex">
                    {hasloading ? (
                      <div className={`${styles.skeletonLoader} w-[29px] h-[29px] rounded-md mt-[30px]`}></div>
                    ) : (
                      <div className="">
                        <div onClick={() => setOpenShareModal(true)}>
                          <ShareSmallIcon alt="" />
                        </div>
                      </div>
                    )}

                    {publicKey?.toBase58() !== data?.minter_id && (
                      <div className="w-[70px] overflow-hidden rounded-[6px] ml-[11px] lg:ml-[24px]">
                        {saved ? (
                          hasloading ? (
                            <div className={`${styles.skeletonLoader} w-[70px] h-[29px] mt-[30px] rounded-md`}></div>
                          ) : (
                            <OutlineButton
                              width={70}
                              height={29}
                              borderRadius={6}
                              borderColor="var(--follow-btn-border-mobile)"
                              label="Saved"
                              onClick={() => unsaveCollection(data?.collection_id)}
                            />
                          )
                        ) : hasloading ? (
                          <div className={`${styles.skeletonLoader} w-[70px] h-[29px] mt-[30px] rounded-md`}></div>
                        ) : (
                          <GradientButton
                            width={70}
                            height={29}
                            borderRadius={6}
                            label="Save"
                            backgroundColor
                            onClick={() => saveCollection(data?.collection_id)}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="w-full flex justify-center mt-[30px]">
                <div className={styles.statesBack}>
                  <div className="w-full flex justify-between items-center gap-[5px]">
                    {hasloading ? (
                      <div className={`${styles.skeletonLoader} ${styles.statsArea} h-[30px]`}></div>
                    ) : (
                      <div className={styles.statsArea}>
                        <div className="text-center">
                          <div className="flex justify-center">
                            <div className={styles.nftInfoLabelMobile}>{items}</div>
                          </div>
                          <div className={styles.nftInfoValueMobile}>Items</div>
                        </div>
                      </div>
                    )}

                    {hasloading ? (
                      <div className={`${styles.skeletonLoader} ${styles.statsArea} h-[30px]`}></div>
                    ) : (
                      <div className={styles.statsArea}>
                        <div className="text-center">
                          <div className="flex justify-center">
                            <div className={styles.nftInfoLabelMobile}>{owners}</div>
                          </div>
                          <div className={styles.nftInfoValueMobile}>Owners</div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="w-full flex justify-between items-center gap-[5px] mt-[5px]">
                    {hasloading ? (
                      <div className={`${styles.skeletonLoader} ${styles.statsArea} h-[30px]`}></div>
                    ) : (
                      <div className={styles.statsArea}>
                        <div className="text-center">
                          <div className="flex justify-center">
                            <div className="flex gap-2 items-center">
                              <SolanaLogoMobileIcon />

                              <div className={styles.nftInfoLabelMobile}>{floorPrice > 0 ? floorPrice : 'N/A'}</div>
                            </div>
                          </div>
                          <div className={styles.nftInfoValueMobile}>Floor Price</div>
                        </div>
                      </div>
                    )}
                    {hasloading ? (
                      <div className={`${styles.skeletonLoader} ${styles.statsArea} h-[30px]`}></div>
                    ) : (
                      <div className={styles.statsArea}>
                        <div className="text-center">
                          <div className="flex items-center justify-center">
                            <div className="flex gap-2 items-center">
                              <SolanaLogoMobileIcon />

                              <div className={styles.nftInfoLabelMobile}>
                                {totalVolume > 0 ? totalVolume.toFixed(2) : 'N/A'}
                              </div>
                            </div>
                          </div>

                          <div className={styles.nftInfoValueMobile}>Total Volume</div>
                        </div>
                      </div>
                    )}
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
      {openShareModal && (
        <SocialShareModal
          open={openShareModal}
          close={() => setOpenShareModal(false)}
          vote={true}
          message={'Check out this collection on @foster_protocol #fostermarketplace'}
          url={`/collection/${data?.collection_id}`}
        />
      )}
    </div>
  )
}

export default MainSection
