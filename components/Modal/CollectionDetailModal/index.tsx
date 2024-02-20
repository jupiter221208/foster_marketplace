import React, { useEffect, useState, Fragment } from 'react'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// next components
import Input from 'components/Input'

// custom components
import { limit } from 'utils/strings'
import Textarea from 'components/Input/Textarea'

// resources
import EditImageIcon from 'assets/icons/edit-icon.svg?component'

// styles
import styles from './index.module.scss'
import OutlineButton from 'components/Button/OutlineButton'
import GradientButton from 'components/Button/GradientButton'
import Dropzone from 'react-dropzone'

// apis

const CollectionDetailModal = props => {
  const { open, close, data } = props
  const [artName, setArtName] = useState(data.collection_name)
  const [artDesc, setArtDesc] = useState(data.description)
  const [selectedFile, setSelectedFile] = useState<any>()
  const [imageUrl, setImageUrl] = useState(data.cover_image)

  useEffect(() => {
    if (selectedFile !== null && selectedFile !== undefined) {
      setImageUrl(URL.createObjectURL(selectedFile[0]))
    }
  }, [selectedFile])

  const closeModal = () => {
    close()
  }

  const updateCollectionData = () => {
    // web3 part
    close()
  }

  return (
    <div>
      <Transition show={open} as={Fragment}>
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
            <div className="flex min-h-full items-center justify-center text-center">
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
                  {/* Desktop */}
                  <div className="hidden lg:block">
                    <div className="w-full flex gap-[40px]">
                      <div className={styles.artImage}>
                        <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                        <div className="absolute bottom-[24px] right-[28px] z-[1000]">
                          <Dropzone
                            onDrop={acceptedFiles => {
                              acceptedFiles.length !== 0 && setSelectedFile(acceptedFiles)
                            }}
                            onDropRejected={rejectedFiles => {}}
                            maxFiles={1}
                            accept={{ 'image/jpeg': [], 'image/png': [], 'image/gif': [] }}
                            maxSize={31457280}
                          >
                            {({ getRootProps, getInputProps, open }) => (
                              <section>
                                <button onClick={open} style={{ display: 'none' }}>
                                  open
                                </button>
                                <div {...getRootProps()}>
                                  <input {...getInputProps()} />
                                  <EditImageIcon alt="" />
                                </div>
                              </section>
                            )}
                          </Dropzone>
                        </div>
                      </div>
                      <div className="w-full">
                        <div className={styles.artName}>Artwork Name</div>
                        <div className="w-full mt-[15px]">
                          <Input
                            value={limit(artName, 32)}
                            placeholder="Give your art name"
                            label01="Max Characters 32"
                            label02={32 - artName.length === 32 ? '' : `${32 - artName.length} Characters left`}
                            onChange={value => setArtName(limit(value, 32))}
                          />
                        </div>
                        <div className={`${styles.artName} mt-[40px]`}>Artwork Description</div>
                        <div className="w-full mt-[15px]">
                          <Textarea
                            value={limit(artDesc, 1000)}
                            placeholder="Give your art name"
                            label01="Max Characters 1000"
                            label02={1000 - artDesc.length === 1000 ? '' : `${1000 - artDesc.length} Characters left`}
                            onChange={value => setArtDesc(limit(value, 1000))}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="w-full flex justify-end mt-[80px]">
                      <div className="flex gap-[30px]">
                        <OutlineButton
                          width={100}
                          label="Cancel"
                          onClick={() => close()}
                          borderWidth={2}
                          borderColor={'rgba(var(--main-bg-color-rgb), 0.25)'}
                        />
                        <GradientButton
                          width={100}
                          backgroundColor01="var(--main-icon-color)"
                          backgroundColor02="var(--main-icon-color)"
                          label="Save"
                          onClick={() => updateCollectionData()}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Mobile */}
                  <div className="block lg:hidden g-container">
                    <div className={`${styles.artImage} mt-[56px]`}>
                      <img src={data.cover_image} alt="" className="w-full h-full object-cover" />
                      <div className="absolute w-[40px] h-[40px] right-[17px] bottom-[19px]">
                        <EditImageIcon alt="" />
                      </div>
                    </div>
                    <div className="w-full mt-[30px]">
                      <div className={styles.artName}>Artwork Name</div>
                      <div className="w-full mt-[15px]">
                        <Input
                          height={47}
                          value={limit(artName, 32)}
                          placeholder="Give your art name"
                          label01="Max Characters 32"
                          label02={32 - artName.length === 32 ? '' : `${32 - artName.length} Characters left`}
                          onChange={value => setArtName(limit(value, 32))}
                        />
                      </div>
                      <div className={`${styles.artName} mt-[30px]`}>Artwork Description</div>
                      <div className="w-full mt-[15px]">
                        <Textarea
                          height={140}
                          value={limit(artDesc, 1000)}
                          placeholder="Give your art name"
                          label01="Max Characters 1000"
                          label02={1000 - artDesc.length === 1000 ? '' : `${1000 - artDesc.length} Characters left`}
                          onChange={value => setArtName(limit(value, 1000))}
                        />
                      </div>
                    </div>
                    <div className="w-full flex gap-[24px] mt-[70px] mb-[70px]">
                      <OutlineButton
                        fullWidth
                        height={45}
                        label="Cancel"
                        onClick={() => close()}
                        borderWidth={2}
                        borderColor={'rgba(var(--main-bg-color-rgb), 0.25)'}
                      />
                      <GradientButton
                        fullWidth
                        height={45}
                        backgroundColor01="var(--main-icon-color)"
                        backgroundColor02="var(--main-icon-color)"
                        label="Save"
                        onClick={() => updateCollectionData()}
                      />
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}

export default CollectionDetailModal
