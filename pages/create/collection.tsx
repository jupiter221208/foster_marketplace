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
import { CreateNftOutput, JsonMetadata, MetaplexFile, toMetaplexFile } from '@metaplex-foundation/js'

// images and icons
import AudioPlayer from 'assets/images/audio-player.png'

// call apis
import axios from 'axios'
import collectionsAPI from 'apis/collections'

const Collection = () => {
  const dispatch = useDispatch()
  const isLoading = useSelector<any>(state => state.isLoading)
  const isCollectionMinting = useSelector<any>(state => state.isCollectionMinting)
  // solana
  const { metaplex: mx } = useMetaplex()

  // variables
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
  const [coverImageBuffer, setCoverImageBuffer] = useState(null)

  const mintCollection = async () => {
    dispatch({ type: 'set', isLoading: true })
    let reader = new FileReader()
    const fileData = new Blob([coverImage[0]])
    reader.readAsArrayBuffer(fileData)
    reader.onload = async function (event) {
      const arrayBuffer = reader.result as ArrayBuffer
      setCoverImageBuffer(arrayBuffer)

      const categories = categoryList.filter(item => item.checked)

      const attributes = categories.map(category => {
        return { trait_type: 'category', value: category.name }
      })

      const { uri } = await mx
        .nfts()
        .uploadMetadata({
          name: collectionName,
          description: description,
          attributes: attributes,
          image: toMetaplexFile(arrayBuffer, 'metaplex.png'),
        })
        .run()

      const result = await axios.get(uri).then(response => {
        return response.data
      })

      const collectionNft = await mx
        .nfts()
        .create({
          isCollection: true,
          name: collectionName,
          uri: uri,
          sellerFeeBasisPoints: royalties,
        })
        .run()

      if (collectionNft) {
        setCollectionNft(collectionNft)
        setCurrentStep(currentStep === 4 ? 4 : currentStep + 1)
      }
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
        object.croppedImage = AudioPlayer.src
      } else if (item.type.split('/')[0] === 'image') {
        object.croppedImage = URL.createObjectURL(item)
      }

      array.push(object)
    })
    setCollectionFiles(array)
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

  const [artworks, setArtworks] = useState<any[]>([])

  const [uploadedCount, setUploadedCount] = useState(0)

  const readFilesAndUplaod = async () => {
    let readCount = 0
    collectionFiles.forEach(item => {
      let reader = new FileReader()
      const fileData = new Blob([item.file])
      reader.readAsArrayBuffer(fileData)
      reader.onload = async function (event) {
        const arrayBuffer = reader.result as ArrayBuffer
        const temp = artworks
        temp.push({
          id: item.id,
          file: arrayBuffer,
          name: item.name,
          type: item.type,
          description: item.description,
        })
        setArtworks(temp)
        readCount++
        if (readCount === collectionFiles.length) {
          uploadArtworks()
        }
      }
    })
  }

  const uploadArtworks = async () => {
    dispatch({ type: 'set', isCollectionMinting: true })
    const categories = categoryList.filter(item => item.checked)

    const attributes = categories.map(category => {
      return { trait_type: 'category', value: category.name }
    })
    let array = []

    let category = ''
    categories.forEach(item => {
      category += item.name + ','
    })

    if (collectionNft) {
      for (let i = 0; i < artworks.length; i++) {
        const metadata: JsonMetadata<MetaplexFile> = {
          name: artworks[i].name,
          description: artworks[i].description,
          attributes: attributes,
        }
        let assetType = artworks[i].type
        if (assetType === 'image') {
          metadata.image = toMetaplexFile(artworks[i].file, 'metaplex.png')
          metadata.category = 'image'
        } else if (assetType === 'image/gif') {
          const file = toMetaplexFile(artworks[i].file, 'metaplex.gif', { contentType: 'image/gif' })
          const fileURL = await mx.storage().upload(file)
          metadata.animation_url = fileURL
          metadata.category = 'image'
        } else if (assetType === 'video') {
          metadata.image = toMetaplexFile(coverImageBuffer, 'metaplex.png')
          const file = toMetaplexFile(artworks[i].file, 'metaplex.mp4', { contentType: 'video/mp4' })
          const fileURL = await mx.storage().upload(file)
          metadata.animation_url = fileURL
          metadata.category = 'video'
          metadata.properties = {
            files: [
              {
                type: 'video/mp4',
                url: fileURL,
              },
            ],
          }
        } else if (assetType === 'audio') {
          metadata.image = toMetaplexFile(coverImageBuffer, 'metaplex.png')
          const file = toMetaplexFile(artworks[i].file, 'metaplex.mp3', { contentType: 'audio/mp3' })
          const fileURL = await mx.storage().upload(file)
          metadata.animation_url = fileURL
          metadata.category = 'audio'
          metadata.properties = {
            files: [
              {
                type: 'audio/mp3',
                url: fileURL,
              },
            ],
          }
        }

        const { uri } = await mx.nfts().uploadMetadata(metadata).run()

        const nft: any = await mx
          .nfts()
          .create({
            uri: uri,
            name: artworks[i].name,
            sellerFeeBasisPoints: royalties,
            collection: collectionNft?.mintAddress,
          })
          .run()

        await mx
          .nfts()
          .verifyCollection({
            mintAddress: nft.mintAddress,
            collectionMintAddress: collectionNft?.mintAddress,
            isSizedCollection: true,
          })
          .run()

        let assetUrl: any = ''
        let coverUrl: any = ''
        if (assetType === 'image') {
          assetUrl = nft.nft.json.image
        } else if (assetType === 'image/gif') {
          assetUrl = metadata.animation_url
        } else if (assetType === 'audio') {
          assetUrl = nft.nft.json.animation_url
          coverUrl = nft.nft.json.image
        } else if (assetType === 'video') {
          assetUrl = metadata.animation_url
        } else {
          assetUrl = nft.nft.json.image
        }
        array.push({
          token_id: nft.mintAddress.toString(),
          nft_name: nft.nft.name,
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
        <link rel="icon" href="/logo.svg" />
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
            onChangeCurrentStep={step => setCurrentStep(step)}
            collectionFiles={collectionFiles}
            onChangeCollectionFiles={collectionFiles => onChangeCollectionFiles(collectionFiles)}
            onRemoveCollectionFile={item => handleRemoveCollectionFile(item)}
            onChangeCollectionName={(item, value) => handleChangeCollectionName(item, value)}
            onChangeCollectionDescription={(item, value) => handleChangeCollectionDescription(item, value)}
            onChangeCroppedImage={(croppedImage, id) => handleChangeCroppedImage(croppedImage, id)}
          />
        )}
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
