import React, { useState } from 'react'

// next components
import Image from 'next/image'

// third party components
import Dropzone from 'react-dropzone'

// components
import Alert from 'components/Alert'

// custom functions
import { useViewport } from 'utils'

// images and icons
import UploadGreenIcon from 'assets/icons/upload-green-24x24.svg?component'

// styles
import styles from './index.module.scss'

// resources
import InfoGrayIcon from 'assets/icons/info-gray.svg?component'
import InfoGreenIcon from 'assets/icons/info-green.svg?component'

const Step01SingleNFTSection = props => {
  const { nftType, setNftArt, setNftCover } = props

  const viewport = useViewport()

  const [showAlert, setShowAlert] = useState(false)
  const [alertData, setAlertData] = useState<any[]>([])
  const [infoFocus, setInfoFocus] = useState(false)

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
          <div className={`${styles.subTitle} mt-20`}>Art *</div>
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
              }}
              maxFiles={1}
              maxSize={31457280}
            >
              {({ getRootProps, getInputProps }) => (
                <section className={styles.dropzone}>
                  <div {...getRootProps()} className={styles.selectArea}>
                    <input {...getInputProps()} />
                    <p className={styles.subTitle}>Upload Here</p>
                    <p className={styles.text}>Supported File Formats .png .jpeg .mp4 .mp3 and .gif</p>
                    <p className={styles.greenText}>Max File Size 30mb</p>
                  </div>
                </section>
              )}
            </Dropzone>
          </div>
          <div className="mt-[20px] h-[54px] flex items-center">
            <div
              className="h-[54px] flex justify-center items-center cursor-pointer"
              onMouseEnter={() => setInfoFocus(true)}
              onMouseLeave={() => setInfoFocus(false)}
            >
              {infoFocus ? <InfoGreenIcon /> : <InfoGrayIcon />}
            </div>
            {infoFocus && (
              <div className={styles.infoText}>You can add your artwork to an existing collection on step 3</div>
            )}
          </div>
          {nftType === 'audio' && (
            <>
              <div className={`${styles.subTitle} mt-10`}>Audio Cover *</div>
              <div className="mt-5">
                <Dropzone
                  onDropAccepted={acceptedFiles => {
                    acceptedFiles.length !== 0 ? setNftCover(acceptedFiles) : handleShowAlert('audio', 'unknown')
                  }}
                  onDropRejected={rejectedFiles => {
                    handleShowAlert('audio', rejectedFiles[0]?.errors[0]?.code)
                  }}
                  maxFiles={1}
                  accept={{ 'image/jpeg': [], 'image/png': [], 'image/gif': [] }}
                  maxSize={31457280}
                >
                  {({ getRootProps, getInputProps }) => (
                    <section className={nftType === 'audio' ? styles.mediaDropzone : styles.dropzone}>
                      <div {...getRootProps()} className={styles.selectArea}>
                        <input {...getInputProps()} />
                        <p className={styles.subTitle}>Upload Here</p>
                        <p className={styles.text}>Supported File Formats .png .jpeg and .gif</p>
                        <p className={styles.greenText}>Max File Size 30mb</p>
                      </div>
                    </section>
                  )}
                </Dropzone>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="w-full">
          {nftType === 'audio' && <div className={`${styles.subTitle} mt-20`}>Art *</div>}
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
              }}
              maxFiles={1}
              maxSize={31457280}
            >
              {({ getRootProps, getInputProps }) => (
                <section className={styles.dropzone}>
                  <div {...getRootProps()} className={styles.selectArea}>
                    <input {...getInputProps()} />
                    <UploadGreenIcon alt="" />
                    <p className={styles.subTitle}>Upload Here</p>
                    <p className={styles.text}>
                      Supported File Formats
                      <br />
                      .png .jpeg .mp4 and .gif
                    </p>
                    <p className={styles.greenText}>Max File Size 30mb</p>
                  </div>
                </section>
              )}
            </Dropzone>
            <div className="mt-[12px] h-[30px] flex items-center">
              <div
                className="w-[25px] flex justify-center items-center cursor-pointer"
                onClick={() => {
                  setInfoFocus(true)
                  setTimeout(() => {
                    setInfoFocus(false)
                  }, 2000)
                }}
              >
                {/* <Image src={infoFocus ? InfoGreenIcon : InfoGrayIcon} alt="" /> */}
                {infoFocus ? <InfoGreenIcon /> : <InfoGrayIcon />}
              </div>
              {infoFocus && (
                <div className={styles.infoText}>You can add your artwork to an existing collection on step 3</div>
              )}
            </div>
          </div>
          {nftType === 'audio' && (
            <>
              <div className={`${styles.subTitle} mt-10`}>Audio Cover *</div>
              <div className="mt-5">
                <Dropzone
                  onDropAccepted={acceptedFiles => {
                    acceptedFiles.length !== 0 ? setNftCover(acceptedFiles) : handleShowAlert('audio', 'unknown')
                  }}
                  onDropRejected={rejectedFiles => {
                    handleShowAlert('audio', rejectedFiles[0]?.errors[0]?.code)
                  }}
                  maxFiles={1}
                  accept={{ 'image/jpeg': [], 'image/png': [], 'image/gif': [] }}
                  maxSize={31457280}
                >
                  {({ getRootProps, getInputProps }) => (
                    <section className={nftType === 'audio' ? styles.mediaDropzone : styles.dropzone}>
                      <div {...getRootProps()} className={styles.selectArea}>
                        <input {...getInputProps()} />
                        <UploadGreenIcon alt="" />
                        <p className={styles.subTitle}>Upload Here</p>
                        <p className={styles.text}>
                          Supported File Formats
                          <br />
                          .png .jpeg and .gif
                        </p>
                        <p className={styles.greenText}>Max File Size 30mb</p>
                      </div>
                    </section>
                  )}
                </Dropzone>
              </div>
            </>
          )}
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
