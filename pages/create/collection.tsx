import React, { useEffect, useState } from 'react'

// next components
import Head from 'next/head'

// third party components
import { useSelector, useDispatch } from 'react-redux'

// components
import SecondaryLayout from 'components/Layout/SecondaryLayout'
import SuccessMintCollectionSection from 'components/pages/Create/Collection/SuccessMintCollectionSection'
import Step01CollectionSection from 'components/pages/Create/Collection/Step01CollectionSection'
import Step02CollectionSection from 'components/pages/Create/Collection/Step02CollectionSection'
import Step03CollectionSection from 'components/pages/Create/Collection/Step03CollectionSection'
import Alert from 'components/Alert'

// json
import CategoryList from 'assets/json/popular-category.json'

// solana
import { useMetaplex } from 'hooks/useMetaplex'
import { useLocalWalletBundlr } from 'hooks/useLocalWalletBundlr'

import { Keypair, PublicKey } from '@solana/web3.js'
import { CreateNftOutput, JsonMetadata, toMetaplexFile, toMetaplexFileFromBrowser } from '@metaplex-foundation/js'

// images and icons

// call apis
import collectionsAPI from 'apis/collections'
import { useAuthentication } from 'hooks/useAuthentication'
import { NftData } from 'types/nft'
import { useRouter } from 'next/router'
import FullScreenLoadingModal from 'components/Modal/FullScreenLoadingModal'

const Collection = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const isLoading = useSelector<any>(state => state.isLoading)
  const mintCollectionStep = useSelector(state => (state as any).mintCollectionStep)
  const collectionMintAddress = useSelector(state => (state as any).collectionMintAddress)
  const collectionMintName = useSelector(state => (state as any).collectionMintName)
  const collectionCoverUrl = useSelector(state => (state as any).collectionCoverUrl)
  const [screenLoaded, setScreenLoaded] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertData, setAlertData] = useState<any[]>([])
  const [coverImageProcessing, setCoverImageProcessing] = useState(false)

  // solana
  const { metaplex: mx } = useMetaplex()
  const { storage, ensureLocalWalletBalance } = useLocalWalletBundlr()
  const { refreshToken } = useAuthentication()

  // --------------variables------------
  const [currentStep, setCurrentStep] = useState(mintCollectionStep)

  // step 1
  const [collectionName, setCollectionName] = useState<any>('')
  const [description, setDescription] = useState<any>('')
  const [coverImage, setCoverImage] = useState<any>()
  const [coverCroppedImage, setCoverCroppedImage] = useState<any>()
  const [coverAWSUrl, setCoverAWSUrl] = useState<any>()
  const [bannerImage, setBannerImage] = useState<any>()
  const [bannerCroppedImage, setBannerCroppedImage] = useState<any>()
  const [bannerAWSUrl, setBannerAWSUrl] = useState<any>()
  const [categoryList, setCategoryList] = useState<any[]>([])

  useEffect(() => {
    dispatch({ type: 'set', isLoading: false })
    setTimeout(() => {
      setScreenLoaded(true)
    }, 1000)

    let array: any[] = []
    CategoryList.map(item => {
      let object: any = item
      object.checked = false
      array.push(object)
    })
    setCategoryList(array)
  }, [])

  // step 2
  const [collectionFiles, setCollectionFiles] = useState<any[]>([])
  const [royalties, setRoyalties] = useState(0)
  const [collectionNft, setCollectionNft] = useState<CreateNftOutput>()
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null)
  const collectionNftMint = Keypair.generate()

  const mintCollection = async () => {
    try {
      dispatch({ type: 'set', isLoading: true })

      await refreshToken()
      // TODO: calculate real file size
      // for now, just fund with 0.1 sol which is little over 1GB
      let signature = await ensureLocalWalletBalance(0.1 * 1e9, 'confirmed')

      const categories = categoryList.filter(item => item.checked)

      const attributes = categories.map(category => {
        return { trait_type: 'category', value: category.name }
      })
      let coverImageUrl = await storage.upload(await toMetaplexFileFromBrowser(coverImage[0]))

      setCoverImageUrl(coverImageUrl)

      let trimmedCollectionName = collectionName.trim()
      let trimmedDescription = description.trim()
      const uri = await storage.uploadJson({
        name: trimmedCollectionName,
        description: trimmedDescription,
        attributes: attributes,
        image: coverImageUrl,
      })

      const collectionNft = await mx.nfts().create({
        useNewMint: collectionNftMint,
        isCollection: true,
        name: trimmedCollectionName,
        uri: uri,
        sellerFeeBasisPoints: royalties * 100,
      })

      if (collectionNft) {
        setCollectionNft(collectionNft)

        const categories = categoryList.filter(item => item.checked)
        let category = ''
        categories.forEach(item => {
          category += item.name + ','
        })

        let collectionInfo = {
          collection_id: collectionNft.mintAddress.toString(),
          collection_name: collectionName.trim(),
          description: description.replaceAll('\n', ' ').trim(),
          banner_image: bannerAWSUrl,
          cover_image: coverAWSUrl,
          categories: category.slice(0, -1),
          nfts: [],
        }

        collectionsAPI.mintCollection(collectionInfo).then(
          response => {
            router.push(`/collection/${collectionNft.mintAddress.toString()}`)
          },
          error => {}
        )
      }
    } catch (e) {
      console.log(e)
      dispatch({ type: 'set', isLoading: false })
    } finally {
    }
  }

  const onChangeCollectionFiles = files => {
    let array: any[] = []
    files.map((item, index) => {
      let object: any = {}
      object.id = index
      object.file = item
      object.nftCoverImage = null
      object.url = null

      if (item.type === 'image/gif') {
        object.type = item.type
      } else {
        object.type = item.type.split('/')[0]
      }
      object.name = ''
      object.description = ''
      if (item.type.split('/')[0] === 'audio') {
        // object.croppedImage = URL.createObjectURL(coverImage[0])
        object.croppedImage = collectionCoverUrl
      } else if (item.type.split('/')[0] === 'image') {
        object.croppedImage = URL.createObjectURL(item)
      } else if (item.type.split('/')[0] === 'video') {
        setCoverImageProcessing(true)
        let canvas = document.createElement('canvas')
        let hidden_video: HTMLVideoElement = document.getElementById('hidden_video') as HTMLVideoElement
        hidden_video.src = URL.createObjectURL(item)

        hidden_video.addEventListener('seeked', function () {
          canvas.width = hidden_video.videoWidth
          canvas.height = hidden_video.videoHeight

          let ctx = canvas.getContext('2d')
          ctx.drawImage(hidden_video, 0, 0, canvas.width, canvas.height)

          canvas.toBlob(blob => {
            object.croppedImage = URL.createObjectURL(blob)
            setCoverImageProcessing(false)
          })
        })
        hidden_video.currentTime = 5
      } else if (item.type === '' && /\.glb$/.test(item.name)) {
        object.type = 'vr'
        object.url = URL.createObjectURL(item)
      }
      array.push(object)
    })

    let new_files = [...collectionFiles, ...array]
    new_files.map((file, i) => (file.id = i))
    setCollectionFiles(new_files)
  }

  const handleRemoveCollectionFile = item => {
    let array = [...collectionFiles]
    let index = array.indexOf(item)
    if (index !== -1) {
      array.splice(index, 1)
    }
    setCollectionFiles(array)
  }

  const handleChangeCollectionName = (item, value) => {
    setCollectionFiles(prevFiles => {
      let index = prevFiles.indexOf(item)
      if (index > -1) prevFiles[index].name = value
      return [...prevFiles]
    })
  }

  const handleChangeCollectionDescription = (item, value) => {
    setCollectionFiles(prevFiles => {
      let index = prevFiles.indexOf(item)
      if (index > -1) prevFiles[index].description = value
      return [...prevFiles]
    })
  }

  const handleChangeCroppedImage = (croppedImage, id) => {
    let array = [...collectionFiles]
    array.map((item, index) => {
      if (item.id === id) {
        item.croppedImage = croppedImage
      }
    })
    setCollectionFiles(array)
  }

  const addCoverImageToFile = (selectedCollectionFile, image) => {
    setCollectionFiles(prevFiles => {
      const fileIndex = prevFiles.findIndex(file => file.file === selectedCollectionFile.file)
      if (fileIndex !== -1) {
        // Create a copy of the array
        let newFiles = [...prevFiles]
        // Replace the file at the found index
        newFiles[fileIndex].nftCoverImage = image
        return newFiles
      }
      // If file not found, return the original array
      return prevFiles
    })
  }

  // step 3

  const [uploadedCount, setUploadedCount] = useState(0)

  const readFilesAndUplaod = async () => {
    dispatch({ type: 'set', isCollectionMinting: true })

    let array = []

    const collectionPublicKey = new PublicKey(collectionMintAddress)

    let collectionInfo = await mx.nfts().findByMint({ mintAddress: new PublicKey(collectionPublicKey) })
    let category = ''
    let nft_attributes = []
    collectionInfo.json.attributes?.forEach(item => {
      category += item.value + ','
      nft_attributes.push({ trait_type: 'category', value: item.value })
    })

    for (let i = 0; i < collectionFiles.length; i++) {
      let { name, description, file, croppedImage, type, nftCoverImage } = collectionFiles[i]
      name = name.trim()
      description = description.trim()
      const metadata: JsonMetadata = {
        name,
        description,
        attributes: nft_attributes,
        properties: {
          category: type === 'vr' ? type : file.type.split('/')[0],
        },
      }

      let imageFile = {
        type: file.type,
        url: await storage.upload(await toMetaplexFileFromBrowser(file)),
      }
      let assetFile = null

      if (metadata.properties.category === 'audio') {
        assetFile = imageFile
        imageFile = {
          type: 'image/png',
          url: croppedImage,
        }
      } else if (metadata.properties.category === 'video') {
        assetFile = imageFile
        let image = await fetch(croppedImage).then(r => r.blob())
        const metaplexFile = toMetaplexFile(await image.arrayBuffer(), 'image.png', {
          contentType: 'image/png',
        })
        imageFile = {
          type: 'image/png',
          url: await storage.upload(metaplexFile),
        }
      } else if (metadata.properties.category === 'vr') {
        assetFile = { type: 'vr', url: await storage.upload(await toMetaplexFileFromBrowser(file)) }
        if (nftCoverImage) {
          let image = nftCoverImage

          if (nftCoverImage.startsWith('blob:')) {
            image = await fetch(nftCoverImage).then(r => r.blob())
          }

          const metaplexFile = toMetaplexFile(await image.arrayBuffer(), 'image.png', {
            contentType: nftCoverImage.type,
          })
          imageFile = {
            type: 'image/png',
            url: await storage.upload(metaplexFile),
          }
        }
      }

      metadata.image = imageFile.url
      metadata.properties.files = [imageFile]
      if (assetFile) {
        metadata.animation_url = assetFile.url
        metadata.properties.files.push(assetFile)
      }
      const uri = await storage.uploadJson(metadata)
      const nftKeypair = Keypair.generate()
      const createNftTransaction = await mx.nfts().builders().create({
        useNewMint: nftKeypair,
        uri: uri,
        name,
        sellerFeeBasisPoints: collectionInfo.sellerFeeBasisPoints,
        collection: collectionPublicKey,
      })

      const verifyCollectionTransaction = await mx.nfts().builders().verifyCollection({
        mintAddress: nftKeypair.publicKey,
        collectionMintAddress: collectionPublicKey,
        isSizedCollection: true,
      })

      const combinedTransaction = createNftTransaction.append(verifyCollectionTransaction)
      await combinedTransaction.sendAndConfirm(mx)

      let assetUrl: any = ''
      let coverUrl: any = ''
      let assetType = metadata.properties.category
      if (assetType === 'image') {
        assetUrl = metadata.image
      } else if (assetType === 'audio') {
        assetUrl = metadata.animation_url
        coverUrl = metadata.image
      } else if (assetType === 'video') {
        assetUrl = metadata.animation_url
        coverUrl = metadata.image
      } else if (assetType === 'vr') {
        assetUrl = metadata.animation_url
        coverUrl = metadata.image
      } else {
        assetUrl = metadata.image
      }
      array.push({
        token_id: nftKeypair.publicKey.toString(),
        nft_name: metadata.name,
        asset_type: assetType,
        asset_url: assetUrl,
        cover_image_url: coverUrl,
        categories: category.slice(0, -1),
        sellerFeeBasisPoints: collectionInfo.sellerFeeBasisPoints,
      })
      setUploadedCount(i + 1)
    }
    collectionsAPI.updateCollectionNFT(collectionMintAddress, array).then(
      response => {
        setAlertData([
          {
            id: 0,
            title: 'Congratulations!',
            description: `Your NFT collection has been minted successfully.`,
            type: 'success',
          },
        ])
        setShowAlert(true)
        setTimeout(() => {
          router.push(`/collection/${collectionMintAddress}`)
        }, 500)
      },
      error => {}
    )

    // setCurrentStep(currentStep === 4 ? 4 : currentStep + 1)
    dispatch({ type: 'set', isCollectionMinting: false })
  }

  return (
    <div className="w-full">
      <Head>
        <title>Foster Marketplace</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <div className="w-full">
        {currentStep === 1 && (
          <Step01CollectionSection
            currentStep={currentStep}
            onChangeCurrentStep={step => setCurrentStep(step)}
            collectionName={collectionName}
            onChangeCollectionName={collectionName => setCollectionName(collectionName)}
            description={description}
            onChangeDescription={description => setDescription(description)}
            coverImage={coverImage}
            onChangeCoverImage={coverImage => setCoverImage(coverImage)}
            coverCroppedImage={coverCroppedImage}
            setCoverCroppedImage={coverCroppedImage => setCoverCroppedImage(coverCroppedImage)}
            setCoverAWSUrl={coverAWSUrl => setCoverAWSUrl(coverAWSUrl)}
            bannerImage={bannerImage}
            onChangeBannerImage={bannerImage => setBannerImage(bannerImage)}
            bannerCroppedImage={bannerCroppedImage}
            setBannerCroppedImage={bannerCroppedImage => setBannerCroppedImage(bannerCroppedImage)}
            setBannerAWSUrl={bannerAWSUrl => setBannerAWSUrl(bannerAWSUrl)}
            royalties={royalties}
            onChangeRoyalties={royalties => setRoyalties(royalties)}
            categoryList={categoryList}
            onChangeCategoryList={categoryList => setCategoryList(categoryList)}
            mintCollection={() => {
              mintCollection()
            }}
          />
        )}
        {currentStep === 2 && (
          <Step02CollectionSection
            currentStep={currentStep}
            coverCroppedImage={coverCroppedImage}
            onChangeCurrentStep={step => setCurrentStep(step)}
            collectionFiles={collectionFiles}
            coverImageProcessing={coverImageProcessing}
            addCoverImageToFile={addCoverImageToFile}
            onChangeCollectionFiles={collectionFiles => onChangeCollectionFiles(collectionFiles)}
            onRemoveCollectionFile={item => handleRemoveCollectionFile(item)}
            onChangeCollectionName={(item, value) => handleChangeCollectionName(item, value)}
            onChangeCollectionDescription={(item, value) => handleChangeCollectionDescription(item, value)}
            onChangeCroppedImage={(croppedImage, id) => handleChangeCroppedImage(croppedImage, id)}
          />
        )}

        <div>
          <video controls className="hidden w-full h-full z-10" id="hidden_video"></video>
        </div>

        {currentStep === 3 && (
          <Step03CollectionSection
            currentStep={currentStep}
            onChangeCurrentStep={step => setCurrentStep(step)}
            bannerCroppedImage={collectionCoverUrl}
            collectionMintName={collectionMintName}
            collectionFiles={collectionFiles}
            readFilesAndUplaod={readFilesAndUplaod}
            uploadedCount={uploadedCount}
          />
        )}
        {currentStep === 4 && (
          <SuccessMintCollectionSection
            coverCroppedImage={coverCroppedImage}
            bannerCroppedImage={collectionCoverUrl}
            mintAddress={collectionMintAddress}
          />
        )}
      </div>
      <FullScreenLoadingModal open={screenLoaded && isLoading} />
      <Alert
        open={showAlert}
        close={() => {
          setShowAlert(false)
        }}
        data={alertData}
      />
    </div>
  )
}

export default Collection

Collection.getLayout = function getLayout(page) {
  return <SecondaryLayout>{page}</SecondaryLayout>
}
