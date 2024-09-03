import React, { useEffect, useState } from 'react'

// next components
import Head from 'next/head'

// third party components
import { useSelector, useDispatch } from 'react-redux'

// components
import SecondaryLayout from 'components/Layout/SecondaryLayout'

// solana components
import { ComputeBudgetProgram, Keypair, PublicKey } from '@solana/web3.js'
import { toBigNumber, toMetaplexFile, JsonMetadata, TransactionBuilder } from '@metaplex-foundation/js'

import { useMetaplex } from 'hooks/useMetaplex'
import { useLocalWalletBundlr } from 'hooks/useLocalWalletBundlr'

import Step01SingleNFTSection from 'components/pages/Create/SingleNFT/Step01SingleNFTSection'
import Step03SingleNFTSection from 'components/pages/Create/SingleNFT/Step03SingleNFTSection'
import Step04SingleNFTSection from 'components/pages/Create/SingleNFT/Step04SingleNFTSection'
import SuccessMintSingleNFTSection from 'components/pages/Create/SingleNFT/SuccessMintSingleNFTSection'
import NftImageEditorModal from 'components/Modal/NftImageEditorModal'
import StepMintTypeSection from 'components/pages/Create/SingleNFT/StepMintTypeSection'

// custom functions
import { useViewport } from 'utils'

// images and icons
import BackIcon from 'assets/icons/back-arrow.svg?component'

// json
import NFTDimensionList from 'assets/json/nft-dimension-list.json'
import CategoryList from 'assets/json/popular-category.json'

// call apis
import nftsAPI from 'apis/nfts'

// styles
import styles from './single-nft.module.scss'
import { useAuthentication } from 'hooks/useAuthentication'
import GradientButton from 'components/Button/GradientButton'
import LoadingButton from 'components/Button/LoadingButton'
import OutlineButton from 'components/Button/OutlineButton'
import SingleNftLeftSection from 'components/pages/Create/SingleNFT/SingleNftLeftSection'

const SingleNft = () => {
  const viewport = useViewport()
  const dispatch = useDispatch()

  const createTab = useSelector<any>(state => state.createTab)

  const [screenWidth, setScreenWidth] = useState(1920)
  const [isMinting, setIsMinting] = useState(false)

  useEffect(() => {
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
  const [type, setType] = useState<any>()
  const [disabledNextButton, setDisabledNextButton] = useState(true)

  const handleChangeCurrentStep = step => {
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
  const [nftUrl, setNftUrl] = useState<string>(null)

  useEffect(() => {
    if (createTab !== null) {
      if (createTab === 0) setType(0)
      else if (createTab === 1) setType(1)

      setCurrentStep(1)
      dispatch({ type: 'set', createTab: null })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createTab])

  useEffect(() => {
    let width = 0
    switch (viewport) {
      case 'xl':
      case '2xl':
        width = 550
        break
      case 'lg':
        width = 400
        break
      case 'md':
        width = screenWidth - 200 - 32 - 8
        break
      default:
        // width = screenWidth - 32 - 8
        width = screenWidth
        break
    }
    if (width > 550) {
      setArtWidth(550)
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
            case 'xl':
            case '2xl':
              windowWidth = 550
              break
            case 'lg':
              windowWidth = 400
              break
            case 'md':
              windowWidth = screenWidth - 200 - 32 - 8
              break
            default:
              windowWidth = screenWidth
              break
          }
          if (windowWidth > 550) {
            setArtWidth(550)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nftArt])

  useEffect(() => {
    if (nftCover !== null && !(nftArt?.length > 0 && nftArt[0].type === '' && /\.glb$/.test(nftArt[0].path))) {
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
          if (windowWidth > 550) {
            setArtWidth(550)
          } else {
            setArtWidth(windowWidth)
          }
        }

        setSelectedDimension(dimensionList[0])
        setNftImage(URL.createObjectURL(nftCover[0]))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nftCover])

  useEffect(() => {
    handleFormValidate(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  useEffect(() => {
    handleFormValidate(currentStep)
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      let totalCost = metadataCost.basisPoints.add(assetCost.basisPoints).muln(1.5)

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
          instruction: ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 15_000_000 }),
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
          edition: 0,
          parent_nft: null,
          max_supply: editionType?.name == 'Limited Edition' ? maxNum : editionType?.name == 'Open Edition' ? null : 0,
        })
        .then(
          response => {},
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

  const [alertData, setAlertData] = useState<any[]>([])
  const [showAlert, setShowAlert] = useState(false)

  const handleShowAlert = (type, error) => {
    if (error === 'file-invalid-type') {
      let description = ''
      if (type === 'nft') description = `Supported file formats .png, .jpeg, .mp3, .mp4 and .gif`
      else if (type === 'audio') description = `Supported file formats for cover image include .png, .jpeg and .gif`
      setAlertData([
        {
          id: 0,
          title: 'File Format Not Supported',
          description,
          type: 'error',
        },
      ])
    } else if (error === 'file-too-large') {
      setAlertData([
        {
          id: 0,
          title: 'Max File Size Exceeded',
          description: `Oops! It looks like your file exceeded the max file size of 30mb`,
          type: 'error',
        },
      ])
    } else {
      setAlertData([
        {
          id: 0,
          title: 'Unknown Error',
          description: `Unknown Error`,
          type: 'error',
        },
      ])
    }
    setShowAlert(true)
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
              <div
                className="w-full flex gap-[28px] items-center g-container mt-[44px]"
                onClick={() => {
                  if (currentStep >= 1) {
                    setEditionType(null)
                  }
                  handleChangeCurrentStep(currentStep - 1)
                }}
              >
                <BackIcon />
                <div className={styles.createEdition}>
                  {currentStep === 1
                    ? 'Create'
                    : currentStep === 2
                    ? 'Additional Details'
                    : currentStep === 3
                    ? 'Review'
                    : ''}
                </div>
              </div>
              <div className="w-full flex justify-center g-container mt-[45px]">
                <div
                  className={`${styles.conatiner} max-w-[1920px] relative w-full flex lg:flex-row flex-col gap-[95px] mb-[50px]`}
                >
                  {/* left part */}
                  <div className="relative">
                    <SingleNftLeftSection
                      currentStep={currentStep}
                      nftType={nftType}
                      nftArt={nftArt}
                      nftUrl={nftUrl}
                      nftCover={nftCover}
                      nftImage={nftImage}
                      artWidth={artWidth}
                      setNftArt={setNftArt}
                      setNftImage={setNftImage}
                      setTakeSnapshotStatus={setTakeSnapshotStatus}
                      takeSnapshotStatus={takeSnapshotStatus}
                      handleShowAlert={handleShowAlert}
                      dimensionList={dimensionList}
                      selectedDimension={selectedDimension}
                      handleChangeDimension={handleChangeDimension}
                      handleDeleteNftArt={handleDeleteNftArt}
                    />
                  </div>
                  {/* right part */}
                  <div className="z-0 flex-1">
                    <div className={styles.rightContainer}>
                      <div className="w-full relative">
                        {/* upload artwork part */}
                        {currentStep === 1 && (
                          <>
                            <Step01SingleNFTSection
                              nftType={nftType}
                              nftCover={nftCover}
                              setNftCover={item => handleChangeNftCover(item)}
                              nftImage={nftImage}
                              setNftImage={setNftImage}
                              setTakeSnapshotStatus={setTakeSnapshotStatus}
                              selectedDimension={selectedDimension}
                              nftName={nftName}
                              setNftName={value => setNftName(value)}
                              description={description}
                              setDescription={value => setDescription(value)}
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
                            categoryList={categoryList}
                            handleSelectCategory={index => handleSelectCategory(index)}
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

                  <div className="absolute w-[122px] h-[53px] right-[57px] bottom-[41px]">
                    {isMinting ? (
                      <LoadingButton width={122} height={53} borderRadius={30} />
                    ) : (
                      <GradientButton
                        label={currentStep === 3 ? 'Mint' : 'Next'}
                        disabled={disabledNextButton}
                        width={122}
                        height={53}
                        borderRadius={30}
                        onClick={() => handleChangeCurrentStep((currentStep as any) === 4 ? 4 : currentStep + 1)}
                      />
                    )}
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
              <SingleNftLeftSection
                currentStep={currentStep}
                nftType={nftType}
                nftArt={nftArt}
                nftUrl={nftUrl}
                nftCover={nftCover}
                nftImage={nftImage}
                artWidth={artWidth}
                setNftArt={setNftArt}
                setNftImage={setNftImage}
                setTakeSnapshotStatus={setTakeSnapshotStatus}
                takeSnapshotStatus={takeSnapshotStatus}
                handleShowAlert={handleShowAlert}
                dimensionList={dimensionList}
                selectedDimension={selectedDimension}
                handleChangeDimension={handleChangeDimension}
                handleDeleteNftArt={handleDeleteNftArt}
              />
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
                  />
                </>
              )}

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
                  categoryList={categoryList}
                  handleSelectCategory={index => handleSelectCategory(index)}
                  showCategoryList={showCategoryList}
                  setShowCategoryList={value => setShowCategoryList(value)}
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
                    <div className="">
                      <OutlineButton
                        fullWidth
                        label="Back"
                        type="back"
                        onClick={() => handleChangeCurrentStep(currentStep - 1)}
                      />
                    </div>
                    <div className="w-full mt-[18px]">
                      <GradientButton
                        fullWidth
                        label="Next"
                        onClick={() => handleChangeCurrentStep(currentStep + 1)}
                        disabled={disabledNextButton}
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
    </div>
  )
}

export default SingleNft

SingleNft.getLayout = function getLayout(page) {
  return <SecondaryLayout>{page}</SecondaryLayout>
}
