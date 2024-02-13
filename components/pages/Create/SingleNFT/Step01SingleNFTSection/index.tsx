import React, { useState } from 'react'

// next components

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

type File = { type: string; path: string }

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
          <div className={`${styles.subTitle} mt-10`}>
            Art <span>*</span>
          </div>
          <div className="mt-5">
            <Dropzone
              onDropAccepted={acceptedFiles => {
                let newFile = undefined
                if (acceptedFiles[0].type === '' && /\.glb$/.test((acceptedFiles[0] as unknown as File).path)) {
                  // Assuming 'oldFile' is the existing File object
                  const oldFile = acceptedFiles[0]

                  // Read the old file as ArrayBuffer
                  const reader = new FileReader()
                  reader.onload = function (event) {
                    // Create a new File object with the old file's data but a new MIME type
                    const file = new File([event.target.result], oldFile.name, { type: 'model/gltf-binary' })
                    newFile = [file]
                    // Now 'newFile' is a File object with the same data as 'oldFile' but a MIME type of 'model/gltf-binary'

                    // Use newFile here
                    acceptedFiles.length !== 0
                      ? setNftArt(newFile ? newFile : acceptedFiles)
                      : handleShowAlert('nft', 'unknown')
                  }
                  reader.readAsArrayBuffer(oldFile)
                } else {
                  // Handle the case where the file type is not '' and does not end with .glb
                  acceptedFiles.length !== 0 ? setNftArt(acceptedFiles) : handleShowAlert('nft', 'unknown')
                }
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
          {/* <div className="mt-[20px] h-[54px] flex items-center">
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
          </div> */}
          {nftType === 'audio' && (
            <>
              <div className={`${styles.subTitle} mt-20`}>
                Audio Cover <span>*</span>
              </div>
              <div className="mt-5">
                <Dropzone
                  onDropAccepted={acceptedFiles => {
                    let newFile = undefined
                    if (acceptedFiles[0].type === '' && /\.glb$/.test((acceptedFiles[0] as unknown as File).path)) {
                      // Assuming 'oldFile' is the existing File object
                      const oldFile = acceptedFiles[0]

                      // Read the old file as ArrayBuffer
                      const reader = new FileReader()
                      reader.onload = function (event) {
                        // Create a new File object with the old file's data but a new MIME type
                        const file = new File([event.target.result], oldFile.name, { type: 'model/gltf-binary' })
                        newFile = [file]
                        // Now 'newFile' is a File object with the same data as 'oldFile' but a MIME type of 'model/gltf-binary'

                        // Use newFile here
                        acceptedFiles.length !== 0
                          ? setNftArt(newFile ? newFile : acceptedFiles)
                          : handleShowAlert('audio', 'unknown')
                      }
                      reader.readAsArrayBuffer(oldFile)
                    } else {
                      // Handle the case where the file type is not '' and does not end with .glb
                      acceptedFiles.length !== 0 ? setNftCover(acceptedFiles) : handleShowAlert('audio', 'unknown')
                    }
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
            {/* <div className="mt-[12px] h-[30px] flex items-center">
              <div
                className="w-[25px] flex justify-center items-center cursor-pointer"
                onClick={() => {
                  setInfoFocus(true)
                  setTimeout(() => {
                    setInfoFocus(false)
                  }, 2000)
                }}
              >
                {infoFocus ? <InfoGreenIcon /> : <InfoGrayIcon />}
              </div>
              {infoFocus && (
                <div className={styles.infoText}>You can add your artwork to an existing collection on step 3</div>
              )}
            </div> */}
          </div>
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
