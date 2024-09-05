import React, { useState } from 'react'

// next components

// third party components
import Dropzone from 'react-dropzone'

// components
import Alert from 'components/Alert'
import NftImageEditorModal from 'components/Modal/NftImageEditorModal'
import Textarea from 'components/Input/Textarea'
import Input from 'components/Input'

// custom functions
import { useViewport } from 'utils'

// images and icons
import ImageIcon from 'assets/icons/image-icon.svg?component'
import ShareIcon from 'assets/icons/share-icon.svg?component'

// styles
import styles from './index.module.scss'

// resources
import { limit } from 'utils/strings'

const Step01SingleNFTSection = props => {
  const {
    nftType,
    nftImage,
    setNftImage,
    nftCover,
    setNftCover,
    setTakeSnapshotStatus,
    selectedDimension,
    nftName,
    setNftName,
    description,
    setDescription,
  } = props

  const viewport = useViewport()
  const [showDelete, setShowDelete] = useState(false)
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
        <div className="w-full pr-[20px]">
          <div className="w-full">
            <div className={`${styles.subTitle}`}>
              Name <span>*</span>
            </div>
            <div className="max-w-[370px] w-full mt-[15px]">
              <Input
                value={limit(nftName, 32)}
                placeholder="Give your art a name"
                fontFamily="Muli-Light"
                label01="Max Characters 32"
                label02={32 - nftName?.length === 32 ? '' : `${32 - nftName?.length} Characters left`}
                onChange={value => setNftName(limit(value, 32))}
              />
            </div>
            <div className={`${styles.subTitle} mt-[24px]`}>
              Description <span>*</span>
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
          </div>
          {nftType === 'audio' && (
            <>
              <div className={`${styles.subTitle} mt-[24px]`}>
                Audio Cover <span>*</span>
              </div>
              <div className={`${styles.description} mt-[15px]`}>Add a cover image for your audio file</div>
              <div className="mt-5 mt-[15px] mb-[30px]">
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
                    <section className={styles.audioDropzone}>
                      <div {...getRootProps()} className="flex gap-[15px]">
                        <input {...getInputProps()} />
                        <ShareIcon />
                        <div className={styles.audioText}>Upload Photo</div>
                      </div>
                    </section>
                  )}
                </Dropzone>
              </div>
            </>
          )}
          {nftType === 'vr' && (
            <div className="mt-[24px] mb-[30px]">
              <div className={styles.coverImgMsg}>
                Cover Photo <span>*</span>
              </div>
              <div className={styles.pick}>
                Pick the best angle to take a snapshot or upload an image to use as the cover photo.
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
                <div>
                  <div
                    className={styles.glbNftImageSection}
                    onMouseEnter={() => setShowDelete(true)}
                    onMouseLeave={() => setShowDelete(false)}
                  >
                    <img className="w-full aspect-square" src={nftImage} alt="" />
                    {showDelete && (
                      <div className={styles.deleteArea}>
                        <div
                          onClick={() => {
                            setShowDelete(false)
                            setNftImage('')
                          }}
                        >
                          Delete
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="w-full">
          <div className="mt-5">
            {nftType === 'vr' && (
              <>
                <div className={styles.coverImgMsg}>
                  <div className="my-1">
                    Cover Photo <span>*</span>
                  </div>

                  <div className={styles.pick}>
                    Pick the best angle to take a snapshot or upload an image to use as the cover photo.
                  </div>
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
                  <div>
                    <div
                      className={styles.glbNftImageSection}
                      onMouseEnter={() => setShowDelete(true)}
                      onMouseLeave={() => setShowDelete(false)}
                      onClick={() => setShowDelete(!showDelete)}
                    >
                      <img className="w-full aspect-square" src={nftImage} alt="" />
                      {showDelete && (
                        <div className={styles.deleteArea}>
                          <div
                            onClick={() => {
                              setShowDelete(false)
                              setNftImage('')
                            }}
                          >
                            Delete
                          </div>
                        </div>
                      )}
                    </div>
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
              <div className={`${styles.description} mt-[15px]`}>Add a cover image for your audio file</div>
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
                    <section className={styles.audioDropzone}>
                      <div {...getRootProps()} className="flex gap-[15px]">
                        <input {...getInputProps()} />
                        <ShareIcon />
                        <div className={styles.audioText}>Upload Photo</div>
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
                placeholder="Give your art a name"
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
