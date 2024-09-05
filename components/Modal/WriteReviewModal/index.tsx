import { Fragment, useEffect, useState } from 'react'

// next components
import Image from 'next/image'

// third party components
import { Dialog, Transition } from '@headlessui/react'
import { writeReview } from 'apis/merch'
import { namePublicFile } from 'utils'

// componenets
import uploadFileToS3API from 'apis/aws'

// resources
import CloseIcon from 'assets/icons/close-wallet.svg?component'
import PlusIcon from 'assets/icons/plus-circle-icon.svg?component'

// styles
import styles from './index.module.scss'

import Alert from 'components/Alert'
import ImageWithFoster from 'components/ImageWithFoster'
import RatingBar from 'components/RatingBar'
import Input from 'components/Input'
import Textarea from 'components/Input/Textarea'
import Dropzone from 'react-dropzone'
import GradientButton from 'components/Button/GradientButton'
import LoadingButton from 'components/Button/LoadingButton'

const WriteReviewModal = ({ open, onClose, previewUrl, itemDetails, onSuccess }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [urls, setUrls] = useState([])
  const [descCount, setDescCount] = useState(110)
  const [rating, setRating] = useState(null)
  const [alertData, setAlertData] = useState<any[]>([])
  const [showAlert, setShowAlert] = useState(false)
  const [loading, setLoading] = useState(false)

  console.log(itemDetails, '============itemDetails========')
  useEffect(() => {
    function handleResize() {
      let screenWidth = window.innerWidth
      let count = screenWidth >= 640 ? 110 : screenWidth >= 480 ? 110 : screenWidth >= 414 ? 58 : 40
      setDescCount(count)
    }

    window.addEventListener('resize', handleResize)

    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (open) {
      setRating(null)
      setTitle('')
      setContent('')
      setUrls([])
    }
  }, [open])

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
    setRating(rating)
  }

  async function writeReviewAPI(photos) {
    let params = {
      user_id: itemDetails.userId,
      merch_id: itemDetails.merchId,
      rating: rating,
      headline: title,
      review: content,
      images: photos,
    }

    writeReview(itemDetails.merchId, params).then(
      response => {
        setLoading(false)

        onClose()
        onSuccess()
      },
      error => {
        setLoading(false)
        setAlertData([
          {
            id: 0,
            title: 'Submit Failure!',
            description: "You've failed to submit the review",
            type: 'failure',
          },
        ])
        setShowAlert(true)
      }
    )
  }

  const onClickSubmit = async () => {
    if (!rating) {
      setAlertData([
        {
          id: 0,
          title: 'Overall rating missing',
          description: `You must select overall rating, please select rating`,
          type: 'failure',
        },
      ])
      setShowAlert(true)
      return
    }
    if (title.length === 0) {
      setAlertData([
        {
          id: 0,
          title: 'Headline missing',
          description: `You must add a headline, please add a headline`,
          type: 'failure',
        },
      ])
      setShowAlert(true)
      return
    }
    if (content.length === 0) {
      setAlertData([
        {
          id: 0,
          title: 'Review missing',
          description: `You must write a reivew, please write a headline`,
          type: 'failure',
        },
      ])
      setShowAlert(true)
      return
    }
    let photos = []
    if (urls.length > 0) {
      setLoading(true)
      for (let index = 0; index < urls.length; index++) {
        let url = urls[index]
        let response = await fetch(url.src)
        let blob = await response.blob()
        const file = new File([blob], `photo${index}.jpg`, {
          type: 'image/jpeg',
        })

        const filename = namePublicFile(`photo${index}.jpg`)
        let photo = await uploadFileToS3API(file, filename)
        photos.push(photo.url)
      }
    }
    writeReviewAPI(photos)
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
                    <div className="w-[30px] h-[30px]" onClick={onClose}>
                      <CloseIcon />
                    </div>
                  </div>
                  <div className={styles.productContainer}>
                    <div className={styles.productImage}>
                      <ImageWithFoster src={previewUrl} width={65} />
                    </div>
                    <div>
                      <div className={styles.productTitle}>{itemDetails?.print}</div>
                      <div className={styles.productType}>{itemDetails?.description}</div>
                    </div>
                  </div>
                  <div className="mt-[20px]">
                    <div className={styles.subject}>
                      Overall rating <span>*</span>
                    </div>
                    <div className="mt-[10px]">
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
                              for (let index = 0; index < acceptedFiles.length; index++) {
                                assets.push({ src: URL.createObjectURL(acceptedFiles[index]), selected: false })
                                if (assets.length === 3) break
                              }
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

                <div className={styles.border} />

                <div className="pt-[0px] lg:pt-[25px] px-[16px] lg:px-[30px] pb-[25px]">
                  {loading ? (
                    <LoadingButton fullWidth height={50} />
                  ) : (
                    <GradientButton
                      fullWidth
                      height={50}
                      label="Submit"
                      backgroundColor01="var(--main-icon-color)"
                      backgroundColor02="var(--main-icon-color)"
                      color="var(--background-main-color)"
                      onClick={() => onClickSubmit()}
                    />
                  )}
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>

          <Alert
            open={showAlert}
            close={() => {
              setShowAlert(false)
            }}
            data={alertData}
          />
        </div>
      </Dialog>
    </Transition>
  )
}

export default WriteReviewModal
