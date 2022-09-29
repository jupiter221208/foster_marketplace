import React, { Fragment, useCallback, useEffect, useState } from 'react'

// next components
import Image from 'next/image'

// third party components
import { Dialog, Transition } from '@headlessui/react'
import Cropper from 'react-easy-crop'

// custom components
import IconButton from 'components/Button/IconButton'
import Range from 'components/Range'
import GradientButton from 'components/Button/GradientButton'

// custom functions
import { useViewport } from 'utils'
import getCroppedImg from 'utils/cropImage'

// images
import CloseWhiteIcon from 'assets/icons/close-white.svg'

// styles
import styles from './index.module.scss'

const NFTArtEditorModal = props => {
  const { open, close, nftArt, getCroppedImage } = props

  const [image, setImage] = useState('')

  useEffect(() => {
    if (nftArt !== undefined && nftArt !== null) {
      setImage(URL.createObjectURL(nftArt[0]))
    }
  }, [nftArt])

  const viewport = useViewport()

  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage: any = await getCroppedImg(nftArt, croppedAreaPixels, 0)
      getCroppedImage(croppedImage)
    } catch (e) {
      console.error(e)
    }
  }, [croppedAreaPixels])

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className={styles.container} onClose={() => close()}>
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
                <div className="absolute top-5 right-4 z-20">
                  <IconButton
                    icon={CloseWhiteIcon}
                    onClick={() => close()}
                    backgroundColor="#378287"
                    width="30px"
                    height="30px"
                    borderRadius="15px"
                    iconWidth="12px"
                    iconHeight="12px"
                  />
                </div>
                <div className={styles.cropContainer}>
                  {nftArt !== undefined && (
                    <Cropper
                      image={image}
                      crop={crop}
                      zoom={zoom}
                      aspect={4 / 3}
                      onCropChange={setCrop}
                      onCropComplete={onCropComplete}
                      onZoomChange={setZoom}
                    />
                  )}
                </div>
                <div className="w-full flex justify-between">
                  <div>Zoom</div>
                  <Range min={1} max={3} step={0.1} value={zoom} onChange={(value: number) => setZoom(value)} />
                  <div>
                    <GradientButton label="Crop Image" onClick={() => showCroppedImage()} />
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

export default NFTArtEditorModal
