import React, { useEffect, useState } from 'react'

// next components
import Head from 'next/head'
import NextImage from 'next/image'

// third party components
import { useSelector, useDispatch } from 'react-redux'

// components
import SecondaryLayout from 'components/Layout/SecondaryLayout'

// solana components
import { toMetaplexFile, JsonMetadata, MetaplexFile } from '@metaplex-foundation/js'

import { useMetaplex } from 'hooks/useMetaplex'

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
import IconButton from 'components/Button/IconButton'

// custom functions
import { useViewport, b64toBlob, getBase64FromUrl } from 'utils'

// images and icons
import EllipseGreen from 'assets/icons/ellipse-green.svg'
import TrashGrayIcon from 'assets/icons/trash-gray.svg'

// json
import NFTDimensionList from 'assets/json/nft-dimension-list.json'
import CategoryList from 'assets/json/popular-category.json'

// call apis
import axios from 'axios'
import nftsAPI from 'apis/nfts'

// styles
import styles from './single-nft.module.scss'

const SingleNft = () => {
  const viewport = useViewport()
  const dispatch = useDispatch()
  const isLoading = useSelector<any>(state => state.isLoading)

  const [screenWidth, setScreenWidth] = useState(1920)

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
  const [artHeight, setArtHeight] = useState(0)
  const [openNftImageEditorModal, setOpenNftImageEditorModal] = useState(false)
  const [nftImage, setNftImage] = useState('')

  useEffect(() => {
    let width = 0
    let ratio = 1920 / 1920
    switch (viewport) {
      case '2xl':
        width = screenWidth / 2 - 150 - 80 - 32
        break
      case 'xl':
        width = screenWidth / 2 - 120 - 80 - 32
        break
      case 'lg':
        width = screenWidth / 2 - 100 - 50 - 32
        break
      default:
        switch (selectedDimension.id) {
          case 0:
            width = screenWidth - 140
            break
          case 1:
            width = screenWidth - 60
            break
          case 2:
            width = screenWidth - 80
            break
          case 3:
            width = screenWidth - 140
            break
          case 4:
            width = screenWidth - 180
            break
          case 5:
            width = screenWidth - 225
            break
        }
        break
    }
    switch (selectedDimension.id) {
      case 0:
        ratio = selectedDimension.value[1] / selectedDimension.value[0]
        if (width > 672) {
          setArtWidth(672)
          setArtHeight(672 * ratio)
        } else {
          setArtWidth(width)
          setArtHeight(width * ratio)
        }
        break
      case 1:
        ratio = 1080 / 1920
        if (width > 636) {
          setArtWidth(636)
          setArtHeight(636 * ratio)
        } else {
          setArtWidth(width)
          setArtHeight(width * ratio)
        }
        break
      case 2:
        ratio = 1440 / 1920
        if (width > 636) {
          setArtWidth(636)
          setArtHeight(636 * ratio)
        } else {
          setArtWidth(width)
          setArtHeight(width * ratio)
        }
        break
      case 3:
        ratio = 1080 / 1080
        if (width > 672) {
          setArtWidth(672)
          setArtHeight(672 * ratio)
        } else {
          setArtWidth(width)
          setArtHeight(width * ratio)
        }
        break
      case 4:
        ratio = 1920 / 1440
        if (width > 487) {
          setArtWidth(487)
          setArtHeight(487 * ratio)
        } else {
          setArtWidth(width)
          setArtHeight(width * ratio)
        }
        break
      case 5:
        ratio = 1920 / 1080
        if (width > 366) {
          setArtWidth(366)
          setArtHeight(366 * ratio)
        } else {
          setArtWidth(width)
          setArtHeight(width * ratio)
        }
        break
    }
  }, [viewport, selectedDimension, screenWidth])

  useEffect(() => {
    if (nftArt !== null && nftArt !== undefined) {
      if (nftArt[0].type.split('/')[0] === 'image') {
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
              windowWidth = screenWidth / 2 - 150 - 80 - 32
              break
            case 'xl':
              windowWidth = screenWidth / 2 - 120 - 80 - 32
              break
            case 'lg':
              windowWidth = screenWidth / 2 - 100 - 50 - 32
              break
            default:
              windowWidth = screenWidth - 140
              break
          }
          if (windowWidth > 672) {
            setArtWidth(672)
            setArtHeight(672 * ratio)
          } else {
            setArtWidth(windowWidth)
            setArtHeight(windowWidth * ratio)
          }
        }

        setSelectedDimension(dimensionList[0])
        setNftType(nftArt[0].type.split('/')[0])
        setNftImage(URL.createObjectURL(nftArt[0]))
      } else if (nftArt[0].type === 'image/gif') {
        setNftType(nftArt[0].type)
        setNftImage(URL.createObjectURL(nftArt[0]))
      } else {
        setNftType(nftArt[0].type.split('/')[0])
      }
      setDisabledNextButton(false)
    }
  }, [nftArt])

  useEffect(() => {
    if (nftCover !== null && nftCover !== undefined) {
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
              windowWidth = screenWidth / 2 - 150 - 80 - 32
              break
            case 'xl':
              windowWidth = screenWidth / 2 - 120 - 80 - 32
              break
            case 'lg':
              windowWidth = screenWidth / 2 - 100 - 50 - 32
              break
            default:
              windowWidth = screenWidth - 140
              break
          }
          if (windowWidth > 672) {
            setArtWidth(672)
            setArtHeight(672 * ratio)
          } else {
            setArtWidth(windowWidth)
            setArtHeight(windowWidth * ratio)
          }
        }

        setSelectedDimension(dimensionList[0])
        setNftImage(URL.createObjectURL(nftCover[0]))
      }
      setDisabledNextButton(false)
    }
  }, [nftCover])

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

  // form validate
  const handleFormValidate = step => {
    switch (step) {
      case 1:
        if (nftArt !== null && nftArt !== undefined) {
          if (nftType === 'image' && nftImage !== '') {
            setDisabledNextButton(false)
          } else {
            setDisabledNextButton(true)
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

  // solana
  const { metaplex: mx } = useMetaplex()
  const [nftAddress, setNFTAddress] = useState('')

  const createNft = async () => {
    try {
      let reader = new FileReader()
      const fileData = nftType !== 'image' ? new Blob([nftArt[0]]) : b64toBlob(await getBase64FromUrl(nftImage))
      reader.readAsArrayBuffer(fileData)
      reader.onload = async event => {
        dispatch({ type: 'set', isLoading: true })
        const arrayBuffer = reader.result as ArrayBuffer

        const categories = categoryList.filter(item => item.checked)

        const attributes = categories.map(category => {
          return { trait_type: 'category', value: category.name }
        })

        const metadata: JsonMetadata<MetaplexFile> = {
          name: nftName,
          description: description,
          attributes: attributes,
        }

        if (nftType === 'image') {
          metadata.image = toMetaplexFile(arrayBuffer, 'metaplex.png')
          metadata.category = 'image'
          await uploadNft(metadata)
        } else {
          let coverReader = new FileReader()
          const coverFileData = b64toBlob(await getBase64FromUrl(nftImage))

          coverReader.readAsArrayBuffer(coverFileData)
          coverReader.onload = async function (event) {
            const coverArrayBuffer = coverReader.result as ArrayBuffer
            metadata.image = toMetaplexFile(coverArrayBuffer, 'metaplex.png')
            if (nftType === 'video') {
              const file = toMetaplexFile(arrayBuffer, 'metaplex.mp4', { contentType: 'video/mp4' })
              const fileURL = await mx.storage().upload(file)
              metadata.animation_url = fileURL
              metadata.category = 'video'
              metadata.properties = {
                files: [
                  {
                    type: 'video/mp4',
                    url: fileURL,
                  },
                ],
              }
            } else if (nftType === 'audio') {
              const file = toMetaplexFile(arrayBuffer, 'metaplex.mp3', { contentType: 'audio/mp3' })
              const fileURL = await mx.storage().upload(file)
              metadata.animation_url = fileURL
              metadata.category = 'audio'
              metadata.properties = {
                files: [
                  {
                    type: 'audio/mp3',
                    url: fileURL,
                  },
                ],
              }
            }
            await uploadNft(metadata)
          }
        }
      }
    } catch (error) {
      dispatch({ type: 'set', isLoading: false })
    }
  }

  const uploadNft = async metadata => {
    const { uri } = await mx.nfts().uploadMetadata(metadata).run()

    const { nft } = await mx
      .nfts()
      .create({
        uri,
        name: nftName,
        sellerFeeBasisPoints: royalties * 100,
      })
      .run()

    if (nft) {
      const address = nft.address.toBase58()
      setNFTAddress(address)

      const result = categoryList.filter(item => item.checked)
      let category = ''
      result.forEach(item => {
        category += item.name + ','
      })

      axios.get(nft.uri).then(response => {
        if (response !== undefined) {
          const result: any = response.data
          nftsAPI
            .create({
              token_id: address,
              nft_name: nft.name,
              categories: category.slice(0, -1),
              asset_type: nftType,
              cover_image_url: nftType === 'audio' ? result['image'] : '',
              asset_url:
                nftType === 'video' || nftType === 'audio' || nftType === 'image/gif'
                  ? result['animation_url']
                  : result['image'],
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
    }

    dispatch({ type: 'set', isLoading: false })
  }

  const reset = () => {
    setCurrentStep(1)
    setNftArt(null)
    setNftName('')
    setDescription('')
    const categories = categoryList.map(item => {
      item.checked = false
      return item
    })
    setCategoryList(categories)
    setShowCategoryList(false)
    setRoyalties(0)
    setNFTAddress('')
  }

  return (
    <div className="w-full flex justify-center">
      <Head>
        <title>Foster Marketplace</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/logo.svg" />
      </Head>
      {viewport === 'lg' || viewport === 'xl' || viewport === '2xl'
        ? currentStep !== 4 && (
            <div className="relative w-full grid grid-cols-12 gap-0">
              {/* left part */}
              <div className="relative col-span-12 lg:col-span-6 g-left-container">
                <div className={styles.topLeftEllipse}>
                  <NextImage src={EllipseGreen} alt="" objectFit="cover" />
                </div>
                <div className={styles.leftContainer}>
                  <div className={`${styles.title} w-full`}>Preview Art</div>
                  <div className="w-full flex flex-wrap justify-center z-10 mt-[22px]">
                    {nftType === 'image' || nftType === 'image/gif' ? (
                      <div className={`${styles.artArea}`} style={{ width: artWidth, height: artHeight }}>
                        {nftImage !== '' && artWidth !== 0 && artHeight !== 0 ? (
                          <img src={nftImage} alt="" className="w-full h-full rounded-[12px] object-contain" />
                        ) : (
                          <div className={`${styles.artArea}`} style={{ width: artWidth, height: artHeight }} />
                        )}
                      </div>
                    ) : (
                      <div className={`${styles.artArea}`} style={{ width: artWidth, height: artHeight }}>
                        {nftType === 'video' ? (
                          <video controls className="w-full" id="video">
                            <source src={URL.createObjectURL(nftArt[0])} type={nftArt[0].type} />
                            Your browser does not support the video tag.
                          </video>
                        ) : nftImage !== '' && artWidth !== 0 && artHeight !== 0 ? (
                          <img src={nftImage} alt="" className="w-full h-full rounded-[12px] object-contain" />
                        ) : (
                          <div className={`${styles.artArea}`} style={{ width: artWidth, height: artHeight }} />
                        )}
                      </div>
                    )}

                    {nftArt !== null && nftArt !== undefined && (
                      <div className="w-full mt-4 flex justify-between" style={{ width: artWidth }}>
                        {currentStep === 1 ? (
                          <DimensionMenu
                            dimensionList={dimensionList}
                            selectedDimension={selectedDimension}
                            onSelect={item => {
                              setSelectedDimension(item)
                              setOpenNftImageEditorModal(true)
                            }}
                          />
                        ) : (
                          <>&nbsp;</>
                        )}
                        {currentStep === 1 ? (
                          <IconButton
                            icon={TrashGrayIcon}
                            onClick={() => {
                              setNftArt(null)
                              setNftImage('')
                              setNftType('image')
                              handleFormValidate(1)
                            }}
                            backgroundColor="transparent"
                          />
                        ) : (
                          <>&nbsp;</>
                        )}
                      </div>
                    )}

                    {nftType === 'audio' && (
                      <div className="w-full my-10">
                        <audio controls className="w-full">
                          <source src={URL.createObjectURL(nftArt[0])} type={nftArt[0].type} />
                          Your browser does not support the video tag.
                        </audio>
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
                      <Step01SingleNFTSection
                        nftType={nftType}
                        setNftArt={item => setNftArt(item)}
                        setNftCover={item => setNftCover(item)}
                      />
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
                          backgroundColor="#378287"
                          color="#EFF0F6"
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
            <div className="g-container mt-[26px] mb-[47px]">
              {/* stepper part */}
              <div className="w-full">
                <Stepper currentStep={currentStep} />
              </div>
              <div className={`${styles.title} w-full`}>Preview Art</div>

              <div className="w-full flex flex-wrap justify-center mt-[22px]">
                {nftType === 'image' ? (
                  <div className={`${styles.artArea}`} style={{ width: artWidth, height: artHeight }}>
                    {nftImage !== '' && artWidth !== 0 && artHeight !== 0 ? (
                      <img src={nftImage} alt="" className="w-full h-full rounded-[6px] object-contain" />
                    ) : (
                      <div className={`${styles.artArea}`} style={{ width: artWidth, height: artHeight }} />
                    )}
                  </div>
                ) : (
                  <div className={`${styles.artArea}`} style={{ width: artWidth, height: artHeight }}>
                    {nftType === 'video' ? (
                      <video controls className="w-full" id="video">
                        <source src={URL.createObjectURL(nftArt[0])} type={nftArt[0].type} />
                        Your browser does not support the video tag.
                      </video>
                    ) : nftImage !== '' && artWidth !== 0 && artHeight !== 0 ? (
                      <img src={nftImage} alt="" className="w-full h-full rounded-[6px] object-contain" />
                    ) : (
                      <div className={`${styles.artArea}`} style={{ width: artWidth, height: artHeight }} />
                    )}
                  </div>
                )}

                {nftArt !== null && nftArt !== undefined && (
                  <div className="w-full mt-4 flex justify-center">
                    <div className="w-full flex justify-between">
                      <DimensionMenu
                        dimensionList={dimensionList}
                        selectedDimension={selectedDimension}
                        onSelect={item => {
                          setSelectedDimension(item)
                          setOpenNftImageEditorModal(true)
                        }}
                      />
                      <IconButton
                        icon={TrashGrayIcon}
                        onClick={() => {
                          setNftArt(null)
                          setNftImage('')
                          setNftType('image')
                          handleFormValidate(1)
                        }}
                        backgroundColor="transparent"
                        width="32px"
                        height="32px"
                      />
                    </div>
                  </div>
                )}

                {nftType === 'audio' && (
                  <div className="w-full mt-[14px]">
                    <audio controls className="w-full">
                      <source src={URL.createObjectURL(nftArt[0])} type={nftArt[0].type} />
                      Your browser does not support the video tag.
                    </audio>
                  </div>
                )}
              </div>
              {/* upload artwork part */}
              {currentStep === 1 && (
                <Step01SingleNFTSection
                  nftType={nftType}
                  setNftArt={item => setNftArt(item)}
                  setNftCover={item => setNftCover(item)}
                />
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
                        height="45px"
                        backgroundColor="#378287"
                        color="#EFF0F6"
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
                      backgroundColor="#378287"
                      color="#EFF0F6"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
      {currentStep === 4 && (
        <SuccessMintSingleNFTSection
          nftType={nftType}
          reset={reset}
          nftArt={nftArt}
          nftImage={nftImage}
          artWidth={artWidth}
          nftAddress={nftAddress}
          artHeight={artHeight}
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
      <ProgressingModal open={isLoading} />
    </div>
  )
}

export default SingleNft

SingleNft.getLayout = function getLayout(page) {
  return <SecondaryLayout>{page}</SecondaryLayout>
}
