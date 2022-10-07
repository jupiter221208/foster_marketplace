import React, { useEffect, useState } from 'react'

// components
import CollectionCard from 'components/Card/CollectionCard'
import Pagination from 'components/Button/Pagination'
import LoadingModal from 'components/Modal/LoadingModal'

// styles
import styles from './index.module.scss'

// redux
import { useDispatch, useSelector } from 'react-redux'

// solana
import { useMetaplex } from 'hooks/useMetaplex'
import { useWallet } from '@solana/wallet-adapter-react'

const MyCollectionSection = () => {
  const dispatch = useDispatch()
  const isLoading = useSelector<any>(state => state.isLoading)
  
  const [collections, setCollections] = useState([])
  const [collectionList, setCollectionList] = useState([])

  const { metaplex: mx } = useMetaplex()
  const { publicKey } = useWallet()

  useEffect(() => {
    const getCollections = async () => {
      if ( !publicKey ) {
        setCollections([])
        return
      }
      dispatch({ type: 'set', isLoading: true })
      try {
        const nfts = await (await mx.nfts().findAllByOwner({ owner: publicKey }).run()).filter(nft => nft.collectionDetails)

        const collections = (
          await Promise.all(
            nfts.map(async nft => {
              var item = { ...nft, offchainMetadata: null }

              try {
                item.offchainMetadata = await fetch(nft.uri).then(r => r.json())
              } catch (e) {
                console.log("failed to pull off chain metadata for collection")
                console.log(e)
              }

              return item
            })
          )
        ).filter(collection => collection.offchainMetadata)
        
        setCollections(collections)
      } catch (e) {
        console.log("failed to get collections")
        console.log(e)
      }
      dispatch({ type: 'set', isLoading: false })
    }
    getCollections()
  }, [publicKey])

  return (
    <section className={styles.container}>
      <div className="w-full mt-[15px] lg:mt-[34px] gap-[11px] lg:gap-[32px] grid grid-cols-12">
        {collectionList.map((item, index) => (
          <div className="col-span-6 lg:col-span-3" key={index}>
            <CollectionCard
              image={item.offchainMetadata.image}
              nftName={item.offchainMetadata.name}
              category={item.offchainMetadata.attributes}
              artistName={item.creators[0].address.toString()}
              mintAddress={item.mintAddress.toString()}
              // nfts={item.nfts}
              // icon={item.icon}
              price={10}
            />
          </div>
        ))}
      </div>
      <div className="col-span-12">
        <LoadingModal open={isLoading} />
      </div>
      <div className="w-full flex justify-end">
        <Pagination data={collections} getCurrentData={data => setCollectionList(data)} />
      </div>
    </section>
  )
}

export default MyCollectionSection
