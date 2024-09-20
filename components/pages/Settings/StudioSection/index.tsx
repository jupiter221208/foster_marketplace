import React, { useEffect, useState, useRef } from 'react'

// next components

// custom components
import Input from 'components/Input'
import Textarea from 'components/Input/Textarea'
import GradientButton from 'components/Button/GradientButton'
import UploadGreenIcon from 'assets/icons/upload-green-24x24.svg?component'
import TrashBin from 'assets/icons/trash-bin.svg?component'

// custom functions
import { useViewport } from 'utils'

// images and icons

// styles
import styles from './index.module.scss'
import Dropzone from 'react-dropzone'

// call apis

const StudioSection = prop => {
  const { success } = prop
  const viewport = useViewport()
  const dropzoneNftEl = useRef(null)

  const [title, setTitle] = useState('')
  const [note, setNote] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [enableSave, setEnableSave] = useState(true)
  const [nftArt, setNftArt] = useState(null)

  const checkEnableSave = () => {}

  const handleSaveUserInfo = async () => {}

  useEffect(() => {
    checkEnableSave()
  }, [note])

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
              {nftArt === null ? (
                <Dropzone
                  onDropAccepted={acceptedFiles => {
                    acceptedFiles.length !== 0 && setNftArt(acceptedFiles[0])
                  }}
                  onDropRejected={rejectedFiles => {}}
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
                  <img src={URL.createObjectURL(nftArt)} className="w-full h-full object-cover" />
                  <div className="absolute right-[20px] bottom-[20px] z-100" onClick={() => setNftArt(null)}>
                    <TrashBin />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-[30px] lg:mt-[30px] mb-[100px] lg:mb-[158px] w-full flex justify-center lg:justify-end items-center gap-6">
              {enableSave ? (
                <GradientButton
                  label="Save"
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
                  label="Save"
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
    </div>
  )
}

export default StudioSection
