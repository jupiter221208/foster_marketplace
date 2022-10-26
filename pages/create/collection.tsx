import React, { useEffect, useState } from 'react'

// next components
import Head from 'next/head'

// components
import SecondaryLayout from 'components/Layout/SecondaryLayout'
import SuccessMintCollectionSection from 'components/pages/Create/Collection/SuccessMintCollectionSection'
import Step01CollectionSection from 'components/pages/Create/Collection/Step01CollectionSection'
import Step02CollectionSection from 'components/pages/Create/Collection/Step02CollectionSection'
import Step03CollectionSection from 'components/pages/Create/Collection/Step03CollectionSection'

// json
import CollectionDimensionList from 'assets/json/nft-dimension-list.json'
import CategoryList from 'assets/json/popular-category.json'

// solana
import { useMetaplex } from 'hooks/useMetaplex'
import { CreateNftOutput, JsonMetadata, MetaplexFile, toMetaplexFile } from '@metaplex-foundation/js'

// call apis
import axios from 'axios'
import collectionsApi from 'apis/collections'

const Collection = () => {
  // solana
  const { metaplex: mx } = useMetaplex()

  // variables
  const [currentStep, setCurrentStep] = useState(1)
  // step 1
  const [collectionName, setCollectionName] = useState<any>('')
  const [description, setDescription] = useState<any>('')
  const [coverImage, setCoverImage] = useState<any>()
  const [coverCroppedImage, setCoverCroppedImage] = useState<any>()
  const [coverImageURL, setCoverImageURL] = useState('')
  const [bannerImage, setBannerImage] = useState<any>()
  const [bannerCroppedImage, setBannerCroppedImage] = useState<any>()
  const [bannerImageURL, setBannerImageURL] = useState('')
  const [categoryList, setCategoryList] = useState<any[]>([])
  const [dimension, setDimension] = useState<any>(CollectionDimensionList[0])

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
  const [royalties, setRoyalties] = useState(0)
  const [collectionNft, setCollectionNft] = useState<CreateNftOutput>()
  const [coverImageBuffer, setCoverImageButter] = useState(null)

  const mintCollection = async () => {
    let reader = new FileReader()
    // it should be coverCroppedImage instead of coverImage
    // banner image should be uploaded
    const fileData = new Blob([coverImage[0]])
    reader.readAsArrayBuffer(fileData)
    reader.onload = async function (event) {
      const arrayBuffer = reader.result as ArrayBuffer
      setCoverImageButter(arrayBuffer)

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
      setCoverImageURL(result.image)
      // Please update banner image url
      setBannerImageURL(result.image)

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
    }
  }

  const onChangeCollectionFiles = files => {
    const array: any[] = []
    files.map((item, index) => {
      let object: any = {}
      object.id = index
      object.file = item
      object.type = item.type.split('/')[0]
      object.name = ''
      object.description = ''
      object.croppedImage = URL.createObjectURL(item)
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
  const [collectionFiles, setCollectionFiles] = useState<any[]>([])

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
          description: item.description 
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

        if(artworks[i].type === 'image') {
          metadata.image = toMetaplexFile(artworks[i].file, 'metaplex.png')
          metadata.category = 'image'
        } else if (artworks[i].type === 'video') {
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
        } else if (artworks[i].type === 'audio') {
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

        const { uri } = await mx
          .nfts()
          .uploadMetadata(metadata)
          .run()

        const nft = await mx
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

        array.push({ token_id: nft.mintAddress.toString(), nft_name: nft.nft.name, categories: category.slice(0, -1) })
        setUploadedCount(i + 1)
      }
    }

    let collectionInfo = {
      collection_id: collectionNft.mintAddress.toString(),
      collection_name: collectionName,
      banner_image: bannerImageURL,
      cover_image: coverImageURL,
      categories: category.slice(0, -1),
      nfts: array,
    }
    collectionsApi.mintCollection(collectionInfo).then(
      response => {},
      error => {
        console.log(error)
      }
    )
    setCurrentStep(currentStep === 4 ? 4 : currentStep + 1)
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
            bannerImage={bannerImage}
            onChangeBannerImage={bannerImage => setBannerImage(bannerImage)}
            bannerCroppedImage={bannerCroppedImage}
            setBannerCroppedImage={bannerCroppedImage => setBannerCroppedImage(bannerCroppedImage)}
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
            dimension={dimension}
            onChangeDimension={dimension => setDimension(dimension)}
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
    </div>
  )
}

export default Collection

Collection.getLayout = function getLayout(page) {
  return <SecondaryLayout>{page}</SecondaryLayout>
}
