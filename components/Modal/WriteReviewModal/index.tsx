import { Fragment, useEffect, useState } from 'react'

// next components
import Image from 'next/image'

// third party components
import { useViewport } from 'utils'
import { Dialog, Transition } from '@headlessui/react'

// componenets

// resources
import CloseIcon from 'assets/icons/close-wallet.svg?component'
import merchImageFront from 'assets/images/merch-order-front.png'
import PlusIcon from 'assets/icons/plus-circle-icon.svg?component'

// styles
import styles from './index.module.scss'
import ImageWithFoster from 'components/ImageWithFoster'
import RatingBar from 'components/RatingBar'
import Input from 'components/Input'
import Textarea from 'components/Input/Textarea'
import Dropzone from 'react-dropzone'
import GradientButton from 'components/Button/GradientButton'

const WriteReviewModal = ({ open, onClose }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [urls, setUrls] = useState([])

  const removeItem = index => {
    let list = [...urls]
    list.splice(index, 1)
    setUrls(list)
  }

  const selectItem = id => {
    let list = []
    urls.map((url, index) => {
      if (index === id) list.push({ src: url.src, selected: true })
      else list.push({ src: url.src, selected: false })
    })
    setUrls(list)
  }

  const handleRating = rating => {
    console.log(`The user rated: ${rating}/5`)
  }

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className={styles.container} onClose={onClose}>
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

        <div className="fixed inset-0 w-full h-full">
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
              <div className={styles.mainView}>
                <div className={styles.contentView}>
                  <div className="w-full flex justify-between">
                    <div className={styles.writeReview}>Write Review</div>
                    <div className="w-[40px] h-[40px]" onClick={onClose}>
                      <CloseIcon />
                    </div>
                  </div>
                  <div className={styles.productContainer}>
                    <div className={styles.productImage}>
                      <ImageWithFoster src={merchImageFront.src} width={65} />
                    </div>
                    <div>
                      <div className={styles.productTitle}>Product Name</div>
                      <div className={styles.productType}>Unisex Premium Hoodie | Embroidery | White</div>
                    </div>
                  </div>
                  <div className="mt-[20px]">
                    <div className={styles.subject}>
                      Overall rating <span>*</span>
                    </div>
                    <div className="mt-[10px]">
                      {/* <RatingBar value={3.5} outOf={5} /> */}
                      <RatingBar onRating={handleRating} />
                    </div>
                  </div>
                  <div className="mt-[20px]">
                    <div className={styles.subject}>
                      Add a headline <span>*</span>
                    </div>
                    <div className="mt-[10px]">
                      <Input
                        value={title}
                        placeholder="What's most important to know?"
                        label=""
                        fullWidth
                        onChange={value => setTitle(value)}
                        height="45px"
                      />
                    </div>
                  </div>
                  <div className="mt-[20px]">
                    <div className={styles.subject}>
                      Add a written review <span>*</span>
                    </div>
                    <div className="mt-[10px]">
                      <Textarea
                        value={content}
                        placeholder="What did you like or dislike?"
                        fullWidth
                        onChange={value => setContent(value)}
                        height={124}
                      />
                    </div>
                  </div>
                  <div className="mt-[20px]">
                    <div className={styles.subject}>Add a photo (max 3)</div>
                    <div className="mt-[10px] flex gap-[10px]">
                      {urls.map((url, index) => (
                        <div key={index} className={url.selected ? styles.selected : styles.deselected}>
                          <ImageWithFoster
                            src={url.src}
                            width={75}
                            className="w-full h-full object-cover"
                            onClick={() => selectItem(index)}
                          />
                          {url.selected && (
                            <div className={styles.remove} onClick={() => removeItem(index)}>
                              Remove
                            </div>
                          )}
                        </div>
                      ))}
                      {urls.length < 3 && (
                        <Dropzone
                          onDropAccepted={acceptedFiles => {
                            if (acceptedFiles.length !== 0) {
                              let assets = []
                              urls.map(url => {
                                assets.push({ src: url.src, selected: false })
                              })
                              assets.push({ src: URL.createObjectURL(acceptedFiles[0]), selected: true })
                              setUrls(assets)
                            }
                          }}
                          onDropRejected={rejectedFiles => {}}
                          accept={{
                            'image/jpeg': [],
                            'image/png': [],
                          }}
                          maxFiles={3}
                          maxSize={10485760}
                        >
                          {({ getRootProps, getInputProps }) => (
                            <section className={styles.dropzone}>
                              <div {...getRootProps()} className={styles.addPhoto}>
                                <input {...getInputProps()} />
                                <PlusIcon />
                              </div>
                            </section>
                          )}
                        </Dropzone>
                      )}
                    </div>
                  </div>
                </div>
                <div className="">
                  <div className={styles.border} />
                </div>
                <div className="pt-[25px] px-[30px] pb-[25px]">
                  <GradientButton
                    fullWidth
                    height={50}
                    label="Submit"
                    backgroundColor01="var(--main-icon-color)"
                    backgroundColor02="var(--main-icon-color)"
                    color="var(--background-main-color)"
                  />
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

export default WriteReviewModal
