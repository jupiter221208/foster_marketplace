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

// custom functions
import { useViewport } from 'utils'

// images and icons
import UploadGreenIcon from 'assets/icons/upload-green-24x24.svg?component'
import ImageIcon from 'assets/icons/image-icon.svg?component'
import ShareIcon from 'assets/icons/share-icon.svg?component'
import TrashBin from 'assets/icons/trash-bin.svg?component'

// json
import CategoryList from 'assets/json/popular-category.json'

// styles
import styles from './index.module.scss'

// resources
import SwipRadio from 'components/Radio/SwipRadio'
import Input from 'components/Input'
import EditionList from 'assets/json/single-nft/edition-type.json'
import MaxNumberList from 'assets/json/single-nft/max-number-list.json'
import { limit } from 'utils/strings'

const Step01SingleNFTSection = props => {
  const {
    nftType,
    nftImage,
    setNftImage,
    nftCover,
    setNftArt,
    setNftCover,
    type,
    setEditionType,
    setMaxSupply,
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
  const [infoFocus, setInfoFocus] = useState(false)
  const [edition, setEdition] = useState(2)
  const [maxNum, setMaxNum] = useState(MaxNumberList[0])
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
        <div className="w-full">
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
              maxSize={31457280}
            >
              {({ getRootProps, getInputProps }) => (
                <section className={styles.dropzone}>
                  <div {...getRootProps()} className={styles.selectArea}>
                    <input {...getInputProps()} />
                    <p className={styles.uploadText}>Upload Here</p>
                    <p className={styles.text}>Supported File Formats .png .jpeg .mp4 .mp3 .gif .glb</p>
                    <p className={styles.greenText}>Max File Size 30mb</p>
                  </div>
                </section>
              )}
            </Dropzone>
          </div>

          {type !== 0 && (
            <div className="mt-[44px]">
              <div className={styles.subTitle}>
                Edition type <span>*</span>
              </div>
              <div className={styles.editionDescription}>Editions are created on-demand</div>
              <SwipRadio
                data={EditionList}
                selected={edition}
                onChange={item => {
                  setEdition(item)
                  setEditionType(item)
                }}
              />
              {edition['id'] === 0 && (
                <div className="mt-[45px]">
                  <div className={styles.maxSupplyTitle}>
                    Max Supply <span>*</span>
                  </div>
                  <div className={styles.editionDescription}>The max number of copies that will be created</div>
                  <div className="flex flex-wrap gap-[20px] justify-between mt-[16px] lg:mt-[25px]">
                    {MaxNumberList.map((item, index) => (
                      <div
                        key={index}
                        className={`${maxNum.id === item.id ? styles.selectSupply : styles.noneSupply}`}
                        onClick={() => {
                          setMaxNum(item)
                          setMaxSupply(item.value)
                        }}
                      >
                        {item.label}
                      </div>
                    ))}
                  </div>
                  {maxNum['id'] === 3 && (
                    <div className="max-w-[450px] mt-[45px]">
                      <div className={styles.maxTitle}>
                        Custom Supply <span>*</span>
                      </div>
                      <div className="mt-[15px]">
                        <Input
                          onChange={value => {
                            setMaxSupply(value)
                          }}
                          backgroundColor="rgba(var(--main-bg-color-rgb), 0.05)"
                        />
                      </div>
                      <div className={styles.max}>Provide of maxmium supply of editions</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {nftType === 'audio' && (
            <>
              <div className={`${styles.subTitle} mt-20`}>
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
                  maxSize={31457280}
                >
                  {({ getRootProps, getInputProps }) => (
                    <section className={nftType === 'audio' ? styles.dropzone : styles.dropzone}>
                      <div {...getRootProps()} className={styles.selectArea}>
                        <input {...getInputProps()} />
                        <p className={styles.uploadText}>Upload Here</p>
                        <p className={styles.text}>Supported File Formats .png .jpeg</p>
                        <p className={styles.greenText}>Max File Size 30mb</p>
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
              maxSize={31457280}
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
                    <p className={styles.greenText}>Max File Size 30mb</p>
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
          {type !== 0 && (
            <div className="mt-[38px]">
              <div className={styles.subTitle}>
                Edition type <span>*</span>
              </div>
              <div className={styles.editionDescription}>Editions are created on-demand</div>
              <SwipRadio
                data={EditionList}
                selected={edition}
                onChange={item => {
                  setEdition(item)
                  setEditionType(item)
                }}
              />
              {edition['id'] === 0 && (
                <div className="mt-[36px]">
                  <div className={styles.maxSupplyTitle}>
                    Max Supply <span>*</span>
                  </div>
                  <div className={styles.editionDescription}>The max number of copies that will be created</div>
                  <div className="flex flex-wrap gap-[20px] justify-between mt-[16px] lg:mt-[25px]">
                    {MaxNumberList.map((item, index) => (
                      <div
                        key={index}
                        className={`${maxNum.id === item.id ? styles.selectSupply : styles.noneSupply}`}
                        onClick={() => {
                          setMaxNum(item)
                          setMaxSupply(item.value)
                        }}
                      >
                        {item.label}
                      </div>
                    ))}
                  </div>
                  {/* <div className="flex flex-row justify-between max-w-[450px]">
                    <Radio
                      data={MaxNumberList}
                      selected={maxNum}
                      onChange={item => {
                        setMaxNum(item)
                        setMaxSupply(item.value)
                      }}
                    />
                  </div> */}
                  {maxNum['id'] === 3 && (
                    <div className="max-w-[450px] mt-[40px]">
                      <div className={styles.maxTitle}>
                        Custom Supply <span>*</span>
                      </div>
                      <div className="mt-[15px]">
                        <Input
                          onChange={value => {
                            setMaxSupply(value)
                          }}
                          backgroundColor="rgba(var(--main-bg-color-rgb), 0.05)"
                        />
                      </div>
                      <span className={styles.max}>Provide of maxmium supply of editions</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {nftType === 'audio' && (
            <>
              <div className={`${styles.subTitle} mt-10`}>
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
                  maxSize={31457280}
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
                        <p className={styles.greenText}>Max File Size 30mb</p>
                      </div>
                    </section>
                  )}
                </Dropzone>
              </div>
            </>
          )}

          <div className="w-full">
            <div className={`${styles.mobileSubTitle} mt-[30px]`}>
              NFT Name <span>*</span>
            </div>
            <div className="max-w-[370px] w-full mt-4">
              <Input
                value={limit(nftName, 32)}
                placeholder="Give your art name"
                color={'var(--text-gray-200-color)'}
                backgroundColor={'var(--shipping-board-bg)'}
                label01="Max Characters 32"
                label02={32 - nftName?.length === 32 ? '' : `${32 - nftName?.length} Characters left`}
                onChange={value => setNftName(limit(value, 32))}
              />
            </div>
            <div className={`${styles.mobileSubTitle} mt-[30px]`}>
              Description <span>*</span>
            </div>
            <div className="w-full mt-5">
              <Textarea
                value={limit(description, 1000)}
                height={150}
                placeholder="Add a short description..."
                color={'var(--text-gray-200-color)'}
                backgroundColor={'var(--shipping-board-bg)'}
                label01="Max Characters 1000"
                label02={1000 - description.length === 1000 ? '' : `${1000 - description.length} Characters left`}
                onChange={value => setDescription(value)}
              />
            </div>
            <div className="w-full mt-4">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-1">
                  <div className={styles.chooseCategory} onClick={() => setShowCategoryList(true)}>
                    Category (optional)
                  </div>
                </div>
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
