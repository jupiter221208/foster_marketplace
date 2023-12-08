import React, { useEffect, useState } from 'react'

// next components
import Head from 'next/head'

// third party components
import { useSelector, useDispatch } from 'react-redux'

// components
import SecondaryLayout from 'components/Layout/SecondaryLayout'
import MintAudioPlayer from 'components/MediaPlayer/MintAudioPlayer'

// solana components
import { Keypair, PublicKey } from '@solana/web3.js'
import { toMetaplexFile, JsonMetadata } from '@metaplex-foundation/js'

import { useMetaplex } from 'hooks/useMetaplex'
import { useLocalWalletBundlr } from 'hooks/useLocalWalletBundlr'

import DimensionMenu from 'components/Menu/DimensionMenu'
import Step01SingleNFTSection from 'components/pages/Create/SingleNFT/Step01SingleNFTSection'
import Step02SingleNFTSection from 'components/pages/Create/SingleNFT/Step02SingleNFTSection'
import Step03SingleNFTSection from 'components/pages/Create/SingleNFT/Step03SingleNFTSection'
import SuccessMintSingleNFTSection from 'components/pages/Create/SingleNFT/SuccessMintSingleNFTSection'
import NftImageEditorModal from 'components/Modal/NftImageEditorModal'
import ProgressingModal from 'components/Modal/ProgressingModal'

import Chip from 'components/Chip'
import Stepper from 'components/Stepper'
import Button from 'components/Button'
import GradientButton from 'components/Button/GradientButton'

// custom functions
import { useViewport } from 'utils'

// images and icons

// json
import NFTDimensionList from 'assets/json/nft-dimension-list.json'
import CategoryList from 'assets/json/popular-category.json'

// call apis
import axios from 'axios'
import nftsAPI from 'apis/nfts'

// styles
import styles from './single-nft.module.scss'
import LoadingButton from 'components/Button/LoadingButton'
import IconButtonWithSVG from 'components/Button/IconButtonWithSVG'
import { useAuthentication } from 'hooks/useAuthentication'
import ModelViewer, { getSnapshot } from 'components/ModelViewer'

const SingleNft = () => {
  const viewport = useViewport()
  const dispatch = useDispatch()

  const isLoading = useSelector<any>(state => state.isLoading)

  const [screenWidth, setScreenWidth] = useState(1920)
  const [screenLoaded, setScreenLoaded] = useState(false)

  useEffect(() => {
    dispatch({ type: 'set', isLoading: false })
    setTimeout(() => {
      setScreenLoaded(true)
    }, 1000)
    setScreenWidth(window.innerWidth)
  }, [])

  useEffect(() => {
    const resizeFunction = () => {
      setScreenWidth(window.innerWidth)
    }
    window.addEventListener('resize', resizeFunction)
  }, [])

  // variables
  const [currentStep, setCurrentStep] = useState(1)
  const [disabledNextButton, setDisabledNextButton] = useState(true)

  const handleChangeCurrentStep = step => {
    handleFormValidate(step)
    setCurrentStep(step)
  }
  // step 1
  const [dimensionList, setDimensionList] = useState(NFTDimensionList)
  const [selectedDimension, setSelectedDimension] = useState(dimensionList[0])
  const [nftArt, setNftArt] = useState<any>(null)
  const [nftCover, setNftCover] = useState<any>(null)
  const [nftType, setNftType] = useState('image')
  const [artWidth, setArtWidth] = useState(0)
  const [openNftImageEditorModal, setOpenNftImageEditorModal] = useState(false)
  const [nftImage, setNftImage] = useState('')
  const [coverImageProcessing, setCoverImageProcessing] = useState(false)

  useEffect(() => {
    let width = 0
    switch (viewport) {
      case '2xl':
        width = screenWidth / 2 - 150 - 80 - 32 - 8
        break
      case 'xl':
        width = screenWidth / 2 - 120 - 80 - 32 - 8
        break
      case 'lg':
        width = screenWidth / 2 - 100 - 50 - 32 - 8
        break
      case 'md':
        width = screenWidth - 200 - 32 - 8
        break
      default:
        // width = screenWidth - 32 - 8
        width = screenWidth
        break
    }
    if (width > 672) {
      setArtWidth(672)
    } else {
      setArtWidth(width)
    }
  }, [viewport, selectedDimension, screenWidth])

  const handleChangeDimension = (item: any) => {
    setSelectedDimension(item)
    setOpenNftImageEditorModal(true)
  }

  const handleChangeNftArt = (item: any) => {
    setNftImage('')
    if (item[0].type.split('/')[0] === 'video') {
      setNftArt(null)
      setTimeout(() => {
        setNftArt(item)
      }, 100)
    } else {
      setNftArt(item)
    }
  }

  const handleChangeNftCover = (item: any) => {
    setNftCover(item)
  }

  const handleDeleteNftArt = () => {
    setNftArt(null)
    setNftImage('')
    setNftType('image')
    handleFormValidate(1)
  }

  useEffect(() => {
    if (nftArt !== null) {
      if (nftArt[0].type !== 'image/gif' && nftArt[0].type.split('/')[0] === 'image') {
        const image = new Image()
        image.src = URL.createObjectURL(nftArt[0])
        image.onload = () => {
          const { width, height } = image
          let array = dimensionList
          array[0].value = [width, height]
          setDimensionList(array)
          const ratio = height / width

          let windowWidth = 0
          switch (viewport) {
            case '2xl':
              windowWidth = screenWidth / 2 - 150 - 80 - 32 - 8
              break
            case 'xl':
              windowWidth = screenWidth / 2 - 120 - 80 - 32 - 8
              break
            case 'lg':
              windowWidth = screenWidth / 2 - 100 - 50 - 32 - 8
              break
            case 'md':
              windowWidth = screenWidth - 200 - 32 - 8
              break
            default:
              // windowWidth = screenWidth - 32 - 8
              windowWidth = screenWidth
              break
          }
          if (windowWidth > 672) {
            setArtWidth(672)
          } else {
            setArtWidth(windowWidth)
          }
        }

        setSelectedDimension(dimensionList[0])
        setNftType('image')
        setNftImage(URL.createObjectURL(nftArt[0]))
      } else if (nftArt[0].type === 'image/gif') {
        setNftType('image/gif')
        setNftImage(URL.createObjectURL(nftArt[0]))
      } else if (nftArt[0].type === 'video/mp4') {
        const type = nftArt[0].type.split('/')[0]
        setNftType(type)
        if (type === 'video') {
          setCoverImageProcessing(true)
          let canvas = document.createElement('canvas')
          let hidden_video: HTMLVideoElement = document.getElementById('hidden_video') as HTMLVideoElement
          hidden_video.src = URL.createObjectURL(nftArt[0])

          hidden_video.addEventListener('seeked', function () {
            canvas.width = hidden_video.videoWidth
            canvas.height = hidden_video.videoHeight

            let ctx = canvas.getContext('2d')
            ctx.drawImage(hidden_video, 0, 0, canvas.width, canvas.height)

            canvas.toBlob(blob => {
              setNftImage(URL.createObjectURL(blob))
              setCoverImageProcessing(false)
            })
          })
          hidden_video.currentTime = 5
        }
      } else if (nftArt[0].type === '' && /\.glb$/.test(nftArt[0].path)) {
        const path = URL.createObjectURL(nftArt[0])
        setNftType('vr')
        getSnapshot(path).then(modelCoverImg => {
          setNftImage(URL.createObjectURL(modelCoverImg[0].blob))
        })
      }
    }
  }, [nftArt])

  useEffect(() => {
    if (nftCover !== null && !(nftArt[0].type === '' && /\.glb$/.test(nftArt[0].path))) {
      if (nftCover[0].type.split('/')[0] === 'image') {
        const image = new Image()
        image.src = URL.createObjectURL(nftCover[0])
        image.onload = () => {
          const { width, height } = image
          let array = dimensionList
          array[0].value = [width, height]
          setDimensionList(array)
          const ratio = height / width

          let windowWidth = 0
          switch (viewport) {
            case '2xl':
              windowWidth = screenWidth / 2 - 150 - 80 - 32 - 8
              break
            case 'xl':
              windowWidth = screenWidth / 2 - 120 - 80 - 32 - 8
              break
            case 'lg':
              windowWidth = screenWidth / 2 - 100 - 50 - 32 - 8
              break
            case 'md':
              windowWidth = screenWidth - 200 - 32 - 8
              break
            default:
              // windowWidth = screenWidth - 32 - 8
              windowWidth = screenWidth
              break
          }
          if (windowWidth > 672) {
            setArtWidth(672)
          } else {
            setArtWidth(windowWidth)
          }
        }

        setSelectedDimension(dimensionList[0])
        setNftImage(URL.createObjectURL(nftCover[0]))
      }
    }
  }, [nftCover])

  useEffect(() => {
    handleFormValidate(1)
  }, [nftArt, nftImage, nftType, nftCover])

  // step 2
  const [nftName, setNftName] = useState<any>('')
  const [description, setDescription] = useState<any>('')
  const [categoryList, setCategoryList] = useState<any[]>([])
  const [showCategoryList, setShowCategoryList] = useState<boolean>(false)

  useEffect(() => {
    let array: any[] = []
    CategoryList.map(item => {
      let object: any = item
      object.checked = false
      array.push(object)
    })
    setCategoryList(array)
  }, [])

  const handleSelectCategory = index => {
    let array = [...categoryList]
    let checkedCount = 0
    array.map(item => {
      if (item.checked === true) {
        checkedCount++
      }
    })

    if (checkedCount >= 3 && array[index].checked === false) return

    array[index].checked = !array[index].checked
    setCategoryList(array)
  }

  const handleCancelCategory = () => {
    let array = [...categoryList]
    array.map(item => {
      item.checked = false
    })
    setCategoryList(categoryList => [...categoryList, array])
    setShowCategoryList(false)
  }

  useEffect(() => {
    let count = 0
    categoryList.map(item => {
      if (item.checked === true) count++
    })

    if (nftName !== '' && description !== '' && count !== 0) {
      setDisabledNextButton(false)
    } else {
      setDisabledNextButton(true)
    }
  }, [nftName, description, categoryList])

  // step 3
  const [royalties, setRoyalties] = useState(0)
  const [collection, setCollection] = useState(null)

  // solana
  const { metaplex: mx } = useMetaplex()
  const { storage, ensureLocalWalletBalance } = useLocalWalletBundlr()
  const [nftAddress, setNFTAddress] = useState<PublicKey | null>(null)
  const [nftMetadata, setNftMetadata] = useState<JsonMetadata>({})
  const { refreshToken } = useAuthentication()

  const createNft = async () => {
    try {
      dispatch({ type: 'set', isLoading: true })

      await refreshToken()

      const attributes = categoryList
        .filter(({ checked }) => checked)
        .map(({ name }) => ({ trait_type: 'category', value: name }))

      let trimmedNftName = nftName.trim()
      let trimmedDescription = description.trim()
      const metadata: JsonMetadata = {
        name: trimmedNftName,
        description: trimmedDescription,
        attributes,
        properties: {
          category: nftType.split('/')[0],
        },
      }
      const coverFileBlob = await fetch(nftImage).then(r => r.blob())
      const coverFile = toMetaplexFile(await coverFileBlob.arrayBuffer(), 'image.png', {
        contentType: coverFileBlob.type,
      })

      let animationFile
      if (metadata.properties.category !== 'image')
        animationFile = toMetaplexFile(await nftArt[0].arrayBuffer(), '', { contentType: nftArt[0].type })

      // estimate cost
      let metadataSize = JSON.stringify(metadata).length + 800
      let metadataCost = await storage.getUploadPriceForBytes(metadataSize)

      let assets = [coverFile]
      if (animationFile) assets.push(animationFile)

      let assetCost = await storage.getUploadPriceForFiles(assets)
      if (metadataCost.currency.symbol != assetCost.currency.symbol)
        throw new Error(`currency symbol mismatch: ${metadataCost.currency.symbol} != ${assetCost.currency.symbol}`)

      let totalCost = metadataCost.basisPoints.add(assetCost.basisPoints)

      // fund local wallet
      await ensureLocalWalletBalance(totalCost)

      let [imageUrl, animationUrl] = await storage.uploadAll(assets)
      metadata.image = imageUrl
      if (animationFile) metadata.animation_url = animationUrl

      metadata.properties.files = [
        {
          type: coverFile.contentType!,
          url: metadata.image,
        },
      ]
      if (animationFile)
        metadata.properties.files.push({
          type: animationFile.contentType,
          url: metadata.animation_url,
        })

      setNftMetadata(metadata)
      let metadataUri = await storage.uploadJson(metadata)

      let nftMint = Keypair.generate()
      let createNftOperation = await mx
        .nfts()
        .builders()
        .create({
          uri: metadataUri,
          name: trimmedNftName,
          sellerFeeBasisPoints: royalties * 100,
          useNewMint: nftMint,
          collection: collection?.mintAddress,
        })
      if (collection)
        createNftOperation.add(
          await mx.nfts().builders().verifyCollection({
            mintAddress: nftMint.publicKey,
            collectionMintAddress: collection.mintAddress,
          })
        )

      await createNftOperation.sendAndConfirm(mx)

      setNFTAddress(nftMint.publicKey)

      const result = categoryList.filter(item => item.checked)
      let category = ''
      result.forEach(item => {
        category += item.name + ','
      })

      axios.get(metadataUri).then(response => {
        if (response !== undefined) {
          const result: any = response.data
          nftsAPI
            .create({
              token_id: nftMint.publicKey.toBase58(),
              nft_name: trimmedNftName,
              categories: category.slice(0, -1),
              asset_type: nftType === 'image/gif' ? 'image' : nftType,
              cover_image_url: nftType === 'audio' || nftType === 'video' ? result['image'] : '',
              asset_url: nftType === 'video' || nftType === 'audio' ? result['animation_url'] : result['image'],
              collection_id: collection?.mintAddress.toBase58(),
            })
            .then(
              response => {
                console.log(response)
              },
              error => {
                console.log(error)
              }
            )
        }
      }),
        error => {
          console.log(error)
        }
      handleChangeCurrentStep((currentStep as any) === 4 ? 4 : currentStep + 1)
    } catch (error) {
      console.error(error)
    } finally {
      dispatch({ type: 'set', isLoading: false })
    }
  }

  // form validate
  const handleFormValidate = step => {
    switch (step) {
      case 1:
        if (nftArt !== null) {
          if (nftType !== 'audio') {
            setDisabledNextButton(false)
          } else {
            if (nftImage !== '') {
              setDisabledNextButton(false)
            } else {
              setDisabledNextButton(true)
            }
          }
        } else {
          setDisabledNextButton(true)
        }
        break
      case 2:
        let count = 0
        categoryList.map(item => {
          if (item.checked === true) count++
        })

        if (nftName !== '' && description !== '' && count !== 0) {
          setDisabledNextButton(false)
        } else {
          setDisabledNextButton(true)
        }
        break
      case 3:
        setDisabledNextButton(true)
        break
      default:
        break
    }
  }

  return (
    <div className="w-full flex justify-center">
      <Head>
        <title>Foster Marketplace</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/logo.png" />
      </Head>
      {viewport === 'lg' || viewport === 'xl' || viewport === '2xl'
        ? currentStep !== 4 && (
            <div className="relative w-full grid grid-cols-12 gap-0">
              {/* left part */}
              <div className="relative col-span-12 lg:col-span-6 g-left-container">
                <div className={styles.leftContainer}>
                  <div className={`${styles.title} w-full`}>Artwork Preview</div>
                  <div className="w-full flex flex-wrap justify-center z-10 mt-[22px]">
                    {nftType === 'vr' ? (
                      <div className="max-w-[672px] max-h-[672px] w-full h-full">
                        <img src={nftImage} alt="" />
                      </div>
                    ) : nftType === 'image' || nftType === 'image/gif' ? (
                      <div
                        className={styles.artArea}
                        style={{
                          width: artWidth,
                          height: artWidth,
                        }}
                      >
                        {nftImage !== '' && artWidth !== 0 && (
                          <div className="absolute inset-0 flex justify-center items-center">
                            <img src={nftImage} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}
                        {nftImage !== '' && artWidth !== 0 && <div className={styles.blurImage} />}
                        {nftImage !== '' && artWidth !== 0 && (
                          <img src={nftImage} alt="" className="w-full h-full rounded-[12px] object-contain z-10" />
                        )}
                      </div>
                    ) : (
                      <div className={`${styles.artArea}`} style={{ width: artWidth, height: artWidth }}>
                        <div className="absolute inset-0">
                          {nftImage !== '' && artWidth !== 0 && (
                            <img src={nftImage} alt="" className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className={styles.blurImage} />
                        {nftType === 'video' && nftArt !== null ? (
                          <video controls className="w-full h-full z-10" id="video">
                            <source src={URL.createObjectURL(nftArt[0])} type={nftArt[0].type} />
                            Your browser does not support the video tag.
                          </video>
                        ) : nftType === 'audio' && nftArt !== null ? (
                          <div className="w-full h-full z-10">
                            <MintAudioPlayer src={URL.createObjectURL(nftArt[0])} />
                            {nftImage !== '' && artWidth !== 0 && (
                              <img src={nftImage} alt="" className="w-full h-full object-contain z-10" />
                            )}
                          </div>
                        ) : nftImage !== '' && artWidth !== 0 ? (
                          <img src={nftImage} alt="" className="w-full h-full rounded-[12px] object-contain z-10" />
                        ) : (
                          <div className={`${styles.artArea}`} style={{ width: artWidth, height: artWidth }} />
                        )}
                      </div>
                    )}

                    {nftArt !== null && (
                      <div className="w-full mt-4 flex justify-between" style={{ width: artWidth }}>
                        {currentStep === 1 &&
                        (nftType === 'image' ||
                          (nftType === 'audio' &&
                            nftImage !== '' &&
                            nftCover !== null &&
                            nftCover[0].type !== 'image/gif')) ? (
                          <DimensionMenu
                            dimensionList={dimensionList}
                            selectedDimension={selectedDimension}
                            onSelect={item => handleChangeDimension(item)}
                          />
                        ) : (
                          <>&nbsp;</>
                        )}
                        {currentStep === 1 ? (
                          // <IconButton
                          //   icon={lightMode ? TrashGrayLightIcon : TrashGrayIcon}
                          //   onClick={() => handleDeleteNftArt()}
                          //   backgroundColor="transparent"
                          // />
                          <IconButtonWithSVG
                            icon={
                              <svg
                                id="Group_52015"
                                data-name="Group 52015"
                                xmlns="http://www.w3.org/2000/svg"
                                width="46"
                                height="46"
                                viewBox="0 0 46 46"
                              >
                                <g
                                  id="Icon_feather-trash-2"
                                  data-name="Icon feather-trash-2"
                                  transform="translate(12.378 10.643)"
                                >
                                  <path
                                    id="Path_105833"
                                    data-name="Path 105833"
                                    d="M4.5,9H26.743"
                                    transform="translate(-4.5 -4.057)"
                                    fill="none"
                                    stroke="var(--trash-icon-color)"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                  />
                                  <path
                                    id="Path_105834"
                                    data-name="Path 105834"
                                    d="M24.8,7.943v17.3a2.471,2.471,0,0,1-2.471,2.471H9.971A2.471,2.471,0,0,1,7.5,25.243V7.943m3.707,0V5.471A2.471,2.471,0,0,1,13.679,3h4.943a2.471,2.471,0,0,1,2.471,2.471V7.943"
                                    transform="translate(-5.029 -3)"
                                    fill="none"
                                    stroke="var(--trash-icon-color)"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                  />
                                  <path
                                    id="Path_105835"
                                    data-name="Path 105835"
                                    d="M15,16.5v7.414"
                                    transform="translate(-6.35 -5.378)"
                                    fill="none"
                                    stroke="var(--trash-icon-color)"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                  />
                                  <path
                                    id="Path_105836"
                                    data-name="Path 105836"
                                    d="M21,16.5v7.414"
                                    transform="translate(-7.407 -5.378)"
                                    fill="none"
                                    stroke="var(--trash-icon-color)"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                  />
                                </g>
                                <rect
                                  id="Rectangle_21074"
                                  data-name="Rectangle 21074"
                                  width="46"
                                  height="46"
                                  fill="none"
                                />
                              </svg>
                            }
                            onClick={() => handleDeleteNftArt()}
                            backgroundColor="transparent"
                          />
                        ) : (
                          <>&nbsp;</>
                        )}
                      </div>
                    )}
                  </div>
                  {nftType === 'vr' && (
                    <p className={styles.nft3DModelMessage}>
                      The file you've uploaded will be viewable in 3D on the NFT page after being minted.
                    </p>
                  )}
                  <div className={`w-full break-all flex justify-center items-center mt-[35px] ${styles.nftName}`}>
                    {nftName}
                  </div>
                  {description !== '' && (
                    <div className={`w-full flex flex-wrap justify-start items-center mt-7 ${styles.descriptionArea}`}>
                      <div className={`${styles.descriptionTitle} w-full`}>Description</div>
                      <div className={styles.descriptionText}>{description}</div>
                    </div>
                  )}
                  {categoryList.length !== 0 && (
                    <div className="w-full flex flex-wrap justify-start items-center mt-[33px] gap-[10px]">
                      {categoryList.map((item, index) => item.checked === true && <Chip data={item} key={index} />)}
                    </div>
                  )}
                </div>
              </div>
              {/* right part */}
              <div className="col-span-12 lg:col-span-6 g-right-container z-0">
                <div className={styles.rightContainer}>
                  <div className="w-full relative">
                    <div className="w-full">
                      <Stepper currentStep={currentStep} />
                    </div>
                    {/* upload artwork part */}
                    {currentStep === 1 && (
                      <>
                        <Step01SingleNFTSection
                          nftType={nftType}
                          setNftArt={item => handleChangeNftArt(item)}
                          setNftCover={item => handleChangeNftCover(item)}
                        />
                      </>
                    )}
                    {currentStep === 2 && (
                      <Step02SingleNFTSection
                        nftName={nftName}
                        setNftName={value => setNftName(value)}
                        description={description}
                        setDescription={value => setDescription(value)}
                        categoryList={categoryList}
                        showCategoryList={showCategoryList}
                        setShowCategoryList={value => setShowCategoryList(value)}
                        handleSelectCategory={index => handleSelectCategory(index)}
                        handleCancelCategory={() => handleCancelCategory()}
                      />
                    )}
                    {currentStep === 3 && (
                      <Step03SingleNFTSection
                        royalties={royalties}
                        setRoyalties={value => setRoyalties(value)}
                        setCollection={setCollection}
                        disabledNextButton={disabledNextButton}
                        createNft={() => createNft()}
                      />
                    )}
                    <div className="w-full h-32" />
                    <div className="absolute bottom-0 w-full flex justify-between">
                      {currentStep !== 1 ? (
                        <Button
                          label="Back"
                          onClick={() => handleChangeCurrentStep(currentStep - 1)}
                          backgroundColor={'transparent'}
                          borderColor={'var(--back-btn-border-mobile)'}
                          borderWidth={1}
                          color="var(--main-bg-color)"
                          width={viewport === '2xl' ? 124 : 117}
                          height={viewport === '2xl' ? 53 : 46}
                        />
                      ) : (
                        <div />
                      )}
                      {currentStep < 3 &&
                        (disabledNextButton ? (
                          <Button
                            width={viewport === '2xl' ? 124 : 117}
                            height={viewport === '2xl' ? 53 : 46}
                            label="Next Step"
                            disabled={disabledNextButton}
                            backgroundColor="#888A8E"
                          />
                        ) : coverImageProcessing ? (
                          <LoadingButton width={viewport === '2xl' ? 124 : 117} />
                        ) : (
                          <GradientButton
                            width={viewport === '2xl' ? 124 : 117}
                            label="Next Step"
                            onClick={() => handleChangeCurrentStep(currentStep === 4 ? 4 : currentStep + 1)}
                          />
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        : currentStep !== 4 && (
            // mobile part
            <div className="g-container mb-[47px]">
              {/* stepper part */}
              {/* <div className="w-full">
                <Stepper currentStep={currentStep} />
              </div> */}

              <div className="w-full flex flex-wrap justify-center">
                {nftType === 'vr' ? (
                  <div className="max-w-[672px] w-full aspect-square">
                    <img src={nftImage} alt="" />
                  </div>
                ) : nftType === 'image' ? (
                  <div
                    className={`${styles.artArea}`}
                    style={{ width: artWidth, height: artWidth, marginLeft: '-16px', marginRight: '-16px' }}
                  >
                    {nftImage !== '' && artWidth !== 0 ? (
                      <img src={nftImage} alt="" className="w-full h-full rounded-none object-contain" />
                    ) : (
                      <div
                        className={`${styles.artArea}`}
                        style={{ width: artWidth, height: artWidth, marginLeft: '-16px', marginRight: '-16px' }}
                      />
                    )}
                  </div>
                ) : (
                  <div
                    className={`${styles.artArea}`}
                    style={{ width: artWidth, height: artWidth, marginLeft: '-16px', marginRight: '-16px' }}
                  >
                    {nftType === 'video' && nftArt !== null ? (
                      <video controls className="w-full h-full" id="video">
                        <source src={URL.createObjectURL(nftArt[0])} type={nftArt[0].type} />
                        Your browser does not support the video tag.
                      </video>
                    ) : nftType === 'audio' && nftArt !== null ? (
                      <div className="w-full h-full z-10">
                        <MintAudioPlayer src={URL.createObjectURL(nftArt[0])} />
                        {nftImage !== '' && artWidth !== 0 && (
                          <img src={nftImage} alt="" className="w-full h-full object-contain z-10" />
                        )}
                      </div>
                    ) : nftImage !== '' && artWidth !== 0 ? (
                      <img src={nftImage} alt="" className="w-full h-full rounded-none object-contain" />
                    ) : (
                      <div
                        className={`${styles.artArea}`}
                        style={{ width: artWidth, height: artWidth, marginLeft: '-16px', marginRight: '-16px' }}
                      />
                    )}
                  </div>
                )}

                {nftArt !== null && (
                  <div className="w-full mt-4 flex justify-center">
                    <div className="w-full flex justify-between">
                      {currentStep === 1 &&
                      (nftType === 'image' ||
                        (nftType === 'audio' &&
                          nftImage !== '' &&
                          nftCover !== null &&
                          nftCover[0].type !== 'image/gif')) ? (
                        <DimensionMenu
                          dimensionList={dimensionList}
                          selectedDimension={selectedDimension}
                          onSelect={item => handleChangeDimension(item)}
                        />
                      ) : (
                        <>&nbsp;</>
                      )}

                      <IconButtonWithSVG
                        icon={
                          <svg
                            id="Group_52015"
                            data-name="Group 52015"
                            xmlns="http://www.w3.org/2000/svg"
                            width="46"
                            height="46"
                            viewBox="0 0 46 46"
                          >
                            <g
                              id="Icon_feather-trash-2"
                              data-name="Icon feather-trash-2"
                              transform="translate(12.378 10.643)"
                            >
                              <path
                                id="Path_105833"
                                data-name="Path 105833"
                                d="M4.5,9H26.743"
                                transform="translate(-4.5 -4.057)"
                                fill="none"
                                stroke="var(--trash-icon-color)"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                              />
                              <path
                                id="Path_105834"
                                data-name="Path 105834"
                                d="M24.8,7.943v17.3a2.471,2.471,0,0,1-2.471,2.471H9.971A2.471,2.471,0,0,1,7.5,25.243V7.943m3.707,0V5.471A2.471,2.471,0,0,1,13.679,3h4.943a2.471,2.471,0,0,1,2.471,2.471V7.943"
                                transform="translate(-5.029 -3)"
                                fill="none"
                                stroke="var(--trash-icon-color)"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                              />
                              <path
                                id="Path_105835"
                                data-name="Path 105835"
                                d="M15,16.5v7.414"
                                transform="translate(-6.35 -5.378)"
                                fill="none"
                                stroke="var(--trash-icon-color)"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                              />
                              <path
                                id="Path_105836"
                                data-name="Path 105836"
                                d="M21,16.5v7.414"
                                transform="translate(-7.407 -5.378)"
                                fill="none"
                                stroke="var(--trash-icon-color)"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                              />
                            </g>
                            <rect id="Rectangle_21074" data-name="Rectangle 21074" width="46" height="46" fill="none" />
                          </svg>
                        }
                        onClick={() => handleDeleteNftArt()}
                        backgroundColor="transparent"
                        width="32px"
                        height="32px"
                      />
                    </div>
                  </div>
                )}
              </div>
              {/* upload artwork part */}
              {currentStep === 1 && (
                <>
                  {nftType === 'vr' && (
                    <p className={styles.nft3DModelMessage}>
                      The file you've uploaded will be viewable in 3D on the NFT page after being minted.
                    </p>
                  )}
                  <Step01SingleNFTSection
                    nftType={nftType}
                    setNftArt={item => handleChangeNftArt(item)}
                    setNftCover={item => handleChangeNftCover(item)}
                  />
                </>
              )}

              {currentStep === 2 && (
                <Step02SingleNFTSection
                  nftName={nftName}
                  setNftName={value => setNftName(value)}
                  description={description}
                  categoryList={categoryList}
                  setDescription={value => setDescription(value)}
                  showCategoryList={showCategoryList}
                  setShowCategoryList={value => setShowCategoryList(value)}
                  handleSelectCategory={index => handleSelectCategory(index)}
                  handleCancelCategory={() => handleCancelCategory()}
                />
              )}

              {currentStep === 3 && (
                <Step03SingleNFTSection
                  createNft={() => createNft()}
                  royalties={royalties}
                  setCollection={setCollection}
                  setRoyalties={value => setRoyalties(value)}
                  disabledNextButton={disabledNextButton}
                  handleChangeCurrentStep={() =>
                    handleChangeCurrentStep((currentStep as any) === 4 ? 4 : currentStep + 1)
                  }
                />
              )}

              <div className="w-full flex justify-between my-10">
                {/* button group part */}
                {currentStep === 1 &&
                  (disabledNextButton ? (
                    <div className="w-full">
                      <Button
                        fullWidth
                        label="Next Step"
                        disabled={disabledNextButton}
                        backgroundColor="#888A8E"
                        height="45px"
                      />
                    </div>
                  ) : (
                    <div className="w-full">
                      <GradientButton
                        fullWidth
                        label="Next Step"
                        onClick={() => handleChangeCurrentStep((currentStep as any) === 4 ? 4 : currentStep + 1)}
                        height="45px"
                      />
                    </div>
                  ))}
                {currentStep === 2 && (
                  <div className="w-full grid grid-cols-2 gap-5">
                    <div className="col-span-1">
                      <Button
                        label="Back"
                        onClick={() => handleChangeCurrentStep(currentStep - 1)}
                        fullWidth
                        fontFamily="Muli-SemiBold"
                        height="45px"
                        backgroundColor="transparent"
                        color="var(--main-bg-color)"
                        borderColor="var(--back-btn-border-mobile)"
                        borderWidth={1}
                      />
                    </div>
                    <div className="col-span-1">
                      {disabledNextButton ? (
                        <div className="w-full">
                          <Button
                            fullWidth
                            label="Next Step"
                            disabled={disabledNextButton}
                            backgroundColor="#888A8E"
                            height="45px"
                          />
                        </div>
                      ) : (
                        <div className="w-full">
                          <GradientButton
                            fullWidth
                            label="Next Step"
                            onClick={() => handleChangeCurrentStep((currentStep as any) === 4 ? 4 : currentStep + 1)}
                            height="45px"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {currentStep === 3 && (
                  <div className="w-[161px]">
                    <Button
                      label="Back"
                      onClick={() => handleChangeCurrentStep(currentStep - 1)}
                      fullWidth
                      height="45px"
                      backgroundColor="transparent"
                      color="var(--main-bg-color)"
                      borderColor="var(--back-btn-border-mobile)"
                      borderWidth={1}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
      <div>
        <video controls className="hidden w-full h-full z-10" id="hidden_video"></video>
      </div>
      {currentStep === 4 && (
        <SuccessMintSingleNFTSection
          nftName={nftName}
          nftType={nftType}
          nftArt={nftArt}
          nftImage={nftImage}
          artWidth={artWidth}
          nftAddress={nftAddress}
          nftMetadata={nftMetadata}
        />
      )}
      <NftImageEditorModal
        open={openNftImageEditorModal}
        close={() => setOpenNftImageEditorModal(false)}
        nftImage={nftType === 'image' ? nftArt : nftCover}
        getCroppedImage={croppedImage => {
          setNftImage(croppedImage)
          setOpenNftImageEditorModal(false)
        }}
        dimension={selectedDimension}
      />
      <ProgressingModal open={screenLoaded && isLoading} />
    </div>
  )
}

export default SingleNft

SingleNft.getLayout = function getLayout(page) {
  return <SecondaryLayout>{page}</SecondaryLayout>
}
