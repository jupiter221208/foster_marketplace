import React, { Fragment, useEffect, useRef, useState } from 'react'

// third party components
import { useSelector, useDispatch } from 'react-redux'
import { Dialog, Transition } from '@headlessui/react'

// next components
import Image from 'next/image'

// components
import Input from 'components/Input'
import OutlineButton from 'components/Button/OutlineButton'
import GradientButton from 'components/Button/GradientButton'
import NftImageEditorModal from 'components/Modal/NftImageEditorModal'

// custom functions
import { useViewport, namePublicFile } from 'utils'

// images
import LogoBigIcon from 'assets/logo-big.svg'
import ConnectLogo from 'assets/images/profile_setup_logo.png'
import DefaultAvatar from 'assets/images/dashboard-avatar.png'
import CameraIcon from 'assets/icons/camera-white.svg'

// styles
import styles from './index.module.scss'
import IconButton from 'components/Button/IconButton'

import { useWallet } from '@solana/wallet-adapter-react'

// call apis
import userAPI from 'apis/user'
import uploadFileToS3API from 'apis/aws'
import Alert from 'components/Alert'

const ProfileSetupModal = () => {
  const profileSetup: boolean = useSelector((state: any) => state.profileSetup)
  const viewport = useViewport()

  const dispatch = useDispatch()

  const [displayName, setDisplayName] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [openNftImageEditorModal, setOpenNftImageEditorModal] = useState(false)
  const [updateImage, setUpdateImage] = useState(false)
  const [uploadingToS3, setUploadingToS3] = useState<boolean>(false)
  const [profilePictureUrl, setProfilePictureUrl] = useState('')
  const [croppedAvatar, setCroppedAvatar] = useState('')
  const [avatar, setAvatar] = useState<any>()
  const inputFile = useRef<any>(null)
  const [showAlert, setShowAlert] = useState(false)
  const [alertData, setAlertData] = useState<any[]>([])

  const { publicKey } = useWallet()

  const handleChangeAvatar = event => {
    const file = event.target.files

    if (file?.length === 0) return

    if (file[0].type.includes('audio') || file[0].type.includes('video')) {
      setAlertData([
        {
          id: 0,
          title: 'File Format Not Supported',
          description: `Supported file formats for profile image include .png and .jpeg`,
          type: 'error',
        },
      ])
      setShowAlert(true)
      return
    }
    if (file[0].size > 31457280) {
      setAlertData([
        {
          id: 0,
          title: 'Max File Size Exceeded',
          description: `Oops! It looks like your file exceeded the max file size of 30mb`,
          type: 'error',
        },
      ])
      setShowAlert(true)
      return
    }
    setAvatar(file)
    setOpenNftImageEditorModal(true)
  }

  useEffect(() => {
    if (croppedAvatar !== '' && updateImage) {
      const fetchData = async url => {
        let response = await fetch(url)
        let blob = await response.blob()
        const file = new File([blob], 'avatar.jpg', {
          type: 'image/jpeg',
        })
        const filename = namePublicFile('avatar.jpg')
        uploadFile(file, filename)
      }
      fetchData(croppedAvatar)
      setUpdateImage(false)
    }
  }, [updateImage])

  const uploadFile = async (file: any, filename: string) => {
    setUploadingToS3(true)
    const { data, url } = await uploadFileToS3API(file, filename)
    setProfilePictureUrl(url + filename)
    setUploadingToS3(false)
  }

  const closeModal = () => {
    dispatch({ type: 'set', profileSetup: !profileSetup })
  }

  const handleSaveUsermame = async () => {
    if (uploadingToS3) return
    if (displayName.length === 0) {
      setErrorMessage("The display name can't be empty.")
      return
    }
    let validate_check = await userAPI.validateUsername({ username: displayName })
    if (!validate_check) {
      setErrorMessage('This display name is already taken.')
      return
    }

    userAPI
      .update({ wallet_id: publicKey?.toBase58() || '', username: displayName, profile_picture: profilePictureUrl })
      .then(
        response => {
          if (response !== null) {
            dispatch({ type: 'set', profileInfo: response })
          }
          closeModal()
        },
        error => {
          console.log(error)
        }
      )
  }

  return (
    <div>
      <Alert
        open={showAlert}
        close={() => {
          setShowAlert(false)
        }}
        data={alertData}
      />
      {openNftImageEditorModal ? (
        <NftImageEditorModal
          style={{ zIndex: 100001 }}
          open={openNftImageEditorModal}
          close={() => setOpenNftImageEditorModal(false)}
          nftImage={avatar}
          getCroppedImage={croppedImage => {
            setUpdateImage(true)
            setCroppedAvatar(croppedImage)
            setOpenNftImageEditorModal(false)
          }}
          dimension={{ value: [1080, 1080] }}
        />
      ) : (
        <Transition show={profileSetup} as={Fragment}>
          <Dialog as="div" className={styles.container} onClose={() => closeModal()}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className={styles.bgView} />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className={styles.modalView}>
                    {/* <div className={styles.close} onClick={() => closeModal()}>
                      <Image src={CloseIcon} alt="" width={30} height={30} />
                    </div> */}
                    <div className={styles.rightBack}>
                      <Image src={LogoBigIcon} alt="" width={566} height={657} />
                    </div>
                    <div className="w-full h-full grid grid-cols-12 z-10">
                      <div className="col-span-12 lg:col-span-7 z-10">
                        <div className={styles.leftPanel}>
                          <div className={styles.title}>Welcome to Foster Marketplace!</div>
                          <p className={styles.text}>
                            {
                              'You can edit your display name and profile image now or at a later time from your dashboard.'
                            }
                          </p>
                          <div className="mt-[16px]">
                            <div className={styles.displayName}>Display Name</div>
                            <Input
                              error={errorMessage}
                              placeholder="Choose your display name"
                              backgroundColor="#202427"
                              fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 14 : 16}
                              onChange={(value: string) => {
                                if (errorMessage.length > 0) setErrorMessage('')
                                setDisplayName(value)
                              }}
                              value={displayName}
                            />
                          </div>
                          <div className="w-full flex justify-center mt-[41px]">
                            <div className={styles.avatarArea}>
                              <img
                                src={
                                  croppedAvatar !== ''
                                    ? croppedAvatar
                                    : avatar !== undefined
                                    ? avatar.src
                                    : DefaultAvatar.src
                                }
                                width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 90 : 152}
                                height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 90 : 152}
                                alt=""
                                className="object-cover rounded-full"
                              />
                              <div className={styles.cameraArea}>
                                <IconButton
                                  icon={CameraIcon}
                                  onClick={() => inputFile?.current?.click()}
                                  backgroundColor="transparent"
                                />
                                <input
                                  type="file"
                                  id="file"
                                  accept="image/png, image/jpeg"
                                  ref={inputFile}
                                  style={{ display: 'none' }}
                                  onChange={event => handleChangeAvatar(event)}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="w-full flex justify-center mt-[37px] px-7 lg:px-0 pb-6 lg:pb-9">
                            <div className="w-full max-w-[351px] flex justify-between gap-10 lg:gap-[96px]">
                              <OutlineButton label="Skip" fullWidth onClick={() => closeModal()} />
                              <GradientButton
                                label="Save"
                                fullWidth
                                onClick={() => handleSaveUsermame()}
                                gradientDirection="right"
                                backgroundColor01="#377771"
                                backgroundColor02="#5AC3BA"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-0 lg:col-span-5 relative rounded-[24px]">
                        <div className={styles.rightPanel}>
                          <div className="w-[348px] min-w-[348px]">
                            <Image src={ConnectLogo} alt="" width={348} height={348} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
    </div>
  )
}

export default ProfileSetupModal
