import React, { useState } from 'react'

// next components

// third party components
import Dropzone from 'react-dropzone'

// components
import Alert from 'components/Alert'
import NftImageEditorModal from 'components/Modal/NftImageEditorModal'
import Textarea from 'components/Input/Textarea'
import CheckboxGroup from 'components/Checkbox/CheckboxGroup'
import CategoryListModal from 'components/Modal/CategoryListModal'
import Input from 'components/Input'

// custom functions
import { useViewport } from 'utils'

// images and icons
import UploadGreenIcon from 'assets/icons/upload-green-24x24.svg?component'
import ImageIcon from 'assets/icons/image-icon.svg?component'
import ShareIcon from 'assets/icons/share-icon.svg?component'
import TrashBin from 'assets/icons/trash-bin.svg?component'
import ArrowDownIcon from 'assets/icons/arrow-down-white.svg?component'

// json
import CategoryList from 'assets/json/popular-category.json'

// styles
import styles from './index.module.scss'

// resources
import { limit } from 'utils/strings'
import Chip from 'components/Chip'

const Step01SingleNFTSection = props => {
  const {
    nftType,
    nftImage,
    setNftImage,
    nftCover,
    setNftArt,
    setNftCover,
    setTakeSnapshotStatus,
    selectedDimension,
    nftName,
    setNftName,
    description,
    setDescription,
    categoryList,
    showCategoryList,
    setShowCategoryList,
    handleSelectCategory,
    handleCancelCategory,
  } = props

  const viewport = useViewport()

  const [showAlert, setShowAlert] = useState(false)
  const [alertData, setAlertData] = useState<any[]>([])
  const [openCoverImageEditorModal, setOpenCoverImageEditorModal] = useState(false)
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

  return (
    <div className="w-full">
      {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
        <div className="w-full h-[66vh] overflow-auto pr-[20px]">
          <div className={`${styles.subTitle}`}>
            Upload Art <span>*</span>
          </div>
          <div className="mt-[21px]">
            <Dropzone
              onDropAccepted={acceptedFiles => {
                acceptedFiles.length !== 0 ? setNftArt(acceptedFiles) : handleShowAlert('nft', 'unknown')
              }}
              onDropRejected={rejectedFiles => {
                handleShowAlert('nft', rejectedFiles[0]?.errors[0]?.code)
              }}
              accept={{
                'image/jpeg': [],
                'image/png': [],
                'image/gif': [],
                'video/mp4': [],
                'audio/mpeg': [],
                'audio/wav': [],
                'model/gltf-binary': ['.glb'],
              }}
              maxFiles={1}
              maxSize={104857600}
            >
              {({ getRootProps, getInputProps }) => (
                <section className={styles.dropzone}>
                  <div {...getRootProps()} className={styles.selectArea}>
                    <input {...getInputProps()} />
                    <p className={styles.uploadText}>Upload Here</p>
                    <p className={styles.text}>Supported File Formats .png .jpeg .mp4 .mp3 .gif .glb</p>
                    <p className={styles.greenText}>Max File Size 100mb</p>
                  </div>
                </section>
              )}
            </Dropzone>
          </div>

          {nftType === 'audio' && (
            <>
              <div className={`${styles.subTitle} mt-[30px]`}>
                Audio Cover <span>*</span>
              </div>
              <div className="mt-5">
                <Dropzone
                  onDropAccepted={acceptedFiles => {
                    acceptedFiles.length !== 0 ? setNftCover(acceptedFiles) : handleShowAlert('audio', 'unknown')
                  }}
                  onDropRejected={rejectedFiles => {
                    handleShowAlert('audio', rejectedFiles[0]?.errors[0]?.code)
                  }}
                  maxFiles={1}
                  accept={{ 'image/jpeg': [], 'image/png': [] }}
                  maxSize={104857600}
                >
                  {({ getRootProps, getInputProps }) => (
                    <section className={nftType === 'audio' ? styles.dropzone : styles.dropzone}>
                      <div {...getRootProps()} className={styles.selectArea}>
                        <input {...getInputProps()} />
                        <p className={styles.uploadText}>Upload Here</p>
                        <p className={styles.text}>Supported File Formats .png .jpeg</p>
                        <p className={styles.greenText}>Max File Size 100mb</p>
                      </div>
                    </section>
                  )}
                </Dropzone>
              </div>
            </>
          )}
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
          <div className="w-full">
            <div className={`${styles.subTitle} mt-[30px]`}>
              Artwork Name <span>*</span>
            </div>
            <div className="max-w-[370px] w-full mt-[15px]">
              <Input
                value={limit(nftName, 32)}
                placeholder="Give your art name"
                fontFamily="Muli-Light"
                label01="Max Characters 32"
                label02={32 - nftName?.length === 32 ? '' : `${32 - nftName?.length} Characters left`}
                onChange={value => setNftName(limit(value, 32))}
              />
            </div>
            <div className={`${styles.subTitle} mt-[30px]`}>
              Artwork Description <span>*</span>
            </div>
            <div className="w-full mt-[15px]">
              <Textarea
                height={150}
                value={limit(description, 1000)}
                color={'var(--text-gray-200-color)'}
                placeholder="Add a short description..."
                fontFamily="Muli-Light"
                label01="Max Characters 1000"
                label02={1000 - description?.length === 1000 ? '' : `${1000 - description?.length} Characters left`}
                onChange={value => setDescription(limit(value, 1000))}
              />
            </div>
            <div className={`${styles.subTitle} mt-[30px]`}>Category (optional)</div>
            <div className={`${styles.categoryDesc} mt-[9px]`}>Select up to three categories</div>
            <div className="w-full mt-[15px]">
              {categoryList && (
                <CheckboxGroup categoryList={categoryList} onChange={index => handleSelectCategory(index)} />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full">
          {nftType === 'audio' && (
            <div className={`${styles.subTitle} mt-5`}>
              Art <span>*</span>
            </div>
          )}
          <div className="mt-5">
            <Dropzone
              onDropAccepted={acceptedFiles => {
                acceptedFiles.length !== 0 ? setNftArt(acceptedFiles) : handleShowAlert('nft', 'unknown')
              }}
              onDropRejected={rejectedFiles => {
                handleShowAlert('nft', rejectedFiles[0]?.errors[0]?.code)
              }}
              accept={{
                'image/jpeg': [],
                'image/png': [],
                'image/gif': [],
                'video/mp4': [],
                'audio/mpeg': [],
                'audio/wav': [],
                'model/gltf-binary': ['.glb'],
              }}
              maxFiles={1}
              maxSize={104857600}
            >
              {({ getRootProps, getInputProps }) => (
                <section className={styles.dropzone}>
                  <div {...getRootProps()} className={styles.selectArea}>
                    <input {...getInputProps()} />
                    <UploadGreenIcon alt="" />
                    <p className={styles.uploadText}>Upload Here</p>
                    <p className={styles.text}>
                      Supported File Formats
                      <br />
                      .png .jpeg .mp4 .gif .glb
                    </p>
                    <p className={styles.greenText}>Max File Size 100mb</p>
                  </div>
                </section>
              )}
            </Dropzone>
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
          </div>
          {nftType === 'audio' && (
            <>
              <div className={`${styles.subTitle} mt-[30px]`}>
                Audio Cover <span>*</span>
              </div>
              <div className="mt-5">
                <Dropzone
                  onDropAccepted={acceptedFiles => {
                    acceptedFiles.length !== 0 ? setNftCover(acceptedFiles) : handleShowAlert('audio', 'unknown')
                  }}
                  onDropRejected={rejectedFiles => {
                    handleShowAlert('audio', rejectedFiles[0]?.errors[0]?.code)
                  }}
                  maxFiles={1}
                  accept={{ 'image/jpeg': [], 'image/png': [] }}
                  maxSize={104857600}
                >
                  {({ getRootProps, getInputProps }) => (
                    <section className={nftType === 'audio' ? styles.dropzone : styles.dropzone}>
                      <div {...getRootProps()} className={styles.selectArea}>
                        <input {...getInputProps()} />
                        <UploadGreenIcon alt="" />
                        <p className={styles.uploadText}>Upload Here</p>
                        <p className={styles.text}>
                          Supported File Formats
                          <br />
                          .png .jpeg
                        </p>
                        <p className={styles.greenText}>Max File Size 100mb</p>
                      </div>
                    </section>
                  )}
                </Dropzone>
              </div>
            </>
          )}

          <div className="w-full">
            <div className={`${styles.subTitle} mt-[30px]`}>
              Artwork Name <span>*</span>
            </div>
            <div className="max-w-[370px] w-full mt-[15px]">
              <Input
                value={limit(nftName, 32)}
                placeholder="Give your art name"
                fontFamily="Muli-Light"
                color={'var(--text-gray-200-color)'}
                label01="Max Characters 32"
                label02={32 - nftName?.length === 32 ? '' : `${32 - nftName?.length} Characters left`}
                onChange={value => setNftName(limit(value, 32))}
              />
            </div>
            <div className={`${styles.subTitle} mt-[30px]`}>
              Artwork Description <span>*</span>
            </div>
            <div className="w-full mt-[15px]">
              <Textarea
                value={limit(description, 1000)}
                height={150}
                placeholder="Add a short description..."
                color={'var(--text-gray-200-color)'}
                fontFamily="Muli-Light"
                label01="Max Characters 1000"
                label02={1000 - description.length === 1000 ? '' : `${1000 - description.length} Characters left`}
                onChange={value => setDescription(value)}
              />
            </div>
            <div className="w-full mt-[30px]">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <div className={styles.chooseCategory}>Category (optional)</div>
                  <div className={styles.categoryBtn} onClick={() => setShowCategoryList(true)}>
                    <>Select up to three categories</>
                    <ArrowDownIcon />
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-wrap justify-start items-center mt-[9px] gap-[10px]">
                {categoryList?.map((item, index) => item.checked === true && <Chip data={item} key={index} />)}
              </div>
              {showCategoryList && (
                <CategoryListModal
                  data={CategoryList}
                  categoryList={categoryList}
                  onChange={index => handleSelectCategory(index)}
                  onClick={() => setShowCategoryList(!showCategoryList)}
                  onClickCancel={() => handleCancelCategory()}
                />
              )}
            </div>
          </div>
        </div>
      )}
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

export default Step01SingleNFTSection
