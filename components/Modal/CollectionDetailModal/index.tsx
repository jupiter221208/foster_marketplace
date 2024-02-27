import React, { useEffect, useState, Fragment } from 'react'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// web3 part
import { useMetaplex } from 'hooks/useMetaplex'
import { useLocalWalletBundlr } from 'hooks/useLocalWalletBundlr'
import { PublicKey } from '@solana/web3.js'
import { type UpdateNftInput, toMetaplexFileFromBrowser } from '@metaplex-foundation/js'

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
import LoadingButton from 'components/Button/LoadingButton'
import { useRouter } from 'next/router'

// apis
import collectionsAPI from 'apis/collections'

const CollectionDetailModal = props => {
  const { open, close, data } = props
  const router = useRouter()
  const { metaplex } = useMetaplex()
  const { storage } = useLocalWalletBundlr()
  const [artName, setArtName] = useState(data.collection_name)
  const [artDesc, setArtDesc] = useState(data.description)
  const [selectedFile, setSelectedFile] = useState<any>(null)
  const [imageUrl, setImageUrl] = useState(data.cover_image)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (selectedFile !== null && selectedFile !== undefined) {
      setImageUrl(URL.createObjectURL(selectedFile[0]))
    }
  }, [selectedFile])

  const closeModal = () => {
    close()
  }

  const updateCollectionData = async () => {
    // web3 part
    setLoading(true)

    let chainNft = await metaplex.nfts().findByMint({
      mintAddress: new PublicKey(data.collection_id),
    })

    let needsJsonUpload = false
    let oldJson = chainNft.json ?? {}
    let newJson = structuredClone(oldJson)
    newJson.properties ??= {}
    newJson.properties.files ??= []

    if (artName != oldJson.name) {
      newJson.name = artName
      needsJsonUpload = true
    }
    if (artDesc != oldJson.description) {
      newJson.description = artDesc
      needsJsonUpload = true
    }
   
    let updateInput: UpdateNftInput = { nftOrSft: chainNft }
    if (artName != chainNft.name) updateInput.name = artName
    let newImageUrl = ''
    if (selectedFile !== null) {
      let metaplexFile = await toMetaplexFileFromBrowser(/* nft image file */ selectedFile[0])
      newImageUrl = await storage.upload(metaplexFile)
      for (let file of newJson.properties.files)
        if (file.url == newJson.image) {
          file.url = newImageUrl
          file.type = metaplexFile.contentType
        }
      if (newJson.properties.files.length == 0)
        newJson.properties.files.push({
          url: newImageUrl,
          type: metaplexFile.contentType,
        })
      newJson.image = newImageUrl
      needsJsonUpload = true
    }

    if (needsJsonUpload) updateInput.uri = await storage.uploadJson(newJson)

    if (Object.keys(updateInput).length > 1) {
      try {
        console.log('updating nft:', updateInput)
        await metaplex.nfts().update(updateInput)

        let params = {
          collectionName: artName,
          description: artDesc
        }
        
        if (newImageUrl.length > 0) {
          params["coverImage"] = newImageUrl
        }
       
        await collectionsAPI
        .updateCollection(data.collection_id, params)
        .then(
          response => {
            console.log(response)
          },
          error => {
            console.log(error)
            setLoading(false)
          }
        )
        setTimeout(() => {
          router.reload()
        }, 3000)
      } catch {
        setLoading(false)
      }
    } else {
      close('cancel')
      setLoading(false)
    }
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
                        <div className={styles.artName}>Collection Name</div>
                        <div className="w-full mt-[15px]">
                          <Input
                            value={limit(artName, 32)}
                            placeholder="Give your art name"
                            label01="Max Characters 32"
                            label02={32 - artName.length === 32 ? '' : `${32 - artName.length} Characters left`}
                            onChange={value => setArtName(limit(value, 32))}
                          />
                        </div>
                        <div className={`${styles.artName} mt-[40px]`}>Collection Description</div>
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
                          height={45}
                          label="Cancel"
                          onClick={() => close()}
                          borderWidth={2}
                          borderColor={'rgba(var(--main-bg-color-rgb), 0.25)'}
                        />
                         {loading ?
                          <LoadingButton width={100} height={45}/>
                          :
                          <GradientButton
                            width={100}
                            height={45}
                            backgroundColor01="var(--main-icon-color)"
                            backgroundColor02="var(--main-icon-color)"
                            label="Save"
                            onClick={() => updateCollectionData()}
                          />
                         }
                      </div>
                    </div>
                  </div>
                  {/* Mobile */}
                  <div className='w-full h-full overflow-scroll'>
                    <div className="block lg:hidden g-container">
                      <div className={`${styles.artImage} mt-[56px]`}>
                        <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                        <div className="absolute right-[17px] bottom-[19px] z-[1000]">
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
                      <div className="w-full mt-[30px]">
                        <div className={styles.artName}>Collection Name</div>
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
                        <div className={`${styles.artName} mt-[30px]`}>Collection Description</div>
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
                        {loading ?
                            <LoadingButton fullWidth height={45}/>
                            :
                        <GradientButton
                          fullWidth
                          height={45}
                          label="Save"
                          onClick={() => updateCollectionData()}
                        />
                        }
                      </div>
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
