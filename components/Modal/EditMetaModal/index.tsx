import React, { useEffect, useState, Fragment } from 'react'
import { useRouter } from 'next/router'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// next components
import Input from 'components/Input'

// custom components
import { limit } from 'utils/strings'
import Textarea from 'components/Input/Textarea'
import LoadingButton from 'components/Button/LoadingButton'

// resources
import EditImageIcon from 'assets/icons/edit-icon.svg?component'

// styles
import styles from './index.module.scss'
import OutlineButton from 'components/Button/OutlineButton'
import GradientButton from 'components/Button/GradientButton'
import WalletInputBox from 'components/Input/WalletInputBox'
import AttributeInputBox from 'components/Input/AttributetInputBox'
import Dropzone from 'react-dropzone'

// web3
import { PublicKey } from '@solana/web3.js'
import { type UpdateNftInput, toMetaplexFileFromBrowser } from '@metaplex-foundation/js'
import { useMetaplex } from 'hooks/useMetaplex'
import { useLocalWalletBundlr } from 'hooks/useLocalWalletBundlr'
import { validDigits } from 'utils/helpers'

// api
import nftsAPI from 'apis/nfts'

const EditMetaModal = props => {
  const { open, close, nftType, nftCover, nftAsset, nftInfo, nftRoyalties, nftAttributes, creatorRoyalty } = props
  const router = useRouter()
  const { metaplex } = useMetaplex()
  const { storage } = useLocalWalletBundlr()
  
  const [assetType, setAssetType] = useState(nftType)
  const [artName, setArtName] = useState(nftInfo.name)
  const [artDesc, setArtDesc] = useState(nftInfo.description)
  const [artRoyalty, setArtRoyalty] = useState(creatorRoyalty)
  const [creatorList, setCreatorList] = useState(nftRoyalties)
  const [attributeList, setAttributeList] = useState<{ type: string; name: string }[]>([])
  const [coverUrl, setCoverUrl] = useState(nftCover)
  const [assetUrl, setAssetUrl] = useState(nftAsset)
  const [selectedFile, setSelectedFile] = useState<any>(null)
  const [coverImageProcessing, setCoverImageProcessing] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let list = []
    nftAttributes?.map(item => {
      list.push({ type: item.trait_type, name: item.value })
    })
    setAttributeList(list)
  }, [nftAttributes])

  useEffect(() => {
    if (selectedFile !== null && selectedFile !== undefined) {
      let type = selectedFile[0].type
      if (type.includes('image')) {
        setAssetType('image')
        setCoverUrl(URL.createObjectURL(selectedFile[0]))
      } else if (type.includes('video')) {
        setAssetType('video')
        setAssetUrl(URL.createObjectURL(selectedFile[0]))

        setCoverImageProcessing(true)
        let canvas = document.createElement('canvas')
        let hidden_video: HTMLVideoElement = document.getElementById('hidden_video') as HTMLVideoElement
        hidden_video.src = URL.createObjectURL(selectedFile[0])

        hidden_video.addEventListener('seeked', function () {
          canvas.width = hidden_video.videoWidth
          canvas.height = hidden_video.videoHeight

          let ctx = canvas.getContext('2d')
          ctx.drawImage(hidden_video, 0, 0, canvas.width, canvas.height)

          canvas.toBlob(blob => {
            setCoverUrl(URL.createObjectURL(blob))
            setCoverImageProcessing(false)
          })
        })
        hidden_video.currentTime = 5
      }
    }
  }, [selectedFile])

  const closeModal = () => {
    close('cancel')
  }

  const updateMetadata = async () => {
    if (coverImageProcessing) return

    setLoading(true)

    let chainNft = await metaplex.nfts().findByMint({
      mintAddress: new PublicKey(nftInfo.address),
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
    let categoryList = []
    if (
      attributeList.length != oldJson.attributes?.length ||
      attributeList.some(({ type, name }, index) => {
        let chainAttribute = oldJson.attributes[index]
        return type != chainAttribute.trait_type || name != chainAttribute.value
      })
    ) {
      categoryList = attributeList.map(({ type, name }) => ({
        trait_type: type,
        value: name,
      }))
      newJson.attributes  = categoryList
      needsJsonUpload = true
    }

    let updateInput: UpdateNftInput = { nftOrSft: chainNft }
    if (artName != chainNft.name) updateInput.name = artName
    if (
      creatorList.length != chainNft.creators.length ||
      creatorList.some((creator, index) => {
        let chainCreator = chainNft.creators[index]
        return creator.address != chainCreator.address.toBase58() || creator.share != chainCreator.share
      })
    ) {
      let verifiedMap = {}
      for (let { address, verified } of chainNft.creators) verifiedMap[address.toBase58()] = verified
      updateInput.creators = creatorList.map(({ address, share }) => ({
        address: new PublicKey(address),
        share,
        verified: verifiedMap[address] ?? false,
      }))
    }

    let newRoyalty = Math.floor(parseFloat(artRoyalty) * 100)
    let royaltyChanged = false
    if (newRoyalty != chainNft.sellerFeeBasisPoints) {
      updateInput.sellerFeeBasisPoints = newRoyalty
      royaltyChanged = true
    }

    let newImageUrl = '';
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
    if (/* nft asset changed */ false) {
      let metaplexFile = await toMetaplexFileFromBrowser(/* nft asset file */ selectedFile)
      let newAnimationUrl = await storage.upload(metaplexFile)
      for (let file of newJson.properties.files)
        if (file.url == newJson.animation_url) {
          file.url = newAnimationUrl
          file.type = metaplexFile.contentType
        }
      if (newJson.properties.files.length == 0)
        newJson.properties.files.push({
          url: newAnimationUrl,
          type: metaplexFile.contentType,
        })
      newJson.animation_url = newAnimationUrl
      needsJsonUpload = true
    }

    if (needsJsonUpload) updateInput.uri = await storage.uploadJson(newJson)

    if (Object.keys(updateInput).length > 1) {
      try {
        console.log('updating nft:', updateInput)
        await metaplex.nfts().update(updateInput)
        let params = {
          nftName: artName,
          assetType: nftType
        }
        if (categoryList.length > 0) {
          let category = ''
          categoryList.filter(item => item.trait_type === "category").forEach(item => {
            category += item.value + ','
          })
          params["categories"] = category.slice(0, -1)
        }
        if (newImageUrl.length > 0) {
          params["coverImageUrl"] = newImageUrl
          if (nftType === 'image') {
            params["assetUrl"] = newImageUrl
          }
        }
        if (royaltyChanged) {
          params["royalties"] = newRoyalty.toString()
        }
        await nftsAPI
        .update(nftInfo.address, params)
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
                        {assetType.includes('video') ? (
                          <video
                            autoPlay
                            src={assetUrl}
                            loop
                            playsInline
                            controls
                            controlsList="nodownload"
                            className="w-full h-full object-cover overflow-hidden"
                          />
                        ) : assetType.includes('image') ? (
                          <img src={coverUrl} alt="" className="w-full h-full object-cover" />
                        ) : assetType.includes('audio') ? (
                          <div className="w-full h-full z-10">
                            <img src={coverUrl} alt="" className="w-full h-full object-contain z-10" />
                          </div>
                        ) : (
                          <img src={coverUrl} alt="" className="w-full h-full object-cover" />
                        )}
                        <div className="absolute bottom-[24px] right-[28px] z-[1000]">
                          <Dropzone
                            onDrop={acceptedFiles => {
                              acceptedFiles.length !== 0 && setSelectedFile(acceptedFiles)
                            }}
                            onDropRejected={rejectedFiles => {}}
                            maxFiles={1}
                            accept={{
                              'image/jpeg': [],
                              'image/png': [],
                              'image/gif': [],
                            }}
                            maxSize={31457280}
                          >
                            {({ getRootProps, getInputProps, open }) => (
                              <section>
                                <button onClick={open} style={{ display: 'none' }}>
                                  open
                                </button>
                                <div {...getRootProps()} style={{ outline: 'none' }}>
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
                    <div className="w-full flex mt-[44px] justify-between">
                      <div className="w-[15%]">
                        <div className={`${styles.roaylties} mb-[15px]`}>Creator Royalties</div>
                        <input
                          className={`${styles.inputArea} mb-[30px]`}
                          value={artRoyalty + '%'}
                          placeholder={'10%'}
                          onChange={event => {
                            let value = validDigits(event.target.value)
                            if (value > 100) value = 100
                            setArtRoyalty(value)
                          }}
                        />
                      </div>
                      <div className="w-[40%]">
                        <WalletInputBox
                          creatorList={creatorList}
                          setCreatorList={setCreatorList}
                          label="Royalty Split"
                        />
                      </div>
                      <div className="w-[35%]">
                        <AttributeInputBox
                          attributeList={attributeList}
                          setAttributeList={setAttributeList}
                          label="Attributes"
                        />
                      </div>
                    </div>

                    <div className="w-full flex justify-end mt-[50px]">
                      <div className="flex gap-[30px]">
                        <OutlineButton
                          width={100}
                          height={45}
                          label="Cancel"
                          onClick={() => close('cancel')}
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
                            onClick={() => updateMetadata()}
                          />
                        }
                      </div>
                    </div>
                  </div>
                  {/* Mobile */}
                  <div className="block lg:hidden g-container">
                    <div className={`${styles.artImage} mt-[56px]`}>
                      {assetType.includes('video') ? (
                        <video
                          autoPlay
                          src={assetUrl}
                          loop
                          playsInline
                          controls
                          controlsList="nodownload"
                          className="w-full h-full object-cover overflow-hidden"
                        />
                      ) : assetType.includes('image') ? (
                        <img src={coverUrl} alt="" className="w-full h-full object-cover" />
                      ) : assetType.includes('audio') ? (
                        <div className="w-full h-full z-10">
                          <img src={coverUrl} alt="" className="w-full h-full object-contain z-10" />
                        </div>
                      ) : (
                        <img src={coverUrl} alt="" className="w-full h-full object-cover" />
                      )}
                      <div className="absolute w-[30px] h-[30px] right-[17px] bottom-[19px]">
                        <Dropzone
                          onDrop={acceptedFiles => {
                            acceptedFiles.length !== 0 && setSelectedFile(acceptedFiles)
                          }}
                          onDropRejected={rejectedFiles => {}}
                          maxFiles={1}
                          accept={{
                            'image/jpeg': [],
                            'image/png': [],
                            'image/gif': [],
                          }}
                          maxSize={31457280}
                        >
                          {({ getRootProps, getInputProps, open }) => (
                            <section>
                              <button onClick={open} style={{ display: 'none' }}>
                                open
                              </button>
                              <div {...getRootProps()} style={{ outline: 'none' }}>
                                <input {...getInputProps()} />
                                <EditImageIcon alt="" />
                              </div>
                            </section>
                          )}
                        </Dropzone>
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
                          onChange={value => setArtDesc(limit(value, 1000))}
                        />
                      </div>
                    </div>
                    <div className="w-full mt-[40px]">
                      <div className="w-full">
                        <AttributeInputBox
                          attributeList={attributeList}
                          setAttributeList={setAttributeList}
                          label="Attributes"
                        />
                      </div>
                      <div className="w-full mt-[30px]">
                        <div className={`${styles.roaylties} mb-[15px]`}>Creator Royalties</div>
                        <input
                          className={`${styles.inputArea} mb-[30px]`}
                          value={artRoyalty + '%'}
                          placeholder={'10%'}
                          onChange={event => {
                            let value = validDigits(event.target.value)
                            if (value > 100) value = 100
                            setArtRoyalty(value)
                          }}
                        />
                        <WalletInputBox
                          creatorList={creatorList}
                          setCreatorList={setCreatorList}
                          label="Royalty Split"
                        />
                      </div>

                      <div className="flex gap-[24px] mt-[70px] mb-[70px]">
                        <OutlineButton
                          fullWidth
                          height={45}
                          label="Cancel"
                          onClick={() => close('cancel')}
                          borderWidth={2}
                          borderColor={'rgba(var(--main-bg-color-rgb), 0.25)'}
                        />
                        {loading ? 
                          <LoadingButton fullWidth height={45}/>
                          :
                          <GradientButton
                            fullWidth
                            height={45}
                            backgroundColor01="var(--main-icon-color)"
                            backgroundColor02="var(--main-icon-color)"
                            label="Save"
                            onClick={() => updateMetadata()}
                          />
                        }
                      </div>
                    </div>
                    <div>
                      <video controls className="hidden w-full h-full z-10" id="hidden_video"></video>
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

export default EditMetaModal
