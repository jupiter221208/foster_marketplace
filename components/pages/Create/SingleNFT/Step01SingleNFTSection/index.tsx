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
import UploadGreenIcon from 'assets/icons/upload-green-24x24.svg'

// styles
import styles from './index.module.scss'

const Step01SingleNFTSection = props => {
  const { nftType, setNftArt, setNftCover } = props

  const viewport = useViewport()

  const [showAlert, setShowAlert] = useState(false)
  const [alertData, setAlertData] = useState<any[]>([])

  const handleShowAlert = () => {
    setAlertData([
      {
        id: 0,
        title: 'Max File Size Exceeded',
        description: `Oops! It looks like your file exceeded the max file size of 30mb`,
        type: 'error',
      },
    ])
    setShowAlert(true)
  }

  return (
    <div className="w-full">
      {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
        <div className="w-full">
          <div className={`${styles.subTitle} mt-20`}>Art *</div>
          <div className="mt-5">
            <Dropzone
              onDrop={acceptedFiles => {
                acceptedFiles.length !== 0 ? setNftArt(acceptedFiles) : handleShowAlert()
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
          {nftType === 'audio' && (
            <>
              <div className={`${styles.subTitle} mt-10`}>Audio Cover *</div>
              <div className="mt-5">
                <Dropzone
                  onDrop={acceptedFiles => {
                    acceptedFiles.length !== 0 ? setNftCover(acceptedFiles) : handleShowAlert()
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
              onDrop={acceptedFiles => {
                acceptedFiles.length !== 0 ? setNftArt(acceptedFiles) : handleShowAlert()
              }}
              maxFiles={1}
              maxSize={31457280}
            >
              {({ getRootProps, getInputProps }) => (
                <section className={styles.dropzone}>
                  <div {...getRootProps()} className={styles.selectArea}>
                    <input {...getInputProps()} />
                    <Image src={UploadGreenIcon} alt="" />
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
          </div>
          {nftType === 'audio' && (
            <>
              <div className={`${styles.subTitle} mt-10`}>Audio Cover *</div>
              <div className="mt-5">
                <Dropzone
                  onDrop={acceptedFiles => {
                    acceptedFiles.length !== 0 ? setNftCover(acceptedFiles) : handleShowAlert()
                  }}
                  maxFiles={1}
                  accept={{ 'image/jpeg': [], 'image/png': [], 'image/gif': [] }}
                  maxSize={31457280}
                >
                  {({ getRootProps, getInputProps }) => (
                    <section className={nftType === 'audio' ? styles.mediaDropzone : styles.dropzone}>
                      <div {...getRootProps()} className={styles.selectArea}>
                        <input {...getInputProps()} />
                        <Image src={UploadGreenIcon} alt="" />
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
