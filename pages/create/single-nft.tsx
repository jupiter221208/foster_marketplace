import React, { useEffect, useState } from 'react'

// next components
import Head from 'next/head'

// third party components
import { useSelector, useDispatch } from 'react-redux'

// components
import SecondaryLayout from 'components/Layout/SecondaryLayout'
import MintAudioPlayer from 'components/MediaPlayer/MintAudioPlayer'

// solana components
import { ComputeBudgetProgram, Keypair, PublicKey } from '@solana/web3.js'
import { toBigNumber, toMetaplexFile, JsonMetadata, TransactionBuilder } from '@metaplex-foundation/js'

import { useMetaplex } from 'hooks/useMetaplex'
import { useLocalWalletBundlr } from 'hooks/useLocalWalletBundlr'

import DimensionMenu from 'components/Menu/DimensionMenu'
import Step01SingleNFTSection from 'components/pages/Create/SingleNFT/Step01SingleNFTSection'
import Step03SingleNFTSection from 'components/pages/Create/SingleNFT/Step03SingleNFTSection'
import Step04SingleNFTSection from 'components/pages/Create/SingleNFT/Step04SingleNFTSection'
import SuccessMintSingleNFTSection from 'components/pages/Create/SingleNFT/SuccessMintSingleNFTSection'
import NftImageEditorModal from 'components/Modal/NftImageEditorModal'
import StepMintTypeSection from 'components/pages/Create/SingleNFT/StepMintTypeSection'

// custom functions
import { useViewport } from 'utils'

// images and icons

// json
import NFTDimensionList from 'assets/json/nft-dimension-list.json'
import CategoryList from 'assets/json/popular-category.json'

// call apis
import nftsAPI from 'apis/nfts'

// styles
import TrashBin from 'assets/icons/trash-bin.svg?component'
import styles from './single-nft.module.scss'
import IconButtonWithSVG from 'components/Button/IconButtonWithSVG'
import { useAuthentication } from 'hooks/useAuthentication'
import ModelViewer from 'components/ModelViewer'
import FullScreenLoadingModal from 'components/Modal/FullScreenLoadingModal'
import ProgressSection from 'components/ProgressSection'
import SecondaryButton from 'components/Button/SecondaryButton'
import PrimaryButton from 'components/Button/PrimaryButton'

const SingleNft = () => {
  const viewport = useViewport()
  const dispatch = useDispatch()

  const isLoading = useSelector<any>(state => state.isLoading)
  const createTab = useSelector<any>(state => state.createTab)

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
  const [type, setType] = useState<any>()
  const [disabledNextButton, setDisabledNextButton] = useState(true)

  const handleChangeCurrentStep = step => {
    // handleFormValidate(step)
    if (step === 4) {
      createNft()
    } else {
      setCurrentStep(step)
    }
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
    if (createTab !== null) {
      if (createTab === 0) setType(0)
      else if (createTab === 1) setType(1)

      setCurrentStep(1)
      dispatch({ type: 'set', createTab: null })
    }
  }, [createTab])

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
    if (width > 760) {
      setArtWidth(760)
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
          if (windowWidth > 760) {
            setArtWidth(760)
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
    handleFormValidate(currentStep)
  }, [nftName, description, categoryList, editionType, currentStep, maxNum])

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
          uri: metadata.image,
        },
      ]
      if (animationFile)
        metadata.properties.files.push({
          type: metadata.properties.category === 'vr' ? 'vr' : animationFile.contentType,
          uri: metadata.animation_url.toString(),
        })
      setNftMetadata(metadata)
      let metadataUri = await storage.uploadJson(metadata)

      let maxSupply = toBigNumber(0)
      if (editionType?.name == 'Limited Edition') maxSupply = toBigNumber(maxNum)
      else if (editionType?.name == 'Open Edition') maxSupply = null

      let publicKey = mx.identity().publicKey
      let nftMint = Keypair.generate()
      let createNftOperation = new TransactionBuilder().add(
        {
          instruction: ComputeBudgetProgram.setComputeUnitLimit({ units: 200_000 }),
          signers: [],
        },
        {
          instruction: ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 500_000 }),
          signers: [],
        }
      )
      createNftOperation.add(
        await mx
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
      )
      if (collection)
        createNftOperation.add(
          mx.nfts().builders().verifyCollection({
            mintAddress: nftMint.publicKey,
            collectionMintAddress: collection.mintAddress,
          })
        )

      // retry upto 3x
      // TODO: show user retry number
      let response = null
      for (let i = 0; !response && i < 3; i++)
        try {
          response = await createNftOperation.sendAndConfirm(mx, {
            commitment: 'single',
            maxRetries: 5,
            skipPreflight: true,
          })
          await new Promise(resolve => setTimeout(resolve, 1000))
        } catch (e: any) {
          console.error(`failed to mint: attempt ${i + 1} of 3: ${e?.message}`)
          console.error(e)
        }

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
          edition: editionType?.name == 'Open Edition' || editionType?.name == 'Limited Edition' ? 0 : null,
          parent_nft: null,
          max_supply: editionType?.name == 'Limited Edition' ? maxNum : null,
        })
        .then(
          response => {
            console.log(response)
          },
          error => {
            console.log(error)
          }
        )
      setCurrentStep(4)
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

          if (nftName !== '' && description !== '') {
            setDisabledNextButton(false)
          } else {
            setDisabledNextButton(true)
          }
        } else {
          setDisabledNextButton(true)
        }
        break
      case 2:
        if (nftName !== '' && description !== '') {
          setDisabledNextButton(false)
        } else {
          setDisabledNextButton(true)
          break
        }

        if (type != 0) {
          if (editionType !== null && maxNum !== null && maxNum !== undefined && maxNum > 0) {
            setDisabledNextButton(false)
          } else {
            setDisabledNextButton(true)
            return
          }
        }
        break
      case 3:
        setDisabledNextButton(false)
        break
      default:
        break
    }
  }

  const [takeSnapshotStatus, setTakeSnapshotStatus] = useState(false)

  return (
    <div className="w-full">
      <Head>
        <title>Foster Marketplace</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <div className="lg:block hidden">
        {currentStep !== 4 &&
          (currentStep === 0 ? (
            <StepMintTypeSection setCurrentStep={setCurrentStep} setType={setType} />
          ) : (
            <div className="w-full">
              <div className="w-full flex justify-center">
                <div className="w-full g-container mt-[66px]">
                  <ProgressSection
                    currentStep={currentStep}
                    nextDisabled={disabledNextButton}
                    onBack={() => {
                      if (currentStep >= 1) {
                        setEditionType(null)
                      }
                      handleChangeCurrentStep(currentStep - 1)
                    }}
                    onNext={() => handleChangeCurrentStep((currentStep as any) === 4 ? 4 : currentStep + 1)}
                    loading={isMinting}
                    labels={['Artwork Details', 'Additional Details', 'Review']}
                  />
                </div>
              </div>
              <div className="w-full flex justify-center">
                <div className="max-w-[1920px] relative w-full grid grid-cols-12 gap-0">
                  {/* left part */}
                  <div className="relative col-span-12 lg:col-span-6 g-left-container">
                    <div className={styles.leftContainer}>
                      <div className={`relative w-full flex flex-wrap justify-center z-10 mt-[10px] `}>
                        {nftType === 'vr' && nftUrl ? (
                          <div className="max-w-[760px] w-full mx-auto aspect-square">
                            <ModelViewer
                              path={nftUrl}
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
                              width: 760,
                              maxWidth: 760,
                              height: 560,
                              maxHeight: 560,
                            }}
                          >
                            {/* {nftImage !== '' && artWidth !== 0 && (
                              <div className="absolute inset-0 flex justify-center items-center">
                                <img src={nftImage} alt="" className="w-full h-full object-cover" />
                              </div>
                            )} */}
                            {/* {nftImage !== '' && artWidth !== 0 && <div className={styles.blurImage} />} */}
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

                        {nftArt !== null ? (
                          <div className="w-full mt-[5px] flex justify-between">
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
                        ) : (
                          <div className={styles.preview}>Preview will display here</div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* right part */}
                  <div className="col-span-12 lg:col-span-6 g-right-container z-0">
                    <div className={styles.rightContainer}>
                      <div className="w-full relative">
                        {/* upload artwork part */}
                        {currentStep === 1 && (
                          <>
                            <Step01SingleNFTSection
                              nftType={nftType}
                              nftCover={nftCover}
                              setNftArt={item => handleChangeNftArt(item)}
                              setNftCover={item => handleChangeNftCover(item)}
                              nftImage={nftImage}
                              setNftImage={setNftImage}
                              setTakeSnapshotStatus={setTakeSnapshotStatus}
                              selectedDimension={selectedDimension}
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
                          </>
                        )}

                        {currentStep === 2 && (
                          <Step03SingleNFTSection
                            type={type}
                            royalties={royalties}
                            setRoyalties={value => setRoyalties(value)}
                            creatorList={creatorList}
                            setEditionType={item => setEditionType(item)}
                            setMaxSupply={value => setMaxNum(value)}
                            setCreatorList={setCreatorList}
                            setDisabledNextButton={setDisabledNextButton}
                            disabledNextButton={disabledNextButton}
                            onNextStep={() => handleChangeCurrentStep(currentStep + 1)}
                            onBack={() => handleChangeCurrentStep(currentStep - 1)}
                          />
                        )}

                        {currentStep === 3 && (
                          <Step04SingleNFTSection
                            type={type}
                            editionType={editionType}
                            maxSupply={maxNum}
                            nftName={nftName}
                            description={description}
                            categoryList={categoryList}
                            royalties={royalties}
                            creatorList={creatorList}
                            disabledNextButton={disabledNextButton}
                            createNft={() => createNft()}
                            isMinting={isMinting}
                            onBack={() => handleChangeCurrentStep(currentStep - 1)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
      {/* Mobile Part */}
      <div className="lg:hidden block">
        {createTab === null &&
          currentStep !== 4 &&
          // mobile part
          (currentStep === 0 ? (
            <StepMintTypeSection setCurrentStep={setCurrentStep} setType={setType} />
          ) : (
            <div className="g-container mb-[47px]">
              <div className="w-full flex flex-wrap justify-center flex-row">
                {nftType === 'vr' ? (
                  <div className="max-w-[760px] w-full mx-auto aspect-square">
                    <ModelViewer
                      path={nftUrl}
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
                    nftType={nftType}
                    nftCover={nftCover}
                    setNftArt={item => handleChangeNftArt(item)}
                    setNftCover={item => handleChangeNftCover(item)}
                    nftImage={nftImage}
                    setNftImage={setNftImage}
                    setTakeSnapshotStatus={setTakeSnapshotStatus}
                    selectedDimension={selectedDimension}
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
                </>
              )}

              {/* {currentStep === 2 && (
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
              )} */}

              {currentStep === 2 && (
                <Step03SingleNFTSection
                  type={type}
                  setEditionType={item => setEditionType(item)}
                  setMaxSupply={value => setMaxNum(value)}
                  createNft={() => createNft()}
                  royalties={royalties}
                  setRoyalties={value => setRoyalties(value)}
                  creatorList={creatorList}
                  setCreatorList={setCreatorList}
                  setDisabledNextButton={setDisabledNextButton}
                  disabledNextButton={disabledNextButton}
                  onBack={() => handleChangeCurrentStep(currentStep - 1)}
                  onNextStep={() => handleChangeCurrentStep(currentStep + 1)}
                />
              )}

              {currentStep === 3 && (
                <Step04SingleNFTSection
                  type={type}
                  editionType={editionType}
                  maxSupply={maxNum}
                  nftName={nftName}
                  description={description}
                  categoryList={categoryList}
                  royalties={royalties}
                  creatorList={creatorList}
                  disabledNextButton={disabledNextButton}
                  createNft={() => createNft()}
                  isMinting={isMinting}
                  onBack={() => handleChangeCurrentStep(currentStep - 1)}
                />
              )}

              <div className="w-full flex justify-between my-[30px]">
                {/* button group part */}
                {currentStep === 1 && (
                  <div className="w-full">
                    <div className="w-full">
                      <PrimaryButton
                        fullWidth
                        label="Next"
                        type="next"
                        onClick={() => handleChangeCurrentStep(currentStep + 1)}
                        disabled={disabledNextButton}
                      />
                    </div>
                    <div className="mt-[18px]">
                      <SecondaryButton
                        fullWidth
                        label="Back"
                        type="back"
                        onClick={() => handleChangeCurrentStep(currentStep - 1)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
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
