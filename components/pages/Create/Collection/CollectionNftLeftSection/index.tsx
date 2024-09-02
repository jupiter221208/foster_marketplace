import React, { useMemo } from 'react'

// next components
import Image from 'next/image'

// third party
import Dropzone from 'react-dropzone'

// components
import IconButtonWithSVG from 'components/Button/IconButtonWithSVG'

// resources
import EditorGreenIcon from 'assets/icons/editor-green.svg?component'

// styles
import styles from './index.module.scss'

// solana

const CollectionNftLeftSection = props => {
  const {
    bannerCroppedImage,
    setEnableImageDialog,
    onChangeBannerImage,
    coverCroppedImage,
    setEnableCoverImageDialog,
    onChangeCoverImage,
    handleShowAlert,
    setShowEAModal,
  } = props

  return (
    <div className={styles.container}>
      <div className="w-full">
        <div className={styles.collectionBannerImage}>
          Collection Banner Image<span>*</span>
        </div>
        <div className="w-full mt-[9px] lg:w-[550px] lg:mt-[15px]">
          <div className={styles.bannerImageArea}>
            {bannerCroppedImage === undefined ? (
              <Dropzone
                onDrop={acceptedFiles => {
                  if (acceptedFiles.length !== 0) {
                    setEnableImageDialog(true)
                    onChangeBannerImage(acceptedFiles)
                  } else handleShowAlert('banner', 'unknown')
                }}
                onDropRejected={rejectedFiles => {
                  handleShowAlert('banner', rejectedFiles[0]?.errors[0]?.code)
                }}
                maxFiles={1}
                accept={{ 'image/jpeg': [], 'image/png': [], 'image/gif': [] }}
                maxSize={10485760}
              >
                {({ getRootProps, getInputProps, open }) => (
                  <section className={styles.dropzone}>
                    <div {...getRootProps()} className={styles.selectBannerArea}>
                      <input {...getInputProps()} />
                      <p className={styles.uploadText}>Upload File</p>
                      <p className={styles.text}>
                        Supported File Formats
                        <br />
                        .png and .jpeg
                      </p>
                      <p className={styles.greenText}>Max File Size 10mb</p>
                    </div>
                  </section>
                )}
              </Dropzone>
            ) : (
              <div>
                <Image
                  src={bannerCroppedImage}
                  width={550}
                  height={158}
                  alt=""
                  objectFit="cover"
                  className="rounded-[10px] overflow-hidden"
                />
                <div className="absolute bottom-2 right-[10px] z-[1000]">
                  <Dropzone
                    onDrop={acceptedFiles => {
                      if (acceptedFiles.length !== 0) {
                        setEnableImageDialog(true)
                        onChangeBannerImage(acceptedFiles)
                      } else handleShowAlert('banner', 'unknown')
                    }}
                    onDropRejected={rejectedFiles => {
                      handleShowAlert('banner', rejectedFiles[0]?.errors[0]?.code)
                    }}
                    maxFiles={1}
                    accept={{ 'image/jpeg': [], 'image/png': [], 'image/gif': [] }}
                    maxSize={104857600}
                  >
                    {({ getRootProps, getInputProps, open }) => (
                      <section>
                        <button onClick={open} style={{ display: 'none' }}>
                          open
                        </button>
                        <div {...getRootProps()}>
                          <input {...getInputProps()} />
                          <div className={styles.iconBlurView}>
                            <div className="w-full h-full flex justify-center items-center">
                              <IconButtonWithSVG
                                width={40}
                                height={40}
                                iconWidth={40}
                                iconHeight={40}
                                icon={<EditorGreenIcon />}
                                onClick={() => {}}
                                backgroundColor="transparent"
                                borderColor="transparent"
                                borderRadius="100%"
                              />
                            </div>
                          </div>
                        </div>
                      </section>
                    )}
                  </Dropzone>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="relative mt-[30px] lg:mt-[34px]">
          <div className={styles.collectionBannerImage}>
            Collection Cover Image<span>*</span>
          </div>
          <div className="w-full flex justify-start z-0 mt-[9px] lg:mt-[15px]">
            <div className={styles.coverImageArea}>
              {coverCroppedImage === undefined ? (
                <Dropzone
                  onDropAccepted={acceptedFiles => {
                    if (acceptedFiles.length !== 0) {
                      setEnableCoverImageDialog(true)
                      onChangeCoverImage(acceptedFiles)
                    } else handleShowAlert('cover', 'unknown')
                  }}
                  onDropRejected={rejectedFiles => {
                    handleShowAlert('cover', rejectedFiles[0]?.errors[0]?.code)
                  }}
                  maxFiles={1}
                  accept={{ 'image/jpeg': [], 'image/png': [], 'image/gif': [] }}
                  maxSize={10485760}
                >
                  {({ getRootProps, getInputProps, open }) => (
                    <section className={styles.dropzone}>
                      <div {...getRootProps()} className={styles.selectArea}>
                        <input {...getInputProps()} />
                        <p className={styles.uploadText}>Upload File</p>
                        <p className={styles.text}>
                          Supported File Formats
                          <br />
                          .png and .jpeg
                        </p>
                        <p className={styles.greenText}>Max File Size 10mb</p>
                      </div>
                    </section>
                  )}
                </Dropzone>
              ) : (
                <div>
                  <Image
                    src={coverCroppedImage}
                    width={304}
                    height={304}
                    alt=""
                    objectFit="cover"
                    className="rounded-[10px] overflow-hidden"
                  />
                  <div className="absolute bottom-2 right-[10px]">
                    <Dropzone
                      onDropAccepted={acceptedFiles => {
                        if (acceptedFiles.length !== 0) {
                          setEnableCoverImageDialog(true)
                          onChangeCoverImage(acceptedFiles)
                        } else handleShowAlert('cover', 'unknown')
                      }}
                      onDropRejected={rejectedFiles => {
                        handleShowAlert('cover', rejectedFiles[0]?.errors[0]?.code)
                      }}
                      maxFiles={1}
                      accept={{ 'image/jpeg': [], 'image/png': [], 'image/gif': [] }}
                      maxSize={10485760}
                    >
                      {({ getRootProps, getInputProps, open }) => (
                        <section>
                          <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <div className={styles.iconBlurView}>
                              <div className="w-full h-full flex justify-center items-center">
                                <IconButtonWithSVG
                                  width={40}
                                  height={40}
                                  iconWidth={40}
                                  iconHeight={40}
                                  icon={<EditorGreenIcon />}
                                  onClick={() => {}}
                                  backgroundColor="rgba(var(--background-main-color-rgb), 0.75)"
                                  borderColor="transparent"
                                  borderRadius="100%"
                                />
                              </div>
                            </div>
                          </div>
                        </section>
                      )}
                    </Dropzone>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div
            className={styles.exchangeArt}
            onClick={() => {
              setShowEAModal(true)
            }}
          >
            Or, <span>import your series from Exchange Art</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollectionNftLeftSection
