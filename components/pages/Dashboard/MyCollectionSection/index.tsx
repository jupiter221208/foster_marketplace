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
import { getMyCollections } from 'utils/collection.util'
import { getPriceValue } from 'utils/strings'

const MyCollectionSection = () => {
  const dispatch = useDispatch()
  const isLoading = useSelector<any>(state => state.isLoading)
  
  const [collections, setCollections] = useState([])
  const [collectionList, setCollectionList] = useState([])

  const { metaplex: mx } = useMetaplex()

  useEffect(() => {
    const getCollections = async () => {
      dispatch({ type: 'set', isLoading: true })
      const collections = await getMyCollections(mx)
      setCollections(collections)
      dispatch({ type: 'set', isLoading: false })
    }
    if(mx) getCollections()
  }, [mx])

  return (
    <section className={styles.container}>
      <div className="w-full mt-[15px] lg:mt-[34px] gap-[11px] lg:gap-[32px] grid grid-cols-12">
        {!isLoading && collectionList.map((item, index) => (
          <div className="col-span-6 lg:col-span-3" key={index}>
            <CollectionCard
              image={item.offchainMetadata.image}
              nftName={item.offchainMetadata.name}
              category={item.offchainMetadata.attributes}
              artistName={item.creators[0].address.toString()}
              mintAddress={item.mintAddress.toString()}
              price={getPriceValue(item.floorPrice)}
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
