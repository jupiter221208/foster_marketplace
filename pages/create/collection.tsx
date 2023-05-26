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
import ProgressingModal from 'components/Modal/ProgressingModal'
import CollectionMintProgressingModal from 'components/Modal/ProgressingModal/CollectionMintProgressingModal'

// json
import CategoryList from 'assets/json/popular-category.json'

// solana
import { useMetaplex } from 'hooks/useMetaplex'
import { useLocalWalletBundlr } from 'hooks/useLocalWalletBundlr'
import { useWallet } from '@solana/wallet-adapter-react'

import { Keypair } from '@solana/web3.js'
import { CreateNftOutput, JsonMetadata, toMetaplexFileFromBrowser } from '@metaplex-foundation/js'

// images and icons

// call apis
import collectionsAPI from 'apis/collections'
import { checkExpiryDate, loginWithSigned } from 'utils/auth'

const Collection = () => {
  const dispatch = useDispatch()
  const isLoading = useSelector<any>(state => state.isLoading)
  const isCollectionMinting = useSelector<any>(state => state.isCollectionMinting)
  // solana
  const { metaplex: mx } = useMetaplex()
  const { storage, ensureLocalWalletBalance } = useLocalWalletBundlr()
  const { publicKey, signMessage } = useWallet()

  // --------------variables------------
  const [currentStep, setCurrentStep] = useState(1)

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

  const mintCollection = async () => {
    try {
      dispatch({ type: 'set', isLoading: true })

      if (!checkExpiryDate()) {
        let signature = await signMessage(Buffer.from('Foster Protocol'))
        await loginWithSigned(publicKey, signature, dispatch)
      }

      // TODO: calculate real file size
      // for now, just fund with 0.1 sol which is little over 1GB
      await ensureLocalWalletBalance(0.1 * 1e9)

      const categories = categoryList.filter(item => item.checked)

      const attributes = categories.map(category => {
        return { trait_type: 'category', value: category.name }
      })

      let coverImageUrl = await storage.upload(await toMetaplexFileFromBrowser(coverImage[0]))
      setCoverImageUrl(coverImageUrl)

      const uri = await storage.uploadJson({
        name: collectionName,
        description: description,
        attributes: attributes,
        image: coverImageUrl,
      })

      // const result = await axios.get(uri).then(response => {
      //   return response.data
      // })

      const collectionNft = await mx.nfts().create({
        isCollection: true,
        name: collectionName,
        uri: uri,
        sellerFeeBasisPoints: royalties * 100,
      })

      if (collectionNft) {
        setCollectionNft(collectionNft)
        setCurrentStep(currentStep === 4 ? 4 : currentStep + 1)
      }
    } catch (e) {
      console.log(e)
    } finally {
      dispatch({ type: 'set', isLoading: false })
    }
  }

  const onChangeCollectionFiles = files => {
    let array: any[] = []
    files.map((item, index) => {
      let object: any = {}
      object.id = index
      object.file = item
      if (item.type === 'image/gif') {
        object.type = item.type
      } else {
        object.type = item.type.split('/')[0]
      }
      object.name = ''
      object.description = ''
      if (item.type.split('/')[0] === 'audio') {
        object.croppedImage = URL.createObjectURL(coverImage[0])
      } else if (item.type.split('/')[0] === 'image') {
        object.croppedImage = URL.createObjectURL(item)
      } else if (item.type.split('/')[0] === 'video') {
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
          })
        })
        hidden_video.currentTime = 5
      }
      array.push(object)
    })

    let new_files = [...collectionFiles, ...array]
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
    let array = [...collectionFiles]
    let index = array.indexOf(item)
    if (index !== -1) {
      array[index].name = value
    }
    setCollectionFiles(array)
  }

  const handleChangeCollectionDescription = (item, value) => {
    let array = [...collectionFiles]
    let index = array.indexOf(item)
    if (index !== -1) {
      array[index].description = value
    }
    setCollectionFiles(array)
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

  // step 3

  const [uploadedCount, setUploadedCount] = useState(0)

  const readFilesAndUplaod = async () => {
    dispatch({ type: 'set', isCollectionMinting: true })
    const categories = categoryList.filter(item => item.checked)

    let array = []

    let category = ''
    categories.forEach(item => {
      category += item.name + ','
    })

    if (collectionNft) {
      for (let i = 0; i < collectionFiles.length; i++) {
        let { name, description, attributes, file, croppedImage } = collectionFiles[i]
        const metadata: JsonMetadata = {
          name,
          description,
          attributes,
          properties: {
            category: file.type.split('/')[0],
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
            type: coverImage[0].type,
            url: coverImageUrl,
          }
        } else if (metadata.properties.category === 'video') {
          assetFile = imageFile
          imageFile = {
            type: 'image/png',
            url: croppedImage,
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
        const createNftTransaction = await mx
          .nfts()
          .builders()
          .create({
            useNewMint: nftKeypair,
            uri: uri,
            name,
            sellerFeeBasisPoints: royalties * 100,
            collection: collectionNft?.mintAddress,
          })

        const verifyCollectionTransaction = await mx.nfts().builders().verifyCollection({
          mintAddress: nftKeypair.publicKey,
          collectionMintAddress: collectionNft?.mintAddress,
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
        })
        setUploadedCount(i + 1)
      }
    }

    let collectionInfo = {
      collection_id: collectionNft.mintAddress.toString(),
      collection_name: collectionName,
      description: description,
      banner_image: bannerAWSUrl,
      cover_image: coverAWSUrl,
      categories: category.slice(0, -1),
      nfts: array,
    }

    collectionsAPI.mintCollection(collectionInfo).then(
      response => {},
      error => {}
    )
    setCurrentStep(currentStep === 4 ? 4 : currentStep + 1)
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
            mintCollection={mintCollection}
          />
        )}
        {currentStep === 2 && (
          <Step02CollectionSection
            currentStep={currentStep}
            coverCroppedImage={coverCroppedImage}
            onChangeCurrentStep={step => setCurrentStep(step)}
            collectionFiles={collectionFiles}
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
            coverCroppedImage={coverCroppedImage}
            bannerCroppedImage={bannerCroppedImage}
            collectionFiles={collectionFiles}
            readFilesAndUplaod={readFilesAndUplaod}
            uploadedCount={uploadedCount}
          />
        )}
        {currentStep === 4 && (
          <SuccessMintCollectionSection
            coverCroppedImage={coverCroppedImage}
            bannerCroppedImage={bannerCroppedImage}
            collectionNft={collectionNft}
          />
        )}
      </div>
      <ProgressingModal open={isLoading} />
      <CollectionMintProgressingModal
        open={isCollectionMinting}
        collectionFiles={collectionFiles}
        uploadedCount={uploadedCount}
      />
    </div>
  )
}

export default Collection

Collection.getLayout = function getLayout(page) {
  return <SecondaryLayout>{page}</SecondaryLayout>
}
