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

const Collection = () => {
  // solana
  const { metaplex: mx } = useMetaplex()

  // variables
  const [currentStep, setCurrentStep] = useState(1)
  // step 1
  const [collectionName, setCollectionName] = useState<any>('')
  const [description, setDescription] = useState<any>('')
  const [coverImage, setCoverImage] = useState<any>()
  const [bannerImage, setBannerImage] = useState<any>()
  const [categoryList, setCategoryList] = useState<any[]>([])
  const [dimension, setDimension] = useState<any>(CollectionDimensionList[0])

  const [coverCroppedImage, setCoverCroppedImage] = useState<any>()
  const [bannerCroppedImage, setBannerCroppedImage] = useState<any>()

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
  const [banner, setBanner] = useState()
  const [royalties, setRoyalties] = useState(0)
  const [collectionNft, setCollectionNft] = useState<CreateNftOutput>()

  const mintCollection = async () => {
    var reader = new FileReader()
    const fileData = new Blob([coverImage[0]])
    reader.readAsArrayBuffer(fileData)
    reader.onload = async function (event) {
      const arrayBuffer = reader.result as ArrayBuffer

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

  // step 3
  const [collectionFiles, setCollectionFiles] = useState<any[]>([])

  const onChangeCollectionFiles = files => {
    const array: any[] = []
    files.map((item, index) => {
      let object: any = {}
      object.id = index
      object.file = item
      object.name = ''
      object.description = ''
      object.croppedImage = ''
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
    console.log('============', array)
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
    console.log(array)
    setCollectionFiles(array)
  }

  const [artworks, setArtworks] = useState<any[]>([])

  const readFilesAndUplaod = async () => {
    var readCount = 0
    collectionFiles.forEach(item => {
      var reader = new FileReader()
      const fileData = new Blob([item.file])
      reader.readAsArrayBuffer(fileData)
      reader.onload = async function (event) {
        const arrayBuffer = reader.result as ArrayBuffer
        const temp = artworks
        temp.push({ id: item.id, file: arrayBuffer, name: item.name, description: item.description })
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

    if (collectionNft) {
      for (var i in artworks) {
        const { uri } = await mx
          .nfts()
          .uploadMetadata({
            name: artworks[i].name,
            description: artworks[i].description,
            attributes: attributes,
            image: toMetaplexFile(artworks[i].file, 'metaplex.png'),
          })
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
      }
    }

    setCurrentStep(currentStep === 4 ? 4 : currentStep + 1)
  }

  const reset = () => {
    setCurrentStep(1)
    setCollectionName('')
    setDescription('')
    const categories = categoryList.map(item => {
      item.checked = false
      return item
    })
    setCategoryList(categories)
    setDimension(CollectionDimensionList[0])
    setRoyalties(0)
    setCollectionFiles([])
    setCollectionNft(undefined)
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
            readFilesAndUplaod={readFilesAndUplaod}
          />
        )}
        {currentStep === 3 && (
          <Step03CollectionSection
            currentStep={currentStep}
            onChangeCurrentStep={step => setCurrentStep(step)}
            dimension={dimension}
            coverImage={coverImage}
            collectionFiles={collectionFiles}
            banner={banner}
            onChangeCollectionFiles={collectionFiles => onChangeCollectionFiles(collectionFiles)}
            onRemoveCollectionFile={item => handleRemoveCollectionFile(item)}
            onChangeCollectionName={(item, value) => handleChangeCollectionName(item, value)}
            onChangeCollectionDescription={(item, value) => handleChangeCollectionDescription(item, value)}
            readFilesAndUplaod={readFilesAndUplaod}
          />
        )}
        {currentStep === 4 && <SuccessMintCollectionSection coverImage={coverImage} banner={banner} reset={reset} />}
      </div>
    </div>
  )
}

export default Collection

Collection.getLayout = function getLayout(page) {
  return <SecondaryLayout>{page}</SecondaryLayout>
}
