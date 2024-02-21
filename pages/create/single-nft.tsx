import React, { useEffect, useState } from 'react'

// next components
import Head from 'next/head'

// third party components
import { useSelector, useDispatch } from 'react-redux'
import { useResizeDetector } from 'react-resize-detector'

// components
import SecondaryLayout from 'components/Layout/SecondaryLayout'
import MintAudioPlayer from 'components/MediaPlayer/MintAudioPlayer'

// solana components
import { Keypair, PublicKey } from '@solana/web3.js'
import { toBigNumber, toMetaplexFile, JsonMetadata } from '@metaplex-foundation/js'

import { useMetaplex } from 'hooks/useMetaplex'
import { useLocalWalletBundlr } from 'hooks/useLocalWalletBundlr'

import DimensionMenu from 'components/Menu/DimensionMenu'
import Step01SingleNFTSection from 'components/pages/Create/SingleNFT/Step01SingleNFTSection'
import Step02SingleNFTSection from 'components/pages/Create/SingleNFT/Step02SingleNFTSection'
import Step03SingleNFTSection from 'components/pages/Create/SingleNFT/Step03SingleNFTSection'
import SuccessMintSingleNFTSection from 'components/pages/Create/SingleNFT/SuccessMintSingleNFTSection'
import NftImageEditorModal from 'components/Modal/NftImageEditorModal'
import ProgressingModal from 'components/Modal/ProgressingModal'
import StepMintTypeSection from 'components/pages/Create/SingleNFT/StepMintTypeSection'

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
import nftsAPI from 'apis/nfts'

// styles
import ImageIcon from 'assets/icons/image-icon.svg?component'
import ShareIcon from 'assets/icons/share-icon.svg?component'
import TrashBin from 'assets/icons/trash-bin.svg?component'
import styles from './single-nft.module.scss'
import LoadingButton from 'components/Button/LoadingButton'
import IconButtonWithSVG from 'components/Button/IconButtonWithSVG'
import { useAuthentication } from 'hooks/useAuthentication'
import ModelViewer from 'components/ModelViewer'
import FullScreenLoadingModal from 'components/Modal/FullScreenLoadingModal'

const SingleNft = () => {
  const viewport = useViewport()
  const dispatch = useDispatch()

  const isLoading = useSelector<any>(state => state.isLoading)

  const [screenWidth, setScreenWidth] = useState(1920)
  const [screenLoaded, setScreenLoaded] = useState(false)
  const [isMinting, setIsMinting] = useState(false)

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
  const [currentStep, setCurrentStep] = useState(0)
  const [type, setType] = useState()
  const [disabledNextButton, setDisabledNextButton] = useState(true)

  const handleChangeCurrentStep = step => {
    handleFormValidate(step)
    setCurrentStep(step)
  }
  // step 1
  const [editionType, setEditionType] = useState(null)
  const [maxNum, setMaxNum] = useState(10)
  const [dimensionList, setDimensionList] = useState(NFTDimensionList)
  const [selectedDimension, setSelectedDimension] = useState(dimensionList[0])
  const [nftArt, setNftArt] = useState<any>(null)
  const [nftCover, setNftCover] = useState<any>(null)
  const [nftType, setNftType] = useState('image')
  const [artWidth, setArtWidth] = useState(0)
  const [openNftImageEditorModal, setOpenNftImageEditorModal] = useState(false)
  const [nftImage, setNftImage] = useState('')
  const [coverImageProcessing, setCoverImageProcessing] = useState(false)
  const [nftUrl, setNftUrl] = useState<string>()

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
      } else if (nftArt[0].type === '' && /\.glb$/.test(nftArt[0].path)) {
        const path = URL.createObjectURL(nftArt[0])
        setNftType('vr')
        setNftUrl(path)
      } else {
        const type = nftArt[0].type.split('/')[0]
        setNftType(type)
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
  }, [nftArt, nftImage, nftType, nftCover, editionType])

  // step 2
  const [nftName, setNftName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
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
    if (nftName !== '' && description !== '') {
      setDisabledNextButton(false)
    } else {
      setDisabledNextButton(true)
    }
  }, [nftName, description, categoryList])

  // solana
  const { metaplex: mx } = useMetaplex()
  const { storage, ensureLocalWalletBalance } = useLocalWalletBundlr()
  const [nftAddress, setNFTAddress] = useState<PublicKey | null>(null)
  const [nftMetadata, setNftMetadata] = useState<JsonMetadata>()
  const { refreshToken } = useAuthentication()

  // step 3
  const [royalties, setRoyalties] = useState(0)
  const [collection, setCollection] = useState(null)
  const [creatorList, setCreatorList] = useState<Array<{ address: string; share: string }>>([])
  useEffect(() => {
    try {
      setCreatorList([{ address: mx.identity().publicKey.toBase58(), share: '100' }])
    } catch (e) {
      console.warn(`could not fetch metaplex identity: ${e}`)
    }
  }, [mx])

  const createNft = async () => {
    try {
      // dispatch({ type: 'set', isLoading: true })
      setIsMinting(true)
      await refreshToken()

      const attributes = categoryList
        .filter(({ checked }) => checked)
        .map(({ name }) => ({ trait_type: 'category', value: name }))

      let trimmedNftName: string = nftName.trim()
      let trimmedDescription: string = description.trim()
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
          type: metadata.properties.category === 'vr' ? 'vr' : animationFile.contentType,
          url: metadata.animation_url,
        })
      setNftMetadata(metadata)
      let metadataUri = await storage.uploadJson(metadata)

      let maxSupply = toBigNumber(0)
      if (editionType?.name == 'Limited Edition') maxSupply = toBigNumber(maxNum)
      else if (editionType?.name == 'Open Edition') maxSupply = null

      let publicKey = mx.identity().publicKey
      let nftMint = Keypair.generate()
      let createNftOperation = await mx
        .nfts()
        .builders()
        .create({
          uri: metadataUri,
          name: trimmedNftName,
          sellerFeeBasisPoints: royalties * 100,
          creators: creatorList.map(({ address, share }) => ({
            address: new PublicKey(address),
            share: parseInt(share),
            verified: address == publicKey.toBase58(),
          })),
          useNewMint: nftMint,
          collection: collection?.mintAddress,
          maxSupply,
        })
      if (collection)
        createNftOperation.add(
          mx.nfts().builders().verifyCollection({
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

      await nftsAPI
        .create({
          token_id: nftMint.publicKey.toBase58(),
          nft_name: trimmedNftName,
          categories: category.slice(0, -1),
          asset_type: nftType === 'image/gif' ? 'image' : nftType,
          cover_image_url: imageUrl,
          asset_url: animationUrl ?? imageUrl,
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
      handleChangeCurrentStep((currentStep as any) === 4 ? 4 : currentStep + 1)
    } catch (error) {
      console.error(error)
    } finally {
      setIsMinting(false)
    }
  }

  // form validate
  const handleFormValidate = step => {
    switch (step) {
      case 1:
        if (nftArt !== null) {
          if (nftType === 'vr') {
            if (nftImage !== '' || nftCover !== null) {
              setDisabledNextButton(false)
            } else {
              setDisabledNextButton(true)
            }
          } else if (nftType !== 'audio') {
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

  const { width, height, ref } = useResizeDetector()
  const [takeSnapshotStatus, setTakeSnapshotStatus] = useState(false)
  const [openCoverImageEditorModal, setOpenCoverImageEditorModal] = useState(false)

  return (
    <div className="w-full flex justify-center">
      <Head>
        <title>Foster Marketplace</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/logo.png" />
      </Head>
      {viewport === 'lg' || viewport === 'xl' || viewport === '2xl'
        ? currentStep !== 4 &&
          (currentStep === 0 ? (
            <StepMintTypeSection setCurrentStep={setCurrentStep} setType={setType} />
          ) : (
            // <div onClick={() => setCurrentStep(1)}>111</div>
            <div className="relative w-full grid grid-cols-12 gap-0">
              {/* left part */}
              <div className="relative col-span-12 lg:col-span-6 g-left-container">
                <div className={styles.leftContainer}>
                  <div className="w-full flex flex-wrap justify-center z-10 mt-[10px]">
                    {nftType === 'vr' && nftUrl ? (
                      <div ref={ref} className="max-w-[672px] w-full mx-auto aspect-square">
                        <ModelViewer
                          path={nftUrl}
                          width={width}
                          height={height}
                          preserveDrawingBuffer
                          getSnapshot={{
                            onSnapshot: image => {
                              setNftImage(URL.createObjectURL(image))
                              setTakeSnapshotStatus(false)
                            },
                            status: takeSnapshotStatus,
                          }}
                        />
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
                          <IconButtonWithSVG
                            icon={<TrashBin className={styles.trashIcon} />}
                            onClick={() => handleDeleteNftArt()}
                            backgroundColor="transparent"
                          />
                        ) : (
                          <>&nbsp;</>
                        )}
                      </div>
                    )}
                  </div>
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
                          type={type}
                          nftType={nftType}
                          setEditionType={item => setEditionType(item)}
                          setNftArt={item => handleChangeNftArt(item)}
                          setNftCover={item => handleChangeNftCover(item)}
                          setMaxSupply={value => setMaxNum(value)}
                        />
                        {nftType === 'vr' && (
                          <>
                            <div className={styles.coverImgMsg}>
                              <h6>
                                Cover Photo <span>*</span>
                              </h6>
                              <p>
                                Pick the best angle to take a snapshot or upload an image to use as the cover photo.
                              </p>
                            </div>

                            <div className={styles.coverBtnBox}>
                              <button disabled={nftImage !== ''} onClick={() => setTakeSnapshotStatus(true)}>
                                <ImageIcon /> Take Snapshot
                              </button>

                              <button disabled={nftImage !== ''}>
                                <label htmlFor="fileInput">
                                  <ShareIcon /> Upload Photo
                                </label>
                              </button>
                              <input
                                type="file"
                                accept="image/*"
                                id="fileInput"
                                onChange={e => {
                                  const file = e.target.files[0]
                                  if (file && file.type.startsWith('image/')) {
                                    setNftCover(file)
                                    setOpenCoverImageEditorModal(true)
                                  } else {
                                    alert('Please select an image file.')
                                  }
                                }}
                              />

                              {nftCover && (
                                <NftImageEditorModal
                                  open={openCoverImageEditorModal}
                                  close={() => setOpenCoverImageEditorModal(false)}
                                  nftImage={nftType === 'vr' && [nftCover]}
                                  getCroppedImage={croppedImage => {
                                    setNftImage(croppedImage)
                                    setOpenCoverImageEditorModal(false)
                                  }}
                                  dimension={selectedDimension}
                                />
                              )}
                            </div>

                            {nftImage && (
                              <div className={styles.glbNftImageSection}>
                                <img className="w-full aspect-square" src={nftImage} alt="" />
                                <button
                                  onClick={() => {
                                    setNftImage('')
                                    setNftCover(null)
                                  }}
                                >
                                  <TrashBin />
                                  &nbsp;Remove Cover Image
                                </button>
                              </div>
                            )}
                          </>
                        )}
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
                        creatorList={creatorList}
                        setCreatorList={setCreatorList}
                        disabledNextButton={disabledNextButton}
                        createNft={() => createNft()}
                        isMinting={isMinting}
                        onBack={() => handleChangeCurrentStep(currentStep - 1)}
                      />
                    )}
                    <div className="w-full h-32" />
                    <div className="absolute bottom-0 w-full flex justify-end">
                      <div className="flex gap-10">
                        {currentStep === 2 ? (
                          <Button
                            label="Back"
                            onClick={() => handleChangeCurrentStep(currentStep - 1)}
                            backgroundColor={'transparent'}
                            borderColor={'rgba(var(--main-bg-color-rgb), 0.25)'}
                            borderWidth={2}
                            color="var(--main-bg-color)"
                            width={viewport === '2xl' ? 124 : 117}
                            height={viewport === '2xl' ? 53 : 45}
                          />
                        ) : (
                          <div />
                        )}
                        {currentStep < 3 &&
                          (disabledNextButton ? (
                            <Button
                              width={viewport === '2xl' ? 124 : 117}
                              height={viewport === '2xl' ? 53 : 45}
                              label="Next Step"
                              disabled={disabledNextButton}
                              backgroundColor="var(--second-home-bg)"
                              color="rgba(var(--main-bg-color-rgb), 0.5)"
                            />
                          ) : coverImageProcessing ? (
                            <LoadingButton width={viewport === '2xl' ? 124 : 117} />
                          ) : (
                            <GradientButton
                              width={viewport === '2xl' ? 124 : 117}
                              height={viewport === '2xl' ? 53 : 45}
                              label="Next Step"
                              backgroundColor01="var(--main-icon-color)"
                              backgroundColor02="var(--main-icon-color)"
                              onClick={() => handleChangeCurrentStep(currentStep === 4 ? 4 : currentStep + 1)}
                            />
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        : currentStep !== 4 &&
          // mobile part
          (currentStep === 0 ? (
            <StepMintTypeSection setCurrentStep={setCurrentStep} setType={setType} />
          ) : (
            <div className="g-container mb-[47px]">
              <div className="w-full flex flex-wrap justify-center flex-row">
                {nftType === 'vr' ? (
                  <div ref={ref} className="max-w-[672px] w-full mx-auto aspect-square">
                    <ModelViewer
                      path={nftUrl}
                      width={width}
                      height={height}
                      preserveDrawingBuffer
                      getSnapshot={{
                        onSnapshot: image => {
                          setNftImage(URL.createObjectURL(image))
                          setTakeSnapshotStatus(false)
                        },
                        status: takeSnapshotStatus,
                      }}
                    />
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

                {nftArt !== null && currentStep === 1 && (
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
                      {currentStep === 1 && (
                        <IconButtonWithSVG
                          icon={<TrashBin className={styles.trashIcon} />}
                          onClick={() => handleDeleteNftArt()}
                          backgroundColor="transparent"
                          width="32px"
                          height="32px"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
              {/* upload artwork part */}
              {currentStep === 1 && (
                <>
                  <Step01SingleNFTSection
                    type={type}
                    nftType={nftType}
                    setEditionType={item => setEditionType(item)}
                    setNftArt={item => handleChangeNftArt(item)}
                    setNftCover={item => handleChangeNftCover(item)}
                    setMaxSupply={value => setMaxNum(value)}
                  />
                  {nftType === 'vr' && (
                    <>
                      <div className={styles.coverImgMsg}>
                        <h6>
                          Cover Photo <span>*</span>
                        </h6>
                        <p>Pick the best angle to take a snapshot or upload an image to use as the cover photo.</p>
                      </div>

                      <div className={styles.coverBtnBox}>
                        <button disabled={nftImage !== ''} onClick={() => setTakeSnapshotStatus(true)}>
                          <ImageIcon /> Take Snapshot
                        </button>

                        <button disabled={nftImage !== ''}>
                          <label htmlFor="fileInput">
                            <ShareIcon /> Upload Photo
                          </label>
                        </button>
                        <input
                          type="file"
                          accept="image/*"
                          id="fileInput"
                          onChange={e => {
                            const file = e.target.files[0]
                            if (file && file.type.startsWith('image/')) {
                              setNftCover(file)
                              setOpenCoverImageEditorModal(true)
                            } else {
                              alert('Please select an image file.')
                            }
                          }}
                        />

                        {nftCover && (
                          <NftImageEditorModal
                            open={openCoverImageEditorModal}
                            close={() => setOpenCoverImageEditorModal(false)}
                            nftImage={nftType === 'vr' && [nftCover]}
                            getCroppedImage={croppedImage => {
                              setNftImage(croppedImage)
                              setOpenCoverImageEditorModal(false)
                            }}
                            dimension={selectedDimension}
                          />
                        )}
                      </div>

                      {nftImage && (
                        <div className={styles.glbNftImageSection}>
                          <img className="w-full aspect-square" src={nftImage} alt="" />
                          <button onClick={() => setNftImage('')}>
                            <TrashBin />
                            &nbsp;Remove Cover Image
                          </button>
                        </div>
                      )}
                    </>
                  )}
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
                  setRoyalties={value => setRoyalties(value)}
                  setCollection={setCollection}
                  creatorList={creatorList}
                  setCreatorList={setCreatorList}
                  isMinting={isMinting}
                  disabledNextButton={disabledNextButton}
                  onBack={() => handleChangeCurrentStep(currentStep - 1)}
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
                        backgroundColor="var(--second-home-bg)"
                        color="rgba(var(--main-bg-color-rgb), 0.5)"
                        height="45px"
                        fontSize={16}
                        fontFamily="Muli-SemiBold"
                      />
                    </div>
                  ) : (
                    <div className="w-full">
                      <GradientButton
                        fullWidth
                        label="Next Step"
                        backgroundColor01="var(--main-icon-color)"
                        backgroundColor02="var(--main-icon-color)"
                        onClick={() => handleChangeCurrentStep((currentStep as any) === 4 ? 4 : currentStep + 1)}
                        height="45px"
                        fontSize={16}
                        fontFamily="Muli-SemiBold"
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
                        borderColor={'rgba(var(--main-bg-color-rgb), 0.25)'}
                        borderWidth={2}
                        fontSize={16}
                      />
                    </div>
                    <div className="col-span-1">
                      {disabledNextButton ? (
                        <div className="w-full">
                          <Button
                            fullWidth
                            label="Next Step"
                            disabled={disabledNextButton}
                            backgroundColor="var(--second-home-bg)"
                            color="rgba(var(--main-bg-color-rgb), 0.5)"
                            height="45px"
                            fontSize={16}
                            fontFamily="Muli-SemiBold"
                          />
                        </div>
                      ) : (
                        <div className="w-full">
                          <GradientButton
                            fullWidth
                            label="Next Step"
                            onClick={() => handleChangeCurrentStep((currentStep as any) === 4 ? 4 : currentStep + 1)}
                            height="45px"
                            fontSize={16}
                            fontFamily="Muli-SemiBold"
                            backgroundColor01="var(--main-icon-color)"
                            backgroundColor02="var(--main-icon-color)"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {/* {currentStep === 3 && (
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
                )} */}
              </div>
            </div>
          ))}
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
      <FullScreenLoadingModal open={screenLoaded && isLoading} />
    </div>
  )
}

export default SingleNft

SingleNft.getLayout = function getLayout(page) {
  return <SecondaryLayout>{page}</SecondaryLayout>
}
