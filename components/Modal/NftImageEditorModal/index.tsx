import React, { Fragment, useCallback, useEffect, useState } from 'react'

// third party components
import { Dialog, Transition } from '@headlessui/react'
import Cropper from 'react-easy-crop'
import { Point, Area } from 'react-easy-crop/types'
import Lottie from 'lottie-react'
import LoadingIcon from 'assets/lottery/loader-black.json'

// custom components
import Button from 'components/Button'
import IconButton from 'components/Button/IconButton'
import Range from 'components/Range'
import GradientButton from 'components/Button/GradientButton'

// custom functions
import getCroppedImg from 'utils/cropImage'

// images
import CloseWhiteIcon from 'assets/icons/close-white.svg'
import ZoomInWhiteIcon from 'assets/icons/zoom-in-white-32x32.svg'
import ZoomOutWhiteIcon from 'assets/icons/zoom-out-white-32x32.svg'

// styles
import styles from './index.module.scss'
import LoadingButton from 'components/Button/LoadingButton'

const NftImageEditorModal = props => {
  const { open, close, nftImage, nftUrl, getCroppedImage, dimension } = props
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState('')

  useEffect(() => {
    if (nftImage !== undefined && nftImage !== null) {
      setTimeout(() => {
        setImage(URL.createObjectURL(nftImage[0]))
      }, 400)
    }
  }, [nftImage])

  useEffect(() => {
    if (nftUrl !== undefined && nftUrl !== null) {
      setTimeout(() => {
        setImage(nftUrl)
      }, 400)
    }
  }, [nftUrl])

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const showCroppedImage = useCallback(async () => {
    try {
      setLoading(true)
      const croppedImage: any = await getCroppedImg(image, croppedAreaPixels)
      getCroppedImage(croppedImage)
      setLoading(false)
    } catch (e) {
      console.error(e)
    }
  }, [croppedAreaPixels])

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className={styles.container} onClose={() => {}}>
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
          <div className="flex min-h-full items-center justify-center text-center p-4">
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
                <div className="hidden lg:flex absolute top-5 left-5 lg:left-auto right-auto lg:right-5 z-20">
                  <IconButton
                    icon={CloseWhiteIcon}
                    onClick={() => close()}
                    backgroundColor="#585B5D"
                    width="30px"
                    height="30px"
                    borderRadius="15px"
                    iconWidth={12}
                    iconHeight={!2}
                  />
                </div>
                <div className="w-full h-[44px] flex justify-between lg:justify-center items-center">
                  <div className="flex lg:hidden px-4">
                    <IconButton
                      icon={CloseWhiteIcon}
                      onClick={() => close()}
                      backgroundColor="#585B5D"
                      width="22px"
                      height="22px"
                      borderRadius="11px"
                      iconWidth={12}
                      iconHeight={!2}
                    />
                  </div>
                  <div className={styles.title}>Crop Photo</div>
                  <div className="flex lg:hidden w-full max-w-[68px]">
                    {loading ? (
                      <div className="w-full flex justify-center items-center">
                        <div className="w-[30px] h-[30px]">
                          <Lottie animationData={LoadingIcon} loop={true} />
                        </div>
                      </div>
                    ) : (
                      <Button
                        label="Crop"
                        backgroundColor="transparent"
                        color="rgba(239, 240, 246, 0.75)"
                        fullWidth
                        fontSize="16px"
                        onClick={() => showCroppedImage()}
                      />
                    )}
                  </div>
                </div>
                <div className={styles.cropContainer}>
                  {image !== '' && (
                    <Cropper
                      image={image}
                      crop={crop}
                      zoom={zoom}
                      aspect={dimension.value[0] / dimension.value[1]}
                      onCropChange={setCrop}
                      onCropComplete={onCropComplete}
                      onZoomChange={setZoom}
                    />
                  )}
                </div>
                <div className="w-full flex justify-between items-center px-0 lg:px-12">
                  <div className="w-full lg:w-[343px] h-10 rounded-[20px] bg-[#272B2E] flex justify-between items-center gap-5 px-4 mt-12 lg:mt-0">
                    <IconButton
                      icon={ZoomOutWhiteIcon}
                      onClick={() => (zoom - 0.3 <= 1 ? setZoom(1) : setZoom(zoom - 0.3))}
                      backgroundColor="transparent"
                      width="32px"
                      height="32px"
                      borderRadius="16px"
                    />
                    <Range min={1} max={3} step={0.1} value={zoom} onChange={(value: number) => setZoom(value)} />
                    <IconButton
                      icon={ZoomInWhiteIcon}
                      onClick={() => (zoom + 0.3 >= 3 ? setZoom(3) : setZoom(zoom + 0.3))}
                      backgroundColor="transparent"
                      width="32px"
                      height="32px"
                      borderRadius="16px"
                    />
                  </div>
                  <div className="hidden lg:flex w-full max-w-[99px]">
                    {loading ? (
                      <LoadingButton fullWidth height={45} />
                    ) : (
                      <GradientButton label="Crop" fullWidth height="45px" onClick={() => showCroppedImage()} />
                    )}
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

export default NftImageEditorModal
