import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

// next components

// third party components
import { limit } from 'utils/strings'

// components
import Alert from 'components/Alert'
import NftImageEditorModal from 'components/Modal/NftImageEditorModal'
import Input from 'components/Input'
import Textarea from 'components/Input/Textarea'
import CategoryListModal from 'components/Modal/CategoryListModal'

// custom functions
import { useViewport, namePublicFile } from 'utils'
import { getEACollectionInfo } from 'utils/collection.util'

// images and icons
import ArrowDownIcon from 'assets/icons/arrow-down-white.svg?component'

// json
import CategoryList from 'assets/json/popular-category.json'

// styles
import styles from './index.module.scss'

// call apis
import uploadFileToS3API from 'apis/aws'
import ImportEAModal from 'components/Modal/ImportEAModal'
import { validDigits } from 'utils/helpers'
import { useRouter } from 'next/router'
import CategorySelectionMenu from 'components/Menu/CategorySelectionMenu'
import GradientButton from 'components/Button/GradientButton'
import OutlineButton from 'components/Button/OutlineButton'
import Chip from 'components/Chip'
import CollectionNftLeftSection from '../CollectionNftLeftSection'

const Step01CollectionSection = props => {
  const {
    currentStep,
    onChangeCurrentStep,
    collectionName,
    onChangeCollectionName,
    description,
    onChangeDescription,
    coverImage,
    onChangeCoverImage,
    coverCroppedImage,
    setCoverCroppedImage,
    setCoverAWSUrl,
    bannerImage,
    onChangeBannerImage,
    bannerCroppedImage,
    setBannerCroppedImage,
    setBannerAWSUrl,
    royalties,
    onChangeRoyalties,
    categoryList,
    onChangeCategoryList,
    setDisabledButton,
    onNext,
  } = props
  const viewport = useViewport()
  const router = useRouter()

  const collectionKind = useSelector<any>(state => state.collectionKind)

  // variables
  const [showAlert, setShowAlert] = useState(false)
  const [alertData, setAlertData] = useState<any[]>([])
  const [showEAModal, setShowEAModal] = useState(false)
  const [enableImageDialog, setEnableImageDialog] = useState(false)
  const [enableCoverImageDialog, setEnableCoverImageDialog] = useState(false)

  useEffect(() => {
    if (collectionKind === 'ea') {
      setShowEAModal(true)
    }
  }, [collectionKind])

  const handleShowAlert = (type, error) => {
    if (error === 'file-invalid-type') {
      setAlertData([
        {
          id: 0,
          title: 'File Format Not Supported',
          description: `Supported file formats for ${type} image include .png, .jpeg and .gif`,
          type: 'error',
        },
      ])
    } else if (error === 'file-too-large') {
      setAlertData([
        {
          id: 0,
          title: 'Max File Size Exceeded',
          description: `Oops! It looks like your file exceeded the max file size of ${
            type === 'cover' ? '10mb' : '30mb'
          }`,
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

  const [openCoverImageEditorModal, setOpenCoverImageEditorModal] = useState(false)
  const [openBannerImageEditorModal, setOpenBannerImageEditorModal] = useState(false)
  const [disabledNextButton, setDisabledNextButton] = useState(true)

  const [updateBannerImage, setUpdateBannerImage] = useState(false)
  const [updateCoverImage, setUpdateCoverImage] = useState(false)

  useEffect(() => {
    if (coverImage !== null && coverImage !== undefined && enableCoverImageDialog) {
      if (coverImage[0].type.split('/')[0] === 'image' && coverImage[0].type !== 'image/gif') {
        setOpenCoverImageEditorModal(true)
      }
      setEnableCoverImageDialog(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coverImage, enableImageDialog])

  useEffect(() => {
    if (bannerImage !== null && bannerImage !== undefined && enableImageDialog) {
      if (bannerImage[0].type.split('/')[0] === 'image' && bannerImage[0].type !== 'image/gif') {
        setOpenBannerImageEditorModal(true)
      }
      setEnableImageDialog(false)
    }
  }, [bannerImage, enableImageDialog])

  useEffect(() => {
    if (bannerCroppedImage !== '' && updateBannerImage) {
      const fetchData = async url => {
        let response = await fetch(url)
        let blob = await response.blob()
        const file = new File([blob], 'avatar.jpg', {
          type: 'image/jpeg',
        })
        const filename = namePublicFile('avatar.jpg')
        uploadBannerFile(file, filename)
      }
      fetchData(bannerCroppedImage)
      setUpdateBannerImage(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateBannerImage])

  const uploadBannerFile = async (file: any, filename: string) => {
    const { url } = await uploadFileToS3API(file, filename)
    setBannerAWSUrl(url)
  }

  useEffect(() => {
    if (coverCroppedImage !== '' && updateCoverImage) {
      const fetchData = async url => {
        let response = await fetch(url)
        let blob = await response.blob()
        const file = new File([blob], 'avatar.jpg', {
          type: 'image/jpeg',
        })
        const filename = namePublicFile('avatar.jpg')
        uploadCoverfile(file, filename)
      }
      fetchData(coverCroppedImage)
      setUpdateCoverImage(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateCoverImage])

  const uploadCoverfile = async (file: any, filename: string) => {
    const { url } = await uploadFileToS3API(file, filename)
    setCoverAWSUrl(url)
  }

  const [showCategoryList, setShowCategoryList] = useState(false)

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
    onChangeCategoryList(array)
  }

  const importEACollection = async url => {
    setShowEAModal(false)

    try {
      let collectionInfo = await getEACollectionInfo(url)

      let { name, description, primaryCategory, secondaryCategory, tags = [] } = collectionInfo.info

      let eaTags = [primaryCategory, secondaryCategory, ...tags]
      let eaTagSet = new Set(eaTags.filter(tag => typeof tag == 'string').map(tag => tag.toLowerCase()))
      let checkedCount = 0
      let fosterCategories = [...categoryList]
      for (let category of fosterCategories)
        if (eaTagSet.has(category.name.toLowerCase()) && checkedCount < 3) {
          category.checked = true
          checkedCount++
        }
      onChangeCategoryList(fosterCategories)

      onChangeCollectionName(name)
      onChangeDescription(description)

      let { thumbnailPath, bannerPath } = collectionInfo.assets
      let coverName = thumbnailPath.match(/[^\/]*$/)?.[0] || 'cover.png'
      let bannerName = bannerPath.match(/[^\/]*$/)?.[0] || 'banner.png'
      let [coverBlob, bannerBlob] = await Promise.all([
        fetch(thumbnailPath)
          .then(r => r.blob())
          .catch(e => e),
        fetch(bannerPath)
          .then(r => r.blob())
          .catch(e => e),
      ])

      if (coverBlob instanceof Blob) {
        setEnableCoverImageDialog(true)
        onChangeCoverImage([
          new File([coverBlob], coverName, {
            type: coverBlob.type,
          }),
        ])
      } else {
        console.error(`could not fetch EA collection image from ${thumbnailPath}: ${coverBlob?.message}`)
        // TODO: show error message
      }

      await new Promise(resolve => setTimeout(resolve, 1))

      if (bannerBlob instanceof Blob) {
        setEnableImageDialog(true)
        onChangeBannerImage([
          new File([bannerBlob], bannerName, {
            type: bannerBlob.type,
          }),
        ])
      } else {
        console.error(`could not fetch EA banner image from ${bannerPath}: ${bannerBlob?.message}`)
        // TODO: show error message
      }
    } catch (e) {
      console.error(e)
      // TODO: show error message
    }
  }

  useEffect(() => {
    let count = 0
    categoryList.map(item => {
      if (item.checked === true) count++
    })

    if (
      collectionName !== '' &&
      description !== '' &&
      count <= 3 &&
      coverCroppedImage !== undefined &&
      bannerCroppedImage !== undefined
    ) {
      setDisabledNextButton(false)
      setDisabledButton(false)
    } else {
      setDisabledNextButton(true)
      setDisabledButton(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    collectionName,
    description,
    coverCroppedImage,
    bannerCroppedImage,
    coverImage,
    bannerImage,
    categoryList,
    royalties,
  ])

  return (
    <div className="w-full g-container mt-[30px] lg:mt-[45px] mb-[100px]">
      {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
        <div className={`${styles.conatiner} w-full flex gap-[95px] relative`}>
          {/* left part */}
          <div className="">
            <CollectionNftLeftSection
              bannerCroppedImage={bannerCroppedImage}
              setEnableImageDialog={setEnableImageDialog}
              onChangeBannerImage={onChangeBannerImage}
              coverCroppedImage={coverCroppedImage}
              setEnableCoverImageDialog={setEnableCoverImageDialog}
              onChangeCoverImage={onChangeCoverImage}
              handleShowAlert={handleShowAlert}
              setShowEAModal={setShowEAModal}
            />
          </div>
          {/* right part */}
          <div className="flex-1 z-0">
            <div className={styles.rightContainer}>
              <div className="w-full relative">
                {/* upload artwork part */}
                <div className="w-full">
                  <div className={`${styles.subTitle}`}>
                    Collection Name <span>*</span>
                  </div>
                  <div className="w-full mt-[15px]">
                    <Input
                      value={limit(collectionName, 32)}
                      placeholder="Give your collection a name"
                      label01="Max Characters 32"
                      label02={32 - collectionName.length === 32 ? '' : `${32 - collectionName.length} Characters left`}
                      onChange={value => onChangeCollectionName(limit(value, 32))}
                    />
                  </div>
                  <div className={`${styles.subTitle} mt-[30px]`}>
                    Description <span>*</span>
                  </div>
                  <div className="w-full mt-[15px]">
                    <Textarea
                      value={limit(description, 1000)}
                      placeholder="Add a short description..."
                      height={152}
                      label01="Max Characters 1000"
                      label02={
                        1000 - description.length <= 0 || 1000 - description.length === 1000
                          ? ''
                          : `${1000 - description.length} Characters left`
                      }
                      onChange={value => onChangeDescription(limit(value, 1000))}
                    />
                  </div>

                  <div className={`${styles.subTitle} mt-[24px] mb-[15px]`}>Category (optional)</div>

                  <CategorySelectionMenu
                    categoryList={categoryList}
                    handleSelectCategory={handleSelectCategory}
                    placeholder="Select up to three categories"
                  />

                  <div className={`${styles.subTitle} mt-[24px] flex justify-start items-center gap-2`}>
                    Royalties <span>*</span>
                  </div>

                  <div className="max-w-[370px] w-full mt-[15px]">
                    <Input
                      value={royalties}
                      placeholder="Insert a royalty percentage"
                      label01="From 0 to 10%"
                      min="0"
                      onChange={value => {
                        let royal = validDigits(value)
                        if (royal > 10) {
                          onChangeRoyalties(10)
                        } else {
                          onChangeRoyalties(Math.floor(royal))
                        }
                      }}
                    />
                  </div>

                  <div className="mt-[30px] w-full h-[53px] flex justify-end z-[10]">
                    <GradientButton
                      label="Next"
                      disabled={disabledNextButton}
                      width={122}
                      height={53}
                      borderRadius={30}
                      onClick={() => onNext()}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // mobile part
        <div className="mb-[47px]">
          <CollectionNftLeftSection
            bannerCroppedImage={bannerCroppedImage}
            setEnableImageDialog={setEnableImageDialog}
            onChangeBannerImage={onChangeBannerImage}
            coverCroppedImage={coverCroppedImage}
            setEnableCoverImageDialog={setEnableCoverImageDialog}
            onChangeCoverImage={onChangeCoverImage}
            handleShowAlert={handleShowAlert}
            setShowEAModal={setShowEAModal}
          />

          {/* upload artwork part */}
          <div className="w-full">
            <div className={`${styles.subTitle} mt-[30px]`}>
              Collection Name <span>*</span>
            </div>
            <div className="max-w-[370px] w-full mt-[15px] z-10">
              <Input
                value={limit(collectionName, 32)}
                placeholder="Give your collection a name"
                label01="Max Characters 32"
                label02={32 - collectionName.length === 32 ? '' : `${32 - collectionName.length} Characters left`}
                onChange={value => onChangeCollectionName(limit(value, 32))}
              />
            </div>
            <div className={`${styles.subTitle} mt-[24px]`}>
              Description <span>*</span>
            </div>
            <div className="w-full mt-[15px]">
              <Textarea
                value={limit(description, 1000)}
                placeholder="Add a short description..."
                label01="Max Characters 1000"
                label02={1000 - description.length === 1000 ? '' : `${1000 - description.length} Characters left`}
                onChange={value => onChangeDescription(value)}
              />
            </div>
            <div className={`${styles.subTitle} mt-[30px] flex justify-start items-center gap-2`}>
              Royalties <span>*</span>
            </div>
            <div className="max-w-[370px] w-full mt-[15px]">
              <Input
                value={royalties}
                placeholder="Insert a royalty percentage"
                label01="From 0 to 10%"
                min={0}
                onChange={value => {
                  let royal = validDigits(value)
                  if (royal > 10) {
                    onChangeRoyalties(10)
                  } else onChangeRoyalties(Math.floor(royal))
                }}
              />
            </div>
            <div className={`${styles.subTitle} mt-[30px]`}>Category (optional)</div>
            <div className={styles.categoryBtn} onClick={() => setShowCategoryList(true)}>
              <>Select up to three categories</>
              <ArrowDownIcon />
            </div>
            <div className="w-full flex flex-wrap justify-start items-center mt-[9px] gap-[10px]">
              {categoryList?.map((item, index) => item.checked === true && <Chip data={item} key={index} />)}
            </div>
            <div className="w-full mt-4">
              {showCategoryList && (
                <CategoryListModal
                  data={CategoryList}
                  categoryList={categoryList}
                  onChange={index => handleSelectCategory(index)}
                  onClick={() => setShowCategoryList(!showCategoryList)}
                  onClickCancel={() => setShowCategoryList(false)}
                />
              )}
            </div>
          </div>

          <div className="w-full my-[30px]">
            {/* button group part */}
            <div>
              <OutlineButton
                label="Back"
                onClick={() => {
                  if (currentStep === 1) router.push('/create/single-nft')
                  else onChangeCurrentStep(currentStep - 1)
                }}
                fullWidth
              />
            </div>
            <div className="mt-[18px]">
              <GradientButton
                fullWidth
                label="Next"
                disabled={disabledNextButton}
                onClick={() => {
                  onChangeCurrentStep(currentStep + 1)
                }}
              />
            </div>
          </div>
        </div>
      )}

      <ImportEAModal
        open={showEAModal}
        onClose={() => {
          setShowEAModal(false)
        }}
        onImportUrl={importEACollection}
      />

      <Alert
        open={showAlert}
        close={() => {
          setShowAlert(false)
        }}
        data={alertData}
      />
      <NftImageEditorModal
        open={openCoverImageEditorModal}
        close={() => setOpenCoverImageEditorModal(false)}
        nftImage={coverImage}
        getCroppedImage={croppedImage => {
          setUpdateCoverImage(true)
          setCoverCroppedImage(croppedImage)
          setOpenCoverImageEditorModal(false)
        }}
        dimension={{ value: [1080, 1080] }}
      />
      <NftImageEditorModal
        open={openBannerImageEditorModal}
        close={() => setOpenBannerImageEditorModal(false)}
        nftImage={bannerImage}
        getCroppedImage={croppedImage => {
          setUpdateBannerImage(true)
          setBannerCroppedImage(croppedImage)
          setOpenBannerImageEditorModal(false)
        }}
        dimension={{ value: [758, 194] }}
      />
    </div>
  )
}

export default Step01CollectionSection
