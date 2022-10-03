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

// custom functions
import { useViewport } from 'utils'

// images
import LogoBigIcon from 'assets/logo-big.svg'
import CloseIcon from 'assets/icons/close-wallet.svg'
import ConnectLogo from 'assets/images/connect_wallet_logo.png'
import Avatar from 'assets/images/dashboard-avatar.png'
import CameraIcon from 'assets/icons/camera-white.svg'

// styles
import styles from './index.module.scss'
import IconButton from 'components/Button/IconButton'

const ProfileSetupModal = props => {
  // const {open} =props
  const profileSetup: boolean = useSelector((state: any) => state.profileSetup)
  const viewport = useViewport()

  const dispatch = useDispatch()

  const [displayName, setDisplayName] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (displayName === '') {
      setErrorMessage('The display name you have entered is already taken')
    } else {
      setErrorMessage('')
    }
  }, [displayName])

  const inputFile = useRef<any>(null)
  const [avatar, setAvatar] = useState<any>(Avatar)

  const handleChangeAvatar = event => {
    setAvatar(URL.createObjectURL(event.target.files[0]))
  }

  const closeModal = () => {
    dispatch({ type: 'set', profileSetup: !profileSetup })
  }

  return (
    <Transition appear show={profileSetup} as={Fragment}>
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
                <div className="w-full h-full grid grid-cols-12">
                  <div className="col-span-7">
                    <div className={styles.leftPanel}>
                      <div className={styles.title}>Welcome to Foster Marketplace!</div>
                      <p className={styles.text}>
                        You can edit your display name and profile image now, or do so at a later time from your user
                        dashboard.
                      </p>
                      <div className="mt-[16px]">
                        <Input
                          label="Display Name"
                          error={errorMessage}
                          placeholder="User name"
                          onChange={(value: string) => setDisplayName(value)}
                          value={displayName}
                        />
                      </div>
                      <div className="relative w-full flex justify-center mt-[17px]">
                        <div className={styles.avatarArea}>
                          <Image
                            src={avatar}
                            width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 90 : 152}
                            height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 90 : 152}
                            alt=""
                            objectFit="cover"
                            className="rounded-full"
                          />
                          <div className="absolute bottom-0 right-2">
                            <IconButton
                              icon={CameraIcon}
                              onClick={() => inputFile?.current?.click()}
                              borderRadius="23px"
                              backgroundColor="#2C2E2E"
                            />
                            <input
                              type="file"
                              id="file"
                              ref={inputFile}
                              style={{ display: 'none' }}
                              onChange={event => handleChangeAvatar(event)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="w-full flex justify-center mt-[37px]">
                        <div className="w-full max-w-[351px] flex justify-between gap-[96px]">
                          <OutlineButton label="Skip" fullWidth onClick={() => closeModal()} />
                          <GradientButton
                            label="Save"
                            fullWidth
                            onClick={() => closeModal()}
                            gradientDirection="bottom"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-5 relative overflow-hidden rounded-[24px]">
                    <div className={styles.rightBack}>
                      <Image src={LogoBigIcon} alt="" width={566} height={657} />
                    </div>
                    <div className={styles.close} onClick={() => closeModal()}>
                      <Image src={CloseIcon} alt="" width={30} height={30} />
                    </div>
                    <div className={styles.rightPanel}>
                      <div className="flex justify-center">
                        <div className={styles.rightTitle}>Foster the Flavor</div>
                      </div>
                      <div className="mt-[108px]">
                        <Image src={ConnectLogo} alt="" width={320} height={320} />
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
  )
}

export default ProfileSetupModal
