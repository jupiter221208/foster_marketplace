import React, { useEffect, useState, useRef } from 'react'

import { useAuthentication } from 'hooks/useAuthentication'

// next components

// custom components
import Input from 'components/Input'
import Textarea from 'components/Input/Textarea'
import GradientButton from 'components/Button/GradientButton'
import UploadGreenIcon from 'assets/icons/upload-green-24x24.svg?component'
import TrashBin from 'assets/icons/trash-bin.svg?component'
import uploadFileToS3 from 'apis/aws'

// custom functions
import { useViewport } from 'utils'

// images and icons

// styles
import styles from './index.module.scss'
import Dropzone from 'react-dropzone'
import Alert from 'components/Alert'

// call apis
import merchAPI from 'apis/merch'
import LoadingButton from 'components/Button/LoadingButton'

const StudioSection = prop => {
  const { success } = prop
  const { profileInfo } = useAuthentication()

  const viewport = useViewport()
  const dropzoneNftEl = useRef(null)

  const [title, setTitle] = useState('')
  const [note, setNote] = useState('')
  const [assetUrl, setAssetUrl] = useState('')
  const [assetType, setAssetType] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [nftArt, setNftArt] = useState(null)
  const [alertData, setAlertData] = useState<any[]>([])
  const [showAlert, setShowAlert] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isStored, setIsStored] = useState(false)

  useEffect(() => {
    if (profileInfo && !isStored) {
      let userId = profileInfo.id
      getStoreInfo(userId)
    }
  }, [profileInfo])

  const getStoreInfo = async userId => {
    merchAPI.getStoreInfo(userId).then(
      response => {
        if (response.message === undefined || response.message === null) {
          setIsStored(true)
          setTitle(response.name)
          setNote(response.description)
          setAssetUrl(response.assetUrl)
          setAssetType(response.assetType)
        }
      },
      error => {}
    )
  }

  const handleSaveUserInfo = async () => {
    if (!profileInfo) return

    setIsSaving(true)
    let userId = profileInfo.id

    let url = '',
      type = ''
    if (assetUrl.length > 0) {
      url = assetUrl
      type = assetType
    } else {
      url = await uploadRawUrl(
        'store_' + userId + '_' + title,
        URL.createObjectURL(nftArt),
        nftArt.type,
        getFileTypeExt(nftArt)
      )
      type = nftArt.type
    }
    let params = {
      userId,
      name: title,
      description: note,
      assetUrl: url,
      assetType: type,
    }

    if (isStored) {
      merchAPI.updateStoreInfo(userId, params).then(
        response => {
          setIsSaving(false)
          setAssetUrl(url)
          setAssetType(params.assetType)
          setAlertData([
            {
              id: 0,
              title: 'Updated successfully',
              description: 'Store Information is updated',
              type: 'success',
            },
          ])
          setShowAlert(true)
        },
        error => {}
      )
    } else {
      merchAPI.createStoreInfo(userId, params).then(
        response => {
          setIsSaving(false)
          setAssetUrl(url)
          setAssetType(params.assetType)
          setAlertData([
            {
              id: 0,
              title: 'Saved successfully',
              description: 'Store Information is saved',
              type: 'success',
            },
          ])
          setShowAlert(true)
        },
        error => {}
      )
    }
  }

  const getFileTypeCategory = file => {
    return file.type.split('/')[0]
  }

  const getFileTypeExt = file => {
    return file.type.split('/')[1]
  }

  const uploadRawUrl = async (name: string, imageFile: string, fileType: string, fileExt: string) => {
    let response = await fetch(imageFile)
    let blob = await response.blob()
    const file = new File([blob], 'store.' + fileExt, {
      type: fileType,
    })
    let timestamp = new Date().getTime()
    let filename = name.replaceAll(' ', '') + timestamp
    const { url } = await uploadFileToS3(file, filename)
    return url
  }

  const handleShowAlert = error => {
    if (error === 'file-invalid-type') {
      let description = ''
      description = `Supported file formats .png, .jpeg`
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
          description: `Oops! It looks like your file exceeded the max file size of 2mb`,
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
    <div className={styles.container}>
      <div className="w-full flex justify-start">
        <div className={styles.content}>
          <div className={styles.innercontent}>
            <div>
              <div className={styles.subTitle}>Social Preview</div>
              <div className={styles.subDesc}>
                Make your merch store yours. Name it, describe it, and show it off with a preview image that speaks your
                brand’s language.
              </div>
            </div>

            <div className="mt-[30px] lg:mt-[30px]">
              <Input
                error={errorMessage}
                value={title}
                fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '14px' : '16px'}
                color="var(--text-gray-200-color)"
                borderColor="rgba(var(--main-bg-color-rgb), 0.1)"
                borderRadius="10px"
                placeholder="Store Name"
                onChange={value => {
                  if (errorMessage.length > 0) setErrorMessage('')
                  setTitle(value)
                }}
              />
            </div>
            <div className="mt-[10px] lg:mt-[15px] h-fit">
              <Textarea
                value={note}
                fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '14px' : '16px'}
                color="var(--text-gray-200-color)"
                borderRadius="10px"
                placeholder="Store Description"
                width="100%"
                height="100px"
                label01="Max Characters 1000"
                label02={1000 - note?.length === 1000 ? '' : `${1000 - note?.length} Characters left`}
                onChange={value => setNote(value)}
              />
            </div>

            <div className="mt-[10px] lg:mt-[15px]">
              {assetUrl.length > 0 ? (
                <div className={styles.artArea}>
                  {assetType.includes('video') ? (
                    <video controls className="w-full h-full z-10" id="video">
                      <source src={assetUrl} type={assetType} />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img src={assetUrl} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute right-[20px] bottom-[20px] z-100" onClick={() => setAssetUrl('')}>
                    <TrashBin />
                  </div>
                </div>
              ) : nftArt === null ? (
                <Dropzone
                  onDropAccepted={acceptedFiles => {
                    acceptedFiles.length !== 0 ? setNftArt(acceptedFiles[0]) : handleShowAlert('unknown')
                  }}
                  onDropRejected={rejectedFiles => {
                    handleShowAlert(rejectedFiles[0]?.errors[0]?.code)
                  }}
                  accept={{
                    'image/jpeg': [],
                    'image/png': [],
                    'image/gif': [],
                  }}
                  maxFiles={1}
                  maxSize={2097152}
                >
                  {({ getRootProps, getInputProps, open }) => (
                    <section className={styles.dropzone}>
                      <button onClick={open} ref={dropzoneNftEl} style={{ display: 'none' }}>
                        open
                      </button>
                      <div {...getRootProps()} className={styles.selectArea}>
                        <input {...getInputProps()} />
                        <UploadGreenIcon alt="" />
                        <p className={styles.uploadTitle}>Upload Here</p>
                        <p className={styles.text}>Recommended Dimensions: 1920 x 960</p>
                        <p className={styles.greenText}>Max File Size 2mb</p>
                      </div>
                    </section>
                  )}
                </Dropzone>
              ) : (
                <div className={styles.artArea}>
                  {getFileTypeCategory(nftArt) === 'video' ? (
                    <video controls className="w-full h-full z-10" id="video">
                      <source src={URL.createObjectURL(nftArt)} type={nftArt.type} />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img src={URL.createObjectURL(nftArt)} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute right-[20px] bottom-[20px] z-100" onClick={() => setNftArt(null)}>
                    <TrashBin />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-[30px] lg:mt-[30px] mb-[100px] lg:mb-[158px] w-full flex justify-center lg:justify-end items-center gap-6">
              {isSaving ? (
                <LoadingButton
                  fullWidth
                  width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '50%' : ''}
                  height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '44px' : '52px'}
                  fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '16px' : '18px'}
                  paddingLeft={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '' : '40px'}
                  paddingRight={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '' : '40px'}
                />
              ) : title.length > 0 && note.length > 0 && (assetUrl.length > 0 || nftArt !== null) ? (
                <GradientButton
                  label={isStored ? 'Update' : 'Save'}
                  fullWidth
                  onClick={() => {
                    handleSaveUserInfo()
                  }}
                  width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '50%' : ''}
                  height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '44px' : '52px'}
                  fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '16px' : '18px'}
                  paddingLeft={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '' : '40px'}
                  paddingRight={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '' : '40px'}
                />
              ) : (
                <GradientButton
                  label={isStored ? 'Update' : 'Save'}
                  fullWidth
                  disabled={true}
                  onClick={() => {}}
                  width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '50%' : ''}
                  height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '44px' : '52px'}
                  fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '16px' : '18px'}
                  paddingLeft={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '' : '40px'}
                  paddingRight={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '' : '40px'}
                />
              )}
            </div>
          </div>
        </div>
      </div>
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

export default StudioSection
